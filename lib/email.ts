import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  const html = `
    <h1>Verify your email</h1>
    <p>Click the link below to verify your email address:</p>
    <a href="${confirmLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
      Verify Email
    </a>
    <p>This link will expire in 24 hours.</p>
    <p>Or copy and paste this URL into your browser:</p>
    <p>${confirmLink}</p>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: html,
    });

    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
