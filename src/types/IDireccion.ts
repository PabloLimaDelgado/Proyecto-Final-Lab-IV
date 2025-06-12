import { IUsuario } from "./IUsuario";


export interface IDireccion {
  id?: number;
  localidad: string;
  pais: string;
  estado: boolean;
  provincia: string;
  departamento: string;
  codigoPostal: string;
  usuarios?: IUsuario[];
}
