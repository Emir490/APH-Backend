import Doctor from "../models/Doctor.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generarId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgottenPass from "../helpers/emailForgottenPass.js"

const register = async (req, res) => {
    const { name, email } = req.body;

    // Prevenir usuarios duplicados
    const userExists = await Doctor.findOne({email});

    if (userExists) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo doctor
        const doctor = new Doctor(req.body);
        const savedDoctor = await doctor.save();

        // Enviar email
        emailRegister({
            email, 
            name, 
            token: savedDoctor.token
        })

        res.json(savedDoctor);
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    const { doctor } = req;

    res.json({doctor});
}

const confirms = async (req, res) => {
    const { token } = req.params;

    const userConfirms = await Doctor.findOne({token})

    // Valida si el token es correcto
    if (!userConfirms) {
        const error = new Error("Token inválido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        // Modificando los campos token y confirm, guardando en la base de datos
        userConfirms.token = null;
        userConfirms.confirm = true;
        await userConfirms.save();

        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await Doctor.findOne({email});

    // Comprobando si el usuario existe
    if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Combrobar que el usuario este confirmado
    if (!user.confirm) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    if (await user.checkPassword(password)) {
        // Envia la información del usuario
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        })
    } else {
        const error = new Error("Contraseña Incorrecta");
        return res.status(403).json({msg: error.message});
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await Doctor.findOne({email})

    // Valida si el correo existe en la base de datos
    if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Genera un nuevo token
        user.token = generateId();
        // Guarda en la base de datos
        await user.save();

        emailForgottenPass({
            email, 
            name: user.name,
            token: user.token
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.log(error);
    }
}

const verifyToken = async (req, res) => {
    const { token } = req.params;

    const tokenExists = await Doctor.findOne({token});

    if (tokenExists) {
        // El Token es válido
        res.json({msg: "Token válido y el usuario existe"});
    } else {
        const error = new Error("Token inválido");
        return res.status(404).json({ msg: error.message });
    }

}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Doctor.findOne({token});

    if (!user) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        user.token = null
        user.password = password
        await user.save();

        res.json({msg: "Tu contraseña ha sido modificada correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body;

    if (doctor.email !== req.body.email) {
        const emailExists = await Doctor.findOne({email});
        
        if (emailExists) {
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        doctor.name = req.body.name;
        doctor.email = req.body.email;
        doctor.web = req.body.web;
        doctor.phone = req.body.phone;

        console.log(doctor.phone);
        console.log(req.body.phone);

        const savedDoctor = await doctor.save();
        res.json(savedDoctor);
    } catch (error) {
        console.log(error);
    }
}

const updatePassword = async (req, res) => {
    // Leer los datos
    const { id } = req.doctor;
    const {pwd_current, pwd_new} = req.body;

    // Comprobar que el doctor existe
    const doctor = await Doctor.findById(id);
    if (!doctor) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    // Comprobar su password
    if (await doctor.checkPassword(pwd_current)) {
        // Almacenar el nuevo password
        doctor.password = pwd_new;
        await doctor.save();
        res.json({msg: "Password Almacenado Correctamente"})
    } else {
        const error = new Error("El Password Actual es Incorrecto");
        return res.status(400).json({msg: error.message});
    }
}

export { register, perfil, confirms, authenticate, forgotPassword, verifyToken, newPassword, updateProfile, updatePassword }