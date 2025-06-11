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

export const calcularSubtotal = (agrupados: DetalleConCantidad[]): number => {
  return agrupados.reduce((acc, { detalle, cantidad }) => {
    const precio = Number(detalle.precioDTO?.precioVenta);
    return precio
      ? acc + Number(detalle.precioDTO.precioVenta) * cantidad
      : acc;
  }, 0);
};

export const calcularTotalConDescuento = (
  agrupados: DetalleConCantidad[]
): number => {
  return agrupados.reduce((acc, { detalle, cantidad }) => {
    const precio = detalle.precioDTO.precioVenta;
    if (!precio) return acc;

    const hoy = new Date();
    let precioFinal = Number(detalle.precioDTO.precioVenta);

    if (
      detalle.precioDTO.descuento &&
      detalle.precioDTO.descuento.fechaInicio &&
      detalle.precioDTO.descuento.fechaFin &&
      new Date(detalle.precioDTO.descuento.fechaInicio) <= hoy &&
      hoy <= new Date(detalle.precioDTO.descuento.fechaFin)
    ) {
      precioFinal -=
        (precioFinal * detalle.precioDTO.descuento.descuento) / 100;
    }

    return acc + precioFinal * cantidad;
  }, 0);
};
