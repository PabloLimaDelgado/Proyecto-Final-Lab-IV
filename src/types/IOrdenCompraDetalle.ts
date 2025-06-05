import { IDetalle } from "./IDetalle";
import { IOrdenCompra } from "./IOrdenCompra";

export interface IOrdenCompraDetalle {
  id?: number;
  ordenCompra: IOrdenCompra;
  detalle: IDetalle;
  cantidad: number;
}
