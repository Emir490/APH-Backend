import express from "express";
import { authenticate, confirms, forgotPassword, newPassword, perfil, register, updatePassword, updateProfile, verifyToken } from "../controllers/doctorController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Área pública
router.post('/', register);
router.get('/confirmar/:token', confirms);
router.post('/login', authenticate);
router.post('/olvide-password', forgotPassword);
router.route('/olvide-password/:token').get(verifyToken).post(newPassword);

// Área privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, updateProfile);
router.put('/actualizar-password', checkAuth, updatePassword);

export default router;