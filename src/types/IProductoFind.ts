import { ISexo } from "./enums/ISexo";
import { ITipoProducto } from "./enums/ITipoProducto";
import { ICategoria } from "./ICategoria";
import { IDescuento } from "./IDescuento";
import { IImagen } from "./IImagen";
import { IOrdenCompra } from "./IOrdenCompra";
import { IOrdenCompraDetalle } from "./IOrdenCompraDetalle";
import { ITalle } from "./ITalle";

export interface IProductoFind {
  id: number;
    categoria: ICategoria;
    nombre: string;
    tipoProducto: ITipoProducto;
    sexo: ISexo;
    detalles: DetalleFindDTO[];
}
export interface DetalleFindDTO {
    id: number;
    talle: ITalle;
    estado: boolean;
    color: string;
    imagenList: IImagen[];
    stock: number;
    precio: IPrecioDTO;
}
export interface IPrecioDTO {
    id: number;
    descuento: IDescuento;
    precioCompra: number;
    precioVenta: number;

}

export interface IOrdenCompraDetalleFind {
    id: number;
    cantidad: number;
    detalle: DetalleFindDTO;
    subtotal: number;
    producto:string;
    ordenCompra: IOrdenCompra;
    estado: boolean;
}


// Método para castear un IOrdenCompraDetalle a IOrdenCompraDetalleFind
export function castToOrdenCompraDetalleFind(
  detalle: IOrdenCompraDetalle
): IOrdenCompraDetalleFind {
  return {
    id: detalle.id!,
    cantidad: detalle.cantidad,
    subtotal: detalle.subtotal,
    estado: detalle.estado,
    producto: detalle.detalle.producto.nombre,
    ordenCompra: detalle.ordenCompra,
    detalle: {
      id: detalle.detalle.id!,
      talle: detalle.detalle.talle,
      estado: detalle.detalle.estado,
      color: detalle.detalle.color,
      imagenList: detalle.detalle.imagenList,
      stock: typeof detalle.detalle.stock === "string"
        ? parseInt(detalle.detalle.stock)
        : detalle.detalle.stock,
      precio: {
        id: detalle.detalle.precioDTO.id,
        descuento: detalle.detalle.precioDTO.descuento,
        precioCompra: detalle.detalle.precioDTO.precioCompra,
        precioVenta: detalle.detalle.precioDTO.precioVenta,
      },
    },
  };
}

export function castOrdenCompraDetallesFind(
  detalles: IOrdenCompraDetalle[]
): IOrdenCompraDetalleFind[] {
  return detalles.map(castToOrdenCompraDetalleFind);
}

