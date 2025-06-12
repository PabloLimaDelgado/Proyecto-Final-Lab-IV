import { IDireccion } from "./IDireccion";
import { IOrdenCompraDetalle } from "./IOrdenCompraDetalle";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  id?: number;
  usuario: IUsuario;
  total: number;
  fecha: string;
  direccion: IDireccion;
  direccionUsuario: boolean;
  estado: boolean;
  ordenCompraDetalles?: IOrdenCompraDetalle[];
}
