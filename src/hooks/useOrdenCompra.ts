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
    const detallesAgrupados: Record<number, { detalle: IDetalle; cantidad: number }> = {};

    carritoActivo?.detallesProductos.forEach((detalle) => {
      if (!detalle.id) return;

      if (detallesAgrupados[detalle.id]) {
        detallesAgrupados[detalle.id].cantidad += 1;
      } else {
        detallesAgrupados[detalle.id] = { detalle, cantidad: 1 };
      }
    });
    const detallesParaPayload: IDetallePost = Object.values(detallesAgrupados).map(({ detalle, cantidad }) => ({
      detalle: { id: detalle.id },
      cantidad,
    }));
    let ordenPayload: IOrdenPost;  
    if(usarDireccionUsuario && direccion.id){
     ordenPayload = {
      direccion: { id: direccion.id  },
      direccionUsuario: usarDireccionUsuario,
      detalles: detallesParaPayload,
      estado: true,
    };
    }else{
       ordenPayload = {
        direccion: direccion,
        direccionUsuario: usarDireccionUsuario,
        detalles: detallesParaPayload,
        estado:true
      }
    }

    console.log(detallesAgrupados);
    console.log(ordenPayload);

    try {
      // Obtiene token para autenticación
      const token = localStorage.getItem("token");

      // Crea la ordenCompra en el backend
      const responseOrdenCompra = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ordenCompra/post`,
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

      const ordenCompra = await responseOrdenCompra.json();

      // Actualiza estado global con la orden creada
      postOrdenCompra(ordenCompra);
      setOrdenCompraActivo(ordenCompra);
    } catch (err) {
      console.error("Error creando OrdenCompra:", err);
      return; // termina función si falla la orden principal
    }

  };

  return { añadirOrden };
};
