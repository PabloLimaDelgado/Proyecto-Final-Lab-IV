import { IDetalle } from "./IDetalle";
import { IOrdenCompra } from "./IOrdenCompra";

export interface IOrdenCompraDetalle {
  id?: number;
  ordenCompra: IOrdenCompra; // referencia a la orden padre
  detalle: IDetalle; // detalle individual (producto, talle, etc)
  cantidad: number;
  subtotal: number;
  estado: boolean;
}
