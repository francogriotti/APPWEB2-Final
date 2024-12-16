import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../db/schemas/Usuario.schema.js';
import Producto from '../db/schemas/Producto.schema.js';
import Venta from '../db/schemas/Venta.schema.js';

dotenv.config();

const migrarDatos = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('Error: MONGODB_URI no está definido.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');

    const usuariosJSON = JSON.parse(await readFile('./data/usuarios.json', 'utf-8'));
    for (const usuario of usuariosJSON) {
      if (!usuario.email || !usuario.contraseña) {
        console.error('Datos incompletos para usuario:', usuario);
        continue;
      }
      await Usuario.findOneAndUpdate({ id_usuario: usuario.id_usuario }, usuario, { upsert: true });
    }
    console.log('Usuarios migrados exitosamente');

    const productosJSON = JSON.parse(await readFile('./data/productos.json', 'utf-8'));
    for (const producto of productosJSON) {
      if (!producto.nombre || !producto.precio) {
        console.error('Datos incompletos para producto:', producto);
        continue;
      }
      await Producto.findOneAndUpdate({ id_producto: producto.id_producto }, producto, { upsert: true });
    }
    console.log('Productos migrados exitosamente');

    const ventasJSON = JSON.parse(await readFile('./data/ventas.json', 'utf-8'));
    for (const venta of ventasJSON) {
      if (!venta.id_usuario || !venta.total) {
        console.error('Datos incompletos para venta:', venta);
        continue;
      }
      venta.fecha = new Date(venta.fecha);
      await Venta.findOneAndUpdate({ id: venta.id }, venta, { upsert: true });
    }
    console.log('Ventas migradas exitosamente');

  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    process.exit(0);
  }
};

migrarDatos();