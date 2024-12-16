import { obtenerCarrito, vaciarCarrito } from "./carrito.js";

const MENSAJE = {
  CARRITO_VACIO: "El carrito no contiene ningún producto.",
  INICIAR_SESION: "Por favor, inicie sesión para realizar la compra.",
  ERROR_SESION: "Hubo un problema con su sesión. Por favor, intente iniciar sesión nuevamente.",
  USUARIO_INCOMPLETO: "Información de usuario incompleta. Por favor, inicie sesión nuevamente.",
  COMPRA_EXITOSA: (id) => `Compra realizada con éxito. ID de venta: ${id}`,
  ERROR_COMPRA: "Hubo un error al procesar la compra, intente nuevamente.",
};

function obtenerUsuario() {
  const usuarioString = sessionStorage.getItem("usuario");
  if (!usuarioString) {
    throw new Error(MENSAJE.INICIAR_SESION);
  }
  try {
    const usuario = JSON.parse(usuarioString);
    if (!usuario || !usuario.id) {
      throw new Error(MENSAJE.USUARIO_INCOMPLETO);
    }
    return usuario;
  } catch (error) {
    console.error("Error al parsear la información del usuario:", error);
    throw new Error(MENSAJE.ERROR_SESION);
  }
}

export async function realizarCompra() {
  try {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      alert(MENSAJE.CARRITO_VACIO);
      return;
    }

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario || !usuario.id_usuario) {
      alert(MENSAJE.INICIAR_SESION);
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("/ventas/realizarCompra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        items: carrito.map((item) => ({
          id_producto: item.id_producto,
          cant: item.cant,
        })),
      }),
    });

    if (!response.ok) throw new Error(MENSAJE.ERROR_COMPRA);

    const result = await response.json();
    alert(MENSAJE.COMPRA_EXITOSA(result.venta.id));
    vaciarCarrito();
  } catch (error) {
    console.error("Error al realizar compra:", error);
    alert(error.message);
  }
}