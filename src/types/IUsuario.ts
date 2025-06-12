import { IRol } from "./enums/IRol";
import { IDireccion } from "./IDireccion";

export interface IUsuario {
  id?: number;
  nombre: string;
  dni: string;
  estado: boolean;
  rol: IRol;
  mail: string;
  direcciones?: IDireccion[];
  token?: string;
}
