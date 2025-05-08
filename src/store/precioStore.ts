import { create } from "zustand";
import { IPrecio } from "../types/IPrecio";

interface IPrecioStore {
  precios: IPrecio[];
  precioActivo: IPrecio | null;
  setArrayPrecio: (arrayPrecio: IPrecio[]) => void;
  setPrecioActivo: (precioActivo: IPrecio | null) => void;
  postPrecio: (nuevoPrecio: IPrecio) => void;
  updatePrecio: (precioActualizado: IPrecio) => void;
  deletePrecio: (idPrecio: number) => void;
}

export const precioStore = create<IPrecioStore>((set) => ({
  precios: [],
  precioActivo: null,
  setArrayPrecio: (arrayPrecio) => set(() => ({ precios: arrayPrecio })),
  setPrecioActivo: (precioActivo) => set(() => ({ precioActivo })),
  postPrecio: (nuevoPrecio) =>
    set((state) => ({ precios: [...state.precios, nuevoPrecio] })),
  updatePrecio: (precioActualizado) =>
    set((state) => ({
      precios: state.precios.map((precio) =>
        precio.id === precioActualizado.id ? precioActualizado : precio
      ),
    })),
  deletePrecio: (idPrecio) =>
    set((state) => ({
      precios: state.precios.filter((precio) => precio.id !== idPrecio),
    })),
}));
