import nodemailer from "nodemailer";

const emailRegister = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, name, token} = data;

    // Enviar email
    const info = await transport.sendMail({
        from: "APH - Administrador de Pacientes de Hospital",
        to: email,
        subject: "Comprueba tu cuenta en APH",
        text: "Comprueba tu cuenta en APH",
        html: `<p>Hola: ${name}, comprueba tu cuenta en APH.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este correo</p>`
    });

    console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegister;