import nodemailer from "nodemailer";

const email = process.env.GMAIL_EMAIL;
const password = process.env.GMAIL_PASSWORD;

// Send email
export async function sendEmail({
  subject,
  text,
  to,
  html,
  from = `Microblog <${email}>`,
}) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: email, pass: password },
  });

  return await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}
