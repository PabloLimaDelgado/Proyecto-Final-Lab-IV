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
    const ordenPayload = {
      usuario,
      direccion,
      direccionUsuario: usarDireccionUsuario,
      estado: true,
      fecha: new Date().toISOString().split("T")[0],
      total,
    };

    //console.log(ordenPayload);

    let ordenCompra: IOrdenCompra;

    try {
      const token = localStorage.getItem("token");

      const responseOrdenCompra: Response = await fetch(
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
        const errorText = await responseOrdenCompra.text();
        throw new Error(`Error ${responseOrdenCompra.status}: ${errorText}`);
      }

      ordenCompra = await responseOrdenCompra.json();
      console.log(ordenCompra);

      postOrdenCompra(ordenCompra);
      setOrdenCompraActivo(ordenCompra);
    } catch (err) {
      console.error("Error creando OrdenCompra:", err);
      return;
    }

    const detallesCarrito: Record<
      number,
      { detalle: IDetalle; cantidad: number }
    > = {};

    carritoActivo?.detallesProductos.forEach((detalle) => {
      if (!detalle.id) return;
      detallesCarrito[detalle.id] = detallesCarrito[detalle.id]
        ? {
            detalle: detalle,
            cantidad: detallesCarrito[detalle.id].cantidad + 1,
          }
        : { detalle: detalle, cantidad: 1 };
    });

    for (const idDetlle in detallesCarrito) {
      const { detalle, cantidad } = detallesCarrito[idDetlle];

      const precio = Number(detalle.precioDTO?.precioVenta) ?? 0;

      const descuento = Number(detalle.precioDTO?.descuento?.descuento) ?? 0;
      const precioFinal = descuento
        ? (precio - (precio * descuento) / 100).toFixed(2)
        : precio.toFixed(2);

      const ordenCompraDetalle: IOrdenCompraDetalle = {
        ordenCompra: ordenCompra,
        detalle: detalle,
        cantidad,
        subtotal: Number(precioFinal),
        estado: true,
      };

      try {
        const token = localStorage.getItem("token");

        const responseOrdenCompraDetalle: Response = await fetch(
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

        if (!responseOrdenCompraDetalle.ok) {
          const txt = await responseOrdenCompraDetalle.text();
          console.error(
            `Error ${responseOrdenCompraDetalle.status} creando detalle: ${txt}`
          );
        }
      } catch (err) {
        console.error("Error en OrdenCompraDetalle:", err);
      }
    }
  };

  return { añadirOrden };
};
