import { IImagen } from "./IImagen";
import { IProducto } from "./IProducto";
import { ITalle } from "./ITalle";
import { PrecioDTO } from "./PrecioDTO";

export interface IDetalle {
  id?: number;
  talle: ITalle;
  estado: boolean;
  color: string;
  producto: IProducto;
  imagenList: IImagen[];
  stock: number | string;
  precioDTO: PrecioDTO
}
