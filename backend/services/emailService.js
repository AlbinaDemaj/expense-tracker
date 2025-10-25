import nodemailer from 'nodemailer';

const {
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
  EMAIL_FROM,
  EMAIL_TO
} = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: BREVO_SMTP_USER && BREVO_SMTP_PASS ? { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS } : undefined,
});

export async function sendBudgetAlert({ total, limit }) {
  if (!BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
    console.warn('Email not configured. Skipping alert.');
    return { ok: false, error: 'EMAIL_NOT_CONFIGURED' };
  }

  const mailOptions = {
    from: EMAIL_FROM || 'no-reply@example.com',
    to: EMAIL_TO || 'you@example.com',
    subject: `Budget exceeded: $${total.toFixed(2)} (limit $${limit})`,
    text: `Your expenses exceeded the budget limit.\n\nTotal: $${total.toFixed(2)}\nLimit: $${limit}\n\n— Expense Tracker`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { ok: true, data: info.messageId };
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return { ok: false, error: 'EMAIL_SEND_FAILED' };
  }
}
