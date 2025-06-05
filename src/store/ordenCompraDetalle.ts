import { create } from "zustand";
import { IOrdenCompraDetalle } from "../types/IOrdenCompraDetalle";

interface IOrdenCompraDetalleStore {
  ordenesCompraDetalle: IOrdenCompraDetalle[];
  ordenCompraDetalleActivo: IOrdenCompraDetalle | null;
  setArrayOrdenCompraDetalle: (
    arrayOrdenCompraDetalle: IOrdenCompraDetalle[]
  ) => void;
  setOrdenCompraDetalleActivo: (
    ordenCompraDetalleActivo: IOrdenCompraDetalle | null
  ) => void;
  postOrdenCompraDetalle: (
    nuevoOrdenCompraDetalle: IOrdenCompraDetalle
  ) => void;
  updateOrdenCompraDetalle: (
    ordenCompraDetalleActualizado: IOrdenCompraDetalle
  ) => void;
  deleteOrdenCompraDetalle: (idOrdenCompraDetalle: number) => void;
}

export const ordenCompraDetalleStore = create<IOrdenCompraDetalleStore>(
  (set) => ({
    ordenesCompraDetalle: [],
    ordenCompraDetalleActivo: null,
    setArrayOrdenCompraDetalle: (arrayOrdenCompraDetalle) =>
      set(() => ({ ordenesCompraDetalle: arrayOrdenCompraDetalle })),
    setOrdenCompraDetalleActivo: (ordenCompraDetalleActivo) =>
      set(() => ({ ordenCompraDetalleActivo })),
    postOrdenCompraDetalle: (nuevoOrdenCompraDetalle) =>
      set((state) => ({
        ordenesCompraDetalle: [
          ...state.ordenesCompraDetalle,
          nuevoOrdenCompraDetalle,
        ],
      })),
    updateOrdenCompraDetalle: (ordenCompraDetalleActualizado) =>
      set((state) => ({
        ordenesCompraDetalle: state.ordenesCompraDetalle.map(
          (ordenCompraDetalle) =>
            ordenCompraDetalle.id === ordenCompraDetalleActualizado.id
              ? ordenCompraDetalleActualizado
              : ordenCompraDetalle
        ),
      })),
    deleteOrdenCompraDetalle: (idOrdenCompraDetalle) =>
      set((state) => ({
        ordenesCompraDetalle: state.ordenesCompraDetalle.filter(
          (ordenCompraDetalle) => ordenCompraDetalle.id !== idOrdenCompraDetalle
        ),
      })),
  })
);
