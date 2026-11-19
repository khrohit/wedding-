# Narrative Template Studio

A React + Vite template marketplace with static HTML previews, a dynamic project intake form, resource monitoring, and a bandwidth planning calculator.

## Requirements

- Node.js 20+
- npm
- Gmail account with a Gmail App Password

## Local development

```bash
npm install
```

Create a `.env` file from `.env.example` and set:

```text
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
RECEIVER_EMAIL=your-gmail@gmail.com
PORT=3001
```

Run the frontend and local email server in separate terminals:

```bash
npm run dev:server
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/submit` to the Express server at `http://localhost:3001`.

The form sends JSON to `POST /api/submit`. The local server validates required fields, validates email format, limits requests to five submissions per IP per 15 minutes, escapes email HTML, and sends through Gmail SMTP.

To create a Gmail App Password, enable 2-Step Verification in your Google account, open **Security → App passwords**, create a password for this project, and place the generated value in `EMAIL_PASS`. Never use your regular Gmail password or commit `.env`.

`npm run build` and `npm run lint` are the production checks.

## Vercel deployment

Import the repository into Vercel with the project root set to this directory. Vercel will build the Vite app and expose `api/website-submission.js` as a serverless function. Add these variables in **Project Settings > Environment Variables**; never prefix them with `VITE_`:

```text
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
EMAIL_USER=
EMAIL_PASS=
RECEIVER_EMAIL=
ADMIN_EMAIL=
```

Create a `Submissions` sheet with columns matching the API row order:

`Submission ID`, `Submission Date`, `Template ID`, `Template Name`, `Customer Name`, `Customer Email`, `Website Name`, `Website Type`, `Description`, `Selected Color`, `Other template-specific answers`, `Submission Status`

Share the spreadsheet with `GOOGLE_CLIENT_EMAIL`. `GOOGLE_PRIVATE_KEY` may be pasted with escaped `\n` characters; the API restores them server-side. Gmail should use an app password rather than a regular account password.

Email notifications work independently of Google Sheets. Configure `EMAIL_USER`, `EMAIL_PASS`, and `RECEIVER_EMAIL` for the local Express server and Vercel; `ADMIN_EMAIL` remains supported as a production fallback. Google Sheets variables are only needed if spreadsheet storage is also required. Vercel uses `/api/website-submission`; local Vite development uses `/api/submit` through the Express proxy.

## Testing submissions

Use the form in the browser for a successful delivery test. For validation checks:

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/api/submit -ContentType 'application/json' -Body '{}'
```

This should return a `400` response for missing required fields. Do not claim an email was delivered unless the successful form submission is confirmed in the receiver inbox.

## Troubleshooting

- `Email service is not configured`: check `EMAIL_USER`, `EMAIL_PASS`, and `RECEIVER_EMAIL` in `.env`, then restart `npm run dev:server`.
- `Invalid login`: create a new Gmail App Password and confirm 2-Step Verification is enabled.
- `Too many submissions`: wait 15 minutes or restart the local server.
- `404 /api/submit`: start the Express server with `npm run dev:server`; regular Vite alone does not provide the API.

## Templates

Preview files remain plain HTML/CSS/JS under `public/templates/<template-id>/`. They are opened directly in a new browser tab, so they are not converted into React components. Add assets inside the same template directory and use relative paths from its `index.html`.

## Monitoring notes

The Resource Monitor view is intentionally based on browser Resource Timing data and labels its limitations: cached and cross-origin resources may not be represented, and videos are tracked separately because they may be loaded on demand. The bandwidth calculator is an estimate, not Vercel billing data. Actual Vercel usage should be added behind a server-side Vercel API integration before displaying it as authoritative.
"# wedding-" 
