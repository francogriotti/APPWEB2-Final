import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../db/schemas/Usuario.schema.js";

const router = Router();

router.post("/usuarioNuevo", async (req, res) => {
  const { nombre, apellido, direccion, email, contraseña } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 8);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      direccion,
      email,
      contraseña: hashedPassword,
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario.id_usuario, email: nuevoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Usuario creado con éxito.",
      token,
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado, verifíquelo y pruebe nuevamente." });
    }

    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );
    if (!contraseñaValida) {
      return res.status(400).json({ message: "Contraseña incorrecta, verifíquela y pruebe nuevamente." });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso.",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
});

const migrarUsuarios = async () => {
  try {
    const jsonData = await readFile("./data/usuarios.json", "utf-8");
    const usuarios = JSON.parse(jsonData);

    for (const usuario of usuarios) {
      await Usuario.findOneAndUpdate(
        { id_usuario: usuario.id_usuario },
        usuario,
        { upsert: true, new: true }
      );
    }

    console.log("Migración de usuarios completada con éxito");
  } catch (error) {
    console.error("Error en la migración de usuarios:", error);
  }
};

export default router;
