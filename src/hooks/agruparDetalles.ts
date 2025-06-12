import { IDetalle } from "../types/IDetalle";

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
    const id = detalle.id;
    if (!id) return; // ignorar detalles sin id

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
    const precioVenta = Number(detalle.precioDTO?.precioVenta ?? 0);
    return acc + precioVenta * cantidad;
  }, 0);
};

export const calcularTotalConDescuento = (
  agrupados: DetalleConCantidad[]
): number => {
  const hoy = new Date();

  return agrupados.reduce((acc, { detalle, cantidad }) => {
    const precioVenta = Number(detalle.precioDTO?.precioVenta ?? 0);
    const descuento = detalle.precioDTO?.descuento;

    if (!precioVenta) return acc;

    let precioFinal = precioVenta;

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
