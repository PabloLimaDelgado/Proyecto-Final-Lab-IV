import { IDescuento } from "./IDescuento";
import { IDetalle } from "./IDetalle";

export interface IPrecio {
  id?: number;
  descuento?: IDescuento | null;
  precioCompra?: number;
  precioVenta: number;
  estado: boolean;
  detalleDescuentoDTO?: IDetalle;
}
