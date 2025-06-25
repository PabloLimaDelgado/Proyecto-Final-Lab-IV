import { IDireccion } from "../types/IDireccion";
import { carritoStore } from "../store/carritoStore";
import { ordenCompraStore } from "../store/ordenCompraStore";
import { IDetalle } from "../types/IDetalle";
import { IDetallePost, IOrdenPost } from "../types/IOrdenPost";

export const useOrdenCompra = () => {
  const { carritoActivo } = carritoStore();
  const { postOrdenCompra, setOrdenCompraActivo } = ordenCompraStore();

const añadirOrden = async (
    direccion: IDireccion,
    usarDireccionUsuario: boolean
  ) => {
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

    const detallesParaPayload: IDetallePost[] = Object.values(
      detallesAgrupados
    ).map(({ detalle, cantidad }) => ({
      detalle: { id: detalle.id! },
      cantidad,
    }));

    let ordenPayload: IOrdenPost;
    if (usarDireccionUsuario && direccion.id) {
      ordenPayload = {
        direccion: { id: direccion.id },
        direccionUsuario: usarDireccionUsuario,
        detalles: detallesParaPayload,
        estado: true,
      };
    } else {
      ordenPayload = {
        direccion,
        direccionUsuario: usarDireccionUsuario,
        detalles: detallesParaPayload,
        estado: true,
      };
    }

    try {
      const token = localStorage.getItem("token");
      const ordenCompra = JSON.stringify(ordenPayload);
      const responsePreferencia = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/mp/crearPreferencia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: ordenCompra,
        }
      );
      console.log(responsePreferencia)
      if (!responsePreferencia.ok) {
        const errorText = await responsePreferencia.text();
        throw new Error(
          `Error al crear preferencia: ${responsePreferencia.status} - ${errorText}`
        );
      }

      const data = await responsePreferencia.json();
      const initPoint = data.init_point;
      const externalReference = data.Referencia;

      sessionStorage.setItem(
        "ordenTemporal",
        JSON.stringify({
          orden: ordenPayload,
          referencia: externalReference,
        })
        );
    return { initPoint, externalReference };
    } catch (err) {
      console.error("Error iniciando pago con Mercado Pago:", err);
    }
  };

const escucharWebSocket = (onPagoConfirmado: () => void) => {
  const socket = new WebSocket("ws://localhost:8080/ws/pagos");

  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.evento === "pago_confirmado" && data.estado === true) {
      const ordenTemporalStr = sessionStorage.getItem("ordenTemporal");
      if (!ordenTemporalStr) return;

      const { orden, referencia } = JSON.parse(ordenTemporalStr);
      if (data.referencia !== referencia) return;

      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ordenCompra/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orden),
      });

      if (response.ok) {
        setOrdenCompraActivo(null);
        sessionStorage.removeItem("ordenTemporal");
        onPagoConfirmado();
      } else {
        console.error("Error guardando la orden tras confirmación de pago");
      }
    }
  };

  socket.onerror = (err) => {
    console.error("Error en WebSocket:", err);
  };
    return () => {
      socket.close();
    };
  };

  return { añadirOrden, escucharWebSocket  };
};
