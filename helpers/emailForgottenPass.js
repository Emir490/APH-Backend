import nodemailer from "nodemailer";

const emailForgottenPass = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, name, token} = datos;
    
    // Enviar el email

    const info = await transport.sendMail({
        from: "APH - Administrador de Pacientes de Hospital",
        to: email,
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola: ${name}, has solicitado reestablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>
        <p>Si tú no solicitaste esto, ignora el correo</p>`
    });

    console.log("Mensaje enviado: %s", info.messageId);
}

export default emailForgottenPass;