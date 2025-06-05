import { IDetalle } from "../types/IDetalle";
import { IPrecio } from "../types/IPrecio";

export type DetalleConCantidad = {
  detalle: IDetalle;
  cantidad: number;
};

export const agruparDetalles = (
  detalles: IDetalle[] | undefined
): DetalleConCantidad[] => {
  if (!detalles) return [];

  const agrupado: { [id: number]: DetalleConCantidad } = {};

  detalles.forEach((detalle) => {
    const id = detalle.id!;
    if (agrupado[id]) {
      agrupado[id].cantidad += 1;
    } else {
      agrupado[id] = { detalle, cantidad: 1 };
    }
  });

  return Object.values(agrupado);
};

export const calcularSubtotal = (
  agrupados: DetalleConCantidad[],
  precios: IPrecio[]
): number => {
  return agrupados.reduce((acc, { detalle, cantidad }) => {
    const precio = precios.find((p) => p.detalle.id === detalle.id);
    return precio ? acc + Number(precio.precioVenta) * cantidad : acc;
  }, 0);
};

export const calcularTotalConDescuento = (
  agrupados: DetalleConCantidad[],
  precios: IPrecio[]
): number => {
  return agrupados.reduce((acc, { detalle, cantidad }) => {
    const precio = precios.find((p) => p.detalle.id === detalle.id);
    if (!precio) return acc;

    const hoy = new Date();
    const { precioVenta, descuento } = precio;
    let precioFinal = Number(precioVenta);

    if (
      descuento &&
      descuento.fechaInicio &&
      descuento.fechaFin &&
      new Date(descuento.fechaInicio) <= hoy &&
      hoy <= new Date(descuento.fechaFin)
    ) {
      precioFinal -= (precioFinal * descuento.descuento) / 100;
    }

    return acc + precioFinal * cantidad;
  }, 0);
};
