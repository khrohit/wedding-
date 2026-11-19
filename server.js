import 'dotenv/config'
import crypto from 'node:crypto'
import express from 'express'
import multer from 'multer'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.PORT) || 3001
const submissionsByIp = new Map()
const rateWindowMs = 15 * 60 * 1000
const maxRequestsPerWindow = 5
const maxFieldLength = 2000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 10 * 1024 * 1024 },
  fileFilter: (request, file, callback) => callback(null, file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')),
})

app.use(express.json({ limit: '100kb' }))

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}[character]))

const cleanText = (value, maxLength = maxFieldLength) => (
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
)

const getClientIp = (request) => request.ip || request.socket.remoteAddress || 'unknown'

const createEmailHtml = (submission, submissionId, submittedAt) => {
  const rows = [
    ['Submission ID', submissionId],
    ['Submitted', submittedAt],
    ['Name', submission.name],
    ['Email', submission.email],
    ['Template', submission.templateName],
    ['Project', submission.main],
    ['Website type', submission.websiteType || 'Wedding'],
    ['Details', submission.detail || 'Not provided'],
    ['Accent color', submission.color || 'Not selected'],
    ['Uploaded files', submission.files.join(', ') || 'None'],
    ['Notes', submission.notes || 'None'],
  ]
  const rowMarkup = rows.map(([label, value]) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b7280;font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#111827;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')
  return `<div style="margin:0;background:#f6f3ef;padding:32px 16px;font-family:Arial,sans-serif;color:#111827"><div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e0da;border-radius:12px;overflow:hidden"><div style="background:#2f3431;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d9b8a8">Wedding Website Studio</div><h1 style="margin:8px 0 0;font-size:24px;font-weight:600">New website request</h1></div><div style="padding:24px 28px"><p style="margin:0 0 18px;color:#4b5563">A new wedding website request has been submitted.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${rowMarkup}</table><p style="margin:24px 0 0;color:#6b7280;font-size:12px">Reply to this email to contact the customer directly.</p></div></div></div>`
}

const isRateLimited = (ip) => {
  const now = Date.now()
  const recentRequests = (submissionsByIp.get(ip) || []).filter((timestamp) => now - timestamp < rateWindowMs)
  recentRequests.push(now)
  submissionsByIp.set(ip, recentRequests)
  return recentRequests.length > maxRequestsPerWindow
}

app.post('/api/submit', upload.array('files', 10), async (request, response) => {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) return response.status(429).json({ error: 'Too many submissions. Please try again later.' })

  const body = request.body || {}
  const submission = {
    templateId: cleanText(body.templateId, 120),
    templateName: cleanText(body.templateName, 120),
    name: cleanText(body.name, 120),
    email: cleanText(body.email, 254),
    main: cleanText(body.main),
    websiteType: cleanText(body.websiteType, 120),
    detail: cleanText(body.detail),
    color: cleanText(body.color, 30),
    notes: cleanText(body.notes),
    files: request.files.map((file) => cleanText(file.originalname, 160)),
  }

  if (!submission.templateId || !submission.templateName || !submission.name || !submission.email || !submission.main) {
    return response.status(400).json({ error: 'Please provide all required fields.' })
  }
  if (!emailPattern.test(submission.email)) return response.status(400).json({ error: 'Please provide a valid email address.' })
  if (body.website) return response.status(400).json({ error: 'Invalid submission.' })

  const emailUser = cleanText(process.env.EMAIL_USER, 254)
  const emailPass = process.env.EMAIL_PASS
  const receiverEmail = cleanText(process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL, 254)
  if (!emailUser || !emailPass || !receiverEmail) return response.status(503).json({ error: 'Email service is not configured.' })

  const submissionId = crypto.randomUUID()
  const submittedAt = new Date().toISOString()
  const detailLines = [
    `Submission ID: ${submissionId}`,
    `Submitted: ${submittedAt}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Template: ${submission.templateName}`,
    `Project: ${submission.main}`,
    `Website type: ${submission.websiteType || 'Wedding'}`,
    `Details: ${submission.detail || 'Not provided'}`,
    `Accent color: ${submission.color || 'Not selected'}`,
    `Uploaded files: ${submission.files.join(', ') || 'None'}`,
    `Notes: ${submission.notes || 'None'}`,
  ]

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    })
    await transporter.sendMail({
      from: emailUser,
      to: receiverEmail,
      replyTo: submission.email,
      subject: `New wedding website request - ${submission.templateName}`,
      text: `A new wedding website request was submitted.\n\n${detailLines.join('\n')}`,
      html: createEmailHtml(submission, submissionId, submittedAt),
      attachments: request.files.map((file) => ({ filename: file.originalname, content: file.buffer, contentType: file.mimetype })),
    })
    return response.status(201).json({ ok: true, submissionId })
  } catch (error) {
    console.error('Unable to send submission email:', error)
    return response.status(502).json({ error: 'Unable to send submission email.' })
  }
})

app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError || error?.message === 'Unexpected field') {
    return response.status(400).json({ error: 'Each image or video must be 10 MB or smaller, with a maximum of 10 files.' })
  }
  return next(error)
})

app.listen(port, () => {
  console.log(`Email server listening on http://localhost:${port}`)
})
