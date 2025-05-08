import { create } from "zustand";
import { IDetalle } from "../types/IDetalle";

interface IDetalleProducto {
  detalles: IDetalle[];
  detalleActivo: IDetalle | null;
  setArrayDetalle: (arrayDetalle: IDetalle[]) => void;
  setDetalleActivo: (detalleActivo: IDetalle | null) => void;
  postDetalle: (nuevoDetalle: IDetalle) => void;
  updateDetalle: (detalleActualizado: IDetalle) => void;
  deleteDetalle: (idDetalle: number) => void;
}

export const detalleProductoStore = create<IDetalleProducto>((set) => ({
  detalles: [],
  detalleActivo: null,
  setArrayDetalle: (arrayDetalle) => set(() => ({ detalles: arrayDetalle })),
  setDetalleActivo: (detalleActivo) => set(() => ({ detalleActivo })),
  postDetalle: (nuevoDetalle) =>
    set((state) => ({ detalles: [...state.detalles, nuevoDetalle] })),
  updateDetalle: (detalleActualizado) =>
    set((state) => ({
      detalles: state.detalles.map((detalle) =>
        detalle.id === detalleActualizado.id ? detalleActualizado : detalle
      ),
    })),
  deleteDetalle: (idDetalle) =>
    set((state) => ({
      detalles: state.detalles.filter((detalle) => detalle.id !== idDetalle),
    })),
}));
