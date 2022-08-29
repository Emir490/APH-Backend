import express from "express";
import { addPatient, deletePatient, editPatient, getPatient, getPatients } from "../controllers/patientController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
    .post(checkAuth, addPatient)
    .get(checkAuth, getPatients);

router.route('/:id')
    .get(checkAuth, getPatient)
    .put(checkAuth, editPatient)
    .delete(checkAuth, deletePatient);

export default router;