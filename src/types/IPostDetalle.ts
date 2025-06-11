import { IDescuento } from "./IDescuento";
import { IDetalle } from "./IDetalle";

export interface IPostDetalle {
  id?: number;
  talle: {
    id: number;
    nombre?: string;
  };
  estado: boolean;
  color: string;
  producto: {
    id: number;
    nombre?: string;
  };
  imagenList: {
    id?: number;
    nombre: string;
    url: string;
  }[];
  stock: number | string;
  precio: {
    id?: number;
    descuento?: IDescuento | null;
    precioCompra?: number | null | string;
    precioVenta: number | string;
    estado: boolean;
    detalleDescuentoDTO?: IDetalle;
  };
}
