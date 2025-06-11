import { IDireccion } from "../types/IDireccion";
import { IUsuario } from "../types/IUsuario";
import { IOrdenCompra } from "../types/IOrdenCompra";
import { carritoStore } from "../store/carritoStore";
import { ordenCompraStore } from "../store/ordenCompraStore";
import { IDetalle } from "../types/IDetalle";
import { IOrdenCompraDetalle } from "../types/IOrdenCompraDetalle";

export const useOrdenCompra = () => {
  const { carritoActivo } = carritoStore();
  const { postOrdenCompra, setOrdenCompraActivo } = ordenCompraStore();

  const añadirOrden = async (
    usuario: IUsuario,
    direccion: IDireccion,
    usarDireccionUsuario: boolean,
    total: number
  ) => {
    // Payload principal para crear la ordenCompra
    const ordenPayload = {
      usuario,
      direccion,
      direccionUsuario: usarDireccionUsuario,
      estado: true,
      fecha: new Date().toISOString().split("T")[0], // solo fecha YYYY-MM-DD
      total,
    };

    let ordenCompra: IOrdenCompra;

    try {
      // Obtiene token para autenticación
      const token = localStorage.getItem("token");

      // Crea la ordenCompra en el backend
      const responseOrdenCompra = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ordenCompra`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ordenPayload),
        }
      );

      if (!responseOrdenCompra.ok) {
        // Si falla la creación, lanza error con mensaje
        const errorText = await responseOrdenCompra.text();
        throw new Error(`Error ${responseOrdenCompra.status}: ${errorText}`);
      }

      ordenCompra = await responseOrdenCompra.json();

      // Actualiza estado global con la orden creada
      postOrdenCompra(ordenCompra);
      setOrdenCompraActivo(ordenCompra);
    } catch (err) {
      console.error("Error creando OrdenCompra:", err);
      return; // termina función si falla la orden principal
    }

    // Agrupar detalles por id para sumar cantidades
    const detallesAgrupados: Record<
      number,
      { detalle: IDetalle; cantidad: number }
    > = {};

    carritoActivo?.detallesProductos.forEach((detalle) => {
      if (!detalle.id) return;

      if (detallesAgrupados[detalle.id]) {
        detallesAgrupados[detalle.id].cantidad += 1;
      } else {
        detallesAgrupados[detalle.id] = { detalle, cantidad: 1 };
      }
    });

    // Por cada detalle agrupado, crear ordenCompraDetalle en backend
    for (const idDetalle in detallesAgrupados) {
      const { detalle, cantidad } = detallesAgrupados[idDetalle];

      // Obtiene precio y descuento
      const precio = Number(detalle.precioDTO?.precioVenta ?? 0);
      const descuento = Number(detalle.precioDTO?.descuento?.descuento ?? 0);

      // Calcula precio final con descuento (si aplica)
      const precioFinal = descuento
        ? precio - (precio * descuento) / 100
        : precio;

      const ordenCompraDetalle: IOrdenCompraDetalle = {
        ordenCompra,
        detalle,
        cantidad,
        subtotal: Number(precioFinal.toFixed(2)), // subtotal por detalle (precio final * cantidad)
        estado: true,
      };

      try {
        const token = localStorage.getItem("token");

        // Enviar detalle al backend
        const responseDetalle = await fetch(
          `${import.meta.env.VITE_BASE_URL}/ordenCompraDetalle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ordenCompraDetalle),
          }
        );

        if (!responseDetalle.ok) {
          const errorText = await responseDetalle.text();
          console.error(
            `Error ${responseDetalle.status} creando detalle: ${errorText}`
          );
        }
      } catch (err) {
        console.error("Error en OrdenCompraDetalle:", err);
      }
    }
  };

  return { añadirOrden };
};
