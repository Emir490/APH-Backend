import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateId from "../helpers/generarId.js";

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generateId()
    },
    web: {
        type: String,
        default: null
    },
    confirm: {
        type: Boolean,
        default: false
    }
});

// Hash password
doctorSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

doctorSchema.methods.checkPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;