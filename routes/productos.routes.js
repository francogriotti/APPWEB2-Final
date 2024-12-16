import { Router } from "express";
import Producto from "../db/schemas/Producto.schema.js";

const router = Router();

router.get("/all", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ id_producto: 1 }).lean();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al listar los productos:", error);
    res.status(500).json({ message: "Se produjo un error al listar los productos." });
  }
});

router.get("/buscarProductoPorId/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await Producto.findOne({ id_producto: id }).lean();

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (error) {
    console.error("Error al buscar producto por ID:", error);
    return res.status(500).json({ message: "Error al buscar el producto" });
  }
});

router.get("/buscarProductoPorCategoria/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria.trim();
    const productos = await Producto.find({
      categoria: { 
        $regex: new RegExp(categoria, 'i') 
      }
    }).lean();

    if (productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos en esta categoría" });
    }

    return res.json(productos);
  } catch (error) {
    console.error("Error al buscar productos por categoría:", error);
    return res.status(500).json({ message: "Error al buscar los productos" });
  }
});

export default router;