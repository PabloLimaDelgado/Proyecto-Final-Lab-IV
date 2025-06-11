import { IDescuento } from "./IDescuento";

export interface PrecioDTO {
  id?: number;  
precioCompra: number;
    precioVenta: number;
    descuento: IDescuento;
}