import { create } from "zustand";
import { IOrdenCompra } from "../types/IOrdenCompra";

interface IOrdenCompraStore {
  ordenesCompra: IOrdenCompra[];
  ordenCompraActivo: IOrdenCompra | null;
  setArrayOrdenCompra: (arrayOrdenCompra: IOrdenCompra[]) => void;
  setOrdenCompraActivo: (ordenCompraActivo: IOrdenCompra | null) => void;
  postOrdenCompra: (nuevoOrdenCompra: IOrdenCompra) => void;
  updateOrdenCompra: (ordenCompraActualizado: IOrdenCompra) => void;
  deleteOrdenCompra: (idOrdenCompra: number) => void;
}

export const ordenCompraStore = create<IOrdenCompraStore>((set) => ({
  ordenesCompra: [],
  ordenCompraActivo: null,
  setArrayOrdenCompra: (arrayOrdenCompra) =>
    set(() => ({ ordenesCompra: arrayOrdenCompra })),
  setOrdenCompraActivo: (ordenCompraActivo) =>
    set(() => ({ ordenCompraActivo })),
  postOrdenCompra: (nuevoOrdenCompra) =>
    set((state) => ({
      ordenesCompra: [...state.ordenesCompra, nuevoOrdenCompra],
    })),
  updateOrdenCompra: (ordenCompraActualizado) =>
    set((state) => ({
      ordenesCompra: state.ordenesCompra.map((ordenCompra) =>
        ordenCompra.id === ordenCompraActualizado.id
          ? ordenCompraActualizado
          : ordenCompra
      ),
    })),
  deleteOrdenCompra: (idOrdenCompra) =>
    set((state) => ({
      ordenesCompra: state.ordenesCompra.filter(
        (ordenCompra) => ordenCompra.id !== idOrdenCompra
      ),
    })),
}));
