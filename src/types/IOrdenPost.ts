import { IDireccion } from "./IDireccion";

export interface IOrdenPost {
  direccion: IDireccion | { id: number };
  direccionUsuario: boolean;
  estado: boolean;
  detalles?: IDetallePost[];
}

export interface IDetallePost {
  detalle: { id: number };
  cantidad: number;
}
