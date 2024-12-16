import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Usuario from '../db/schemas/Usuario.schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

const encryptPasswords = async () => {
    await connectDB();

    const usuarios = await Usuario.find();
    for (const usuario of usuarios) {
        if (usuario.contraseña && usuario.contraseña.startsWith('$2b$')) {
            console.log(`Usuario ${usuario.email} ya tiene la contraseña encriptada`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
        usuario.contraseña = hashedPassword;
        await usuario.save();
        console.log(`Contraseña encriptada para usuario: ${usuario.email}`);
    }

    process.exit();
};

encryptPasswords();