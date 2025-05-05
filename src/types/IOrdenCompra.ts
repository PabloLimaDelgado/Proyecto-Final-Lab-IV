import { IDireccion } from "./IDireccion";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
    id?: number;
    usuario: IUsuario;
    total: string; 
    descuento: number;
    fecha: string; 
    direccion: IDireccion;
    direccionUsuario: boolean;
  }