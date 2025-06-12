import { IDetalle } from "./IDetalle";
import { IDireccion } from "./IDireccion";

export interface IOrdenPost{
    direccion: IDireccion | { id: number };
    direccionUsuario: boolean;
    estado: boolean;
    detallesProductos?: IDetalle[];
}

export interface IDetallePost{
    detalle: { id: number };
    cantidad: number;
}

