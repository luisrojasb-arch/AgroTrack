import nodemailer from "nodemailer";

export const enviarCorreoRecuperacion = async (correo, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AgroTrack" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: "Recuperación de Contraseña - AgroTrack",
    html: `
      <div style="font-family: Arial, sans-serif; max-w-xl; margin: 0 auto; padding: 20px; border: 1px solid #E4E7EC; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #229A48;">AgroTrack</h1>
        </div>
        <h2 style="color: #101828;">Recuperación de Contraseña</h2>
        <p style="color: #475467; line-height: 1.6;">Has solicitado restablecer tu contraseña en AgroTrack. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #229A48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer mi contraseña</a>
        </div>
        <p style="color: #475467; font-size: 14px;">Este enlace expirará en 1 hora.</p>
        <p style="color: #475467; font-size: 14px;">Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
