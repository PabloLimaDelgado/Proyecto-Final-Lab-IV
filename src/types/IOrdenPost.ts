import { IDireccion } from "./IDireccion";
import { IOrdenCompraDetalleFind } from "./IProductoFind";

export interface IOrdenPost {
  direccion: IDireccion | { id: number };
  direccionUsuario: boolean;
  estado: boolean;
  detalles?: IDetallePost[];
}

export interface IOrdenUpdate {
  usuario: { id: number };
  direccion: IDireccion | { id: number };
  direccionUsuario: boolean;
  estado: boolean;
  detalles?: IOrdenCompraDetalleFind[];
}

export interface IDetallePost {
  detalle: { id: number };
  cantidad: number;
}
