import Patient from "../models/Patient.js";

const addPatient = async (req, res) => {
    const { email } = req.body;
    
    const user = await Patient.findOne({email});

    if (user) {
        const error = new Error("El paciente ya existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo paciente
        const patient = new Patient(req.body);
        // Indicar quien es el doctor del paciente
        patient.doctor = req.doctor._id;
        // Guardar datos en la base de datos
        const savedPatient = await patient.save();

        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    }
}

const getPatients = async (req, res) => {
    // Encuentra los pacientes que coincidan con el id del doctor
    const patients = await Patient.find()
        .where("doctor")
        .equals(req.doctor);

    res.json(patients);
}

const getPatient = async (req, res) => {
    const patient = await Patient.findOne()
        .where("_id")
        .equals(req.params.id);

    if (!patient) {
        const error = new Error("Paciente no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (patient.doctor._id.toString() !== req.doctor._id.toString()) {
        return res.json({msg: "Acción no válida"});
    }

    res.json(patient);
}

const editPatient = async (req, res) => {
    const patient = await Patient.findOne()
        .where("_id")
        .equals(req.params.id);

    if (!patient) {
        const error = new Error("Paciente no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (patient.doctor._id.toString() !== req.doctor._id.toString()) {
        return res.json({msg: "Acción no válida"});
    }

    const { name, email, date, symptoms } = req.body;

    // Editar los campos
    patient.name = name || patient.name;
    patient.email = email || patient.email;
    patient.date = date || patient.date;
    patient.symptoms = symptoms || patient.symptoms;

    try {
        const editedPatient = await patient.save();
        res.json(editedPatient);
    } catch (error) {
        console.log(error);
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params
    const patient = await Patient.findById(id);

    if (!patient) {
        const error = new Error("Paciente no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (patient.doctor._id.toString() !== req.doctor._id.toString()) {
        return res.json({msg: "Acción no válida"});
    }

    try {
        await patient.deleteOne();
        res.json({ msg: "Paciente eliminado" })
    } catch (error) {
        console.log(error);
    }
}

export { addPatient, getPatients, getPatient, editPatient, deletePatient }