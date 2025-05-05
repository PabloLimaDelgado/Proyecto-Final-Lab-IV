import { IOrdenCompra } from "./IOrdenCompra";
import { IProducto } from "./IProducto";

export interface IOrdenCompraDetalle {
    id?: number;
    ordenCompra: IOrdenCompra;
    producto: IProducto;
    cantidad: number;
}