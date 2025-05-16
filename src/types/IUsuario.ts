import { ITipoUsuario } from "./enums/ITipoUsuario";
import { IDireccion } from "./IDireccion";

export interface IUsuario {
  id?: number;
  nombre: string;
  contra: string;
  dni: string;
  estado: boolean;
  rol: ITipoUsuario;
  mail: string;
  direcciones: IDireccion[];
}
