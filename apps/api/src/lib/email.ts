import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  const appName = "hugg";
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #f0f0f0">
      <h2 style="margin-top:0;color:#111">Confirmação de e-mail</h2>
      <p style="color:#555">Use o código abaixo para confirmar seu cadastro no <strong>${appName}</strong>.</p>
      <div style="letter-spacing:8px;font-size:32px;font-weight:700;color:#f97316;text-align:center;padding:24px 0">${code}</div>
      <p style="color:#999;font-size:13px">Este código expira em 10 minutos. Se você não solicitou isso, ignore este e-mail.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `"hugg" <noreply@hugg.app>`,
    to,
    subject: `${code} é o seu código hugg`,
    html,
  });
}
