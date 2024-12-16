import { Router } from "express";
import Venta from "../db/schemas/Venta.schema.js";
import Producto from "../db/schemas/Producto.schema.js";
import Usuario from "../db/schemas/Usuario.schema.js";

const router = Router();

router.post("/realizarCompra", async (req, res) => {
  try {
    const { id_usuario, items } = req.body;

    const usuarioExiste = await Usuario.findOne({ id_usuario });
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let total = 0;
    for (const item of items) {
      const producto = await Producto.findOne({
        id_producto: item.id_producto,
      });
      if (!producto) {
        return res.status(404).json({
          error: `Producto con id ${item.id_producto} no encontrado`,
        });
      }
      total += producto.precio * item.cant;
    }

    const ventaCompleta = new Venta({
      id_usuario,
      fecha: new Date(),
      total: parseFloat(total.toFixed(2)),
      id_sucursal: 1,
      descripcion: items,
    });

    await ventaCompleta.save();

    res.json({
      message: "Compra realizada con éxito",
      venta: ventaCompleta,
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
});

router.get("/usuario/:id_usuario", async (req, res) => {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    const ventas = await Venta.find({ id_usuario }).sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas del usuario:", error);
    res.status(500).json({ error: "Error al obtener las ventas del usuario" });
  }
});

const migrarVentas = async () => {
  try {
    const jsonData = await readFile("./data/ventas.json", "utf-8");
    const ventas = JSON.parse(jsonData);

    for (const venta of ventas) {
      venta.fecha = new Date(venta.fecha);

      await Venta.findOneAndUpdate({ id: venta.id }, venta, {
        upsert: true,
        new: true,
      });
    }

    console.log("Migración de ventas completada con éxito");
  } catch (error) {
    console.error("Error en la migración de ventas:", error);
  }
};

export default router;