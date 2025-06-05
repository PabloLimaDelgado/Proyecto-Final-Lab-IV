import { IDireccion } from "./IDireccion";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  id?: number;
  usuario: IUsuario;
  total: number;
  fecha: string;
  direccion: IDireccion;
  direccionUsuario: boolean;
  estado: boolean;
}
