import { IDetalle } from "./IDetalle";

export interface IImagen {
  id?: number;
  url: string;
  alt: string;
  detalle?: IDetalle;
  estado: boolean
}
