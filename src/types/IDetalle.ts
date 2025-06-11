import { IImagen } from "./IImagen";
import { IPrecio } from "./IPrecio";
import { IProducto } from "./IProducto";
import { ITalle } from "./ITalle";

export interface IDetalle {
  id?: number;
  talle: ITalle;
  estado: boolean;
  color: string;
  producto: IProducto;
  imagenList: IImagen[];
  stock: number | string;
  precioDTO: IPrecio
}
