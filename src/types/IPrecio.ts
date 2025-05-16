import { IDescuento } from "./IDescuento";
import { IDetalle } from "./IDetalle";

export interface IPrecio {
    id?: number,
    descuento?: IDescuento | null;
    precioCompra?: number | null | string;
    precioVenta: number | string;
    detalle: IDetalle;
    estado: boolean
}