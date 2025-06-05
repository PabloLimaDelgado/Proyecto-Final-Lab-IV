import { IDetalle } from "./IDetalle";

export interface ICarrito {
  id: number;
  detallesProductos: IDetalle[];
}
