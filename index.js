import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const dominiosPermitidos = ['http://localhost:5173'];

const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El Origen del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"))
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/medicos', doctorRoutes);
app.use('/api/pacientes', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Servidor funcionando en el puerto 4000");
});