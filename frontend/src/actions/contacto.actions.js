"use server";

import nodemailer from "nodemailer";

/**
 * @description Envía un mensaje de contacto a través de correo electrónico (Nodemailer).
 * @param {Object} datosContacto - Objeto con nombre, apellido, correo, asunto y mensaje.
 * @returns {Promise<Object>} Resultado del envío del correo.
 */
export async function enviarMensajeContacto(datosContacto) {
  try {
    const { nombre, apellido, correo, asunto, mensaje } = datosContacto;

    if (!nombre || !apellido || !correo || !asunto || !mensaje) {
      return { success: false, message: "Todos los campos son obligatorios." };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: `"${nombre} ${apellido}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      replyTo: correo,
      subject: `Contacto AgroTrack: ${asunto}`,
      html: `
        <div style="font-family: Arial; color: #171717;">
          <h2 style="color: #157937;">Nuevo mensaje de contacto</h2>
          <p><strong>Remitente:</strong> ${nombre} ${apellido}</p>
          <p><strong>Correo:</strong> ${correo}</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <div style="background-color: #f8fbf9; padding: 15px; margin-top: 15px;">
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
          </div>
        </div>
      `,
    };

    // Envío del correo
    const info = await transporter.sendMail(mailOptions);
    
    // Verificación en consola del backend
    console.log("✅ Correo enviado con ID:", info.messageId);

    return { success: true, message: "¡Mensaje enviado con éxito!" };

  } catch (error) {
    
    console.error("Error de configuración en Nodemailer:", error);
    return { success: false, message: `Error al enviar: ${error.message}` };
  }
}