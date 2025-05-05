import { ISexo } from "./enums/ISexo";
import { ITipoProducto } from "./enums/ITipoProducto";
import { ICategoria } from "./ICategoria";

export interface IProducto {
  id?: number;
  estado: boolean;
  categoria: ICategoria;
  nombre: string;
  tipoProducto: ITipoProducto;
  sexo: ISexo;
}
