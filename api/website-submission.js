/* global process */
import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'
import multer from 'multer'

const required = ['templateId', 'templateName', 'name', 'email', 'main']
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char])
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')),
})
const createEmailHtml = (body, files, submissionId, submittedAt) => {
  const rows = [
    ['Submission ID', submissionId],
    ['Submitted', submittedAt],
    ['Name', body.name],
    ['Email', body.email],
    ['Template', body.templateName],
    ['Project', body.main],
    ['Website type', body.websiteType || 'Wedding'],
    ['Details', body.detail || 'Not provided'],
    ['Accent color', body.color || 'Not selected'],
    ['Uploaded files', files.map((file) => file.originalname).join(', ') || 'None'],
    ['Notes', body.notes || 'None'],
  ]
  const rowMarkup = rows.map(([label, value]) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b7280;font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#111827;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')
  return `<div style="margin:0;background:#f6f3ef;padding:32px 16px;font-family:Arial,sans-serif;color:#111827"><div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e0da;border-radius:12px;overflow:hidden"><div style="background:#2f3431;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d9b8a8">Wedding Website Studio</div><h1 style="margin:8px 0 0;font-size:24px;font-weight:600">New website request</h1></div><div style="padding:24px 28px"><p style="margin:0 0 18px;color:#4b5563">A new wedding website request has been submitted.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${rowMarkup}</table><p style="margin:24px 0 0;color:#6b7280;font-size:12px">Reply to this email to contact the customer directly.</p></div></div></div>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await new Promise((resolve, reject) => upload.array('files', 10)(req, res, (error) => error ? reject(error) : resolve()))
  } catch (error) {
    console.error('File upload failed', error)
    return res.status(400).json({ error: 'Each image or video must be 10 MB or smaller, with a maximum of 10 files.' })
  }
  const body = req.body || {}
  const files = req.files || []
  const missing = required.filter((key) => !body[key])
  if (missing.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return res.status(400).json({ error: 'Please provide all required fields.' })
  const hasSheetsConfiguration = Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID)
  const receiverEmail = process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL
  const hasEmailConfiguration = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS && receiverEmail)
  if (!hasSheetsConfiguration && !hasEmailConfiguration) return res.status(503).json({ error: 'Submission service is not configured.' })

  const submissionId = crypto.randomUUID()
  const submittedAt = new Date().toISOString()
  const answers = Object.entries(body).filter(([key]) => !required.includes(key) && key !== 'files').map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).concat(files.length ? [`files: ${files.map((file) => file.originalname).join(', ')}`] : []).join(' | ')
  const row = [submissionId, submittedAt, body.templateId, body.templateName, body.name, body.email, body.main, body.websiteType || body.templateName, body.detail || '', body.color || '', answers, 'saved']
  if (hasSheetsConfiguration) {
    const auth = new google.auth.GoogleAuth({ credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') }, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
    const sheets = google.sheets({ version: 'v4', auth })
    try {
      await sheets.spreadsheets.values.append({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: 'Submissions!A:L', valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] } })
    } catch (error) {
      console.error('Google Sheets submission failed', error)
      if (!hasEmailConfiguration) return res.status(502).json({ error: 'Could not save your submission.' })
    }
  }
  if (hasEmailConfiguration) {
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } })
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: receiverEmail, replyTo: body.email, subject: `New wedding website request - ${body.templateName}`, html: createEmailHtml(body, files, submissionId, submittedAt), attachments: files.map((file) => ({ filename: file.originalname, content: file.buffer, contentType: file.mimetype })) })
    } catch (error) { console.error('Notification email failed', error) }
  }
  return res.status(201).json({ submissionId, status: 'saved' })
}

export const config = { api: { bodyParser: false } }
