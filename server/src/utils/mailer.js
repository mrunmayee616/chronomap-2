import nodemailer from 'nodemailer'

const hasSmtpConfig = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
)

let transporter = null
if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

/**
 * Sends the verification email. If no SMTP credentials are configured
 * (e.g. in local development), it logs the link to the console instead
 * of failing, and the caller can still surface a dev preview link.
 * Returns { sent, previewUrl }.
 */
export async function sendVerificationEmail({ to, fullName, verifyUrl }) {
  const subject = 'Verify your ChronoMap account'
  const text = `Hi ${fullName},\n\nWelcome to ChronoMap! Please verify your email address by opening this link:\n\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create this account, you can ignore this email.\n`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0a0e1e">Welcome to ChronoMap, ${escapeHtml(fullName)}!</h2>
      <p>Please verify your email address to activate your account.</p>
      <p style="margin:24px 0">
        <a href="${verifyUrl}" style="background:#f7c740;color:#0a0e1e;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">
          Verify my email
        </a>
      </p>
      <p>Or copy this link into your browser:<br/><span style="word-break:break-all">${verifyUrl}</span></p>
      <p style="color:#888;font-size:13px">This link expires in 24 hours.</p>
    </div>
  `

  if (!transporter) {
    // Dev fallback: no SMTP configured, so we just log it and report a preview URL.
    console.log('\n[dev-mail] SMTP not configured — verification link for', to)
    console.log('[dev-mail]', verifyUrl, '\n')
    return { sent: false, previewUrl: verifyUrl }
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"ChronoMap" <no-reply@chronomap.app>`,
    to,
    subject,
    text,
    html,
  })
  return { sent: true, previewUrl: null }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}
