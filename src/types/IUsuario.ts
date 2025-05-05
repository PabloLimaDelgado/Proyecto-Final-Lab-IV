import { IDireccion } from "./IDireccion";

export interface IUsuario {
  id?: number;
  dni: string;
  mail: string;
  direcciones: IDireccion[];
}
