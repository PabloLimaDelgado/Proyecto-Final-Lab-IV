import { create } from "zustand";
import { IDescuento } from "../types/IDescuento";

interface IDescuentoStore {
  descuentos: IDescuento[];
  descuentoActivo: IDescuento | null;
  setArrayDescuentos: (arrayDescuento: IDescuento[]) => void;
  setDescuentoActivo: (descuentoActivo: IDescuento | null) => void;
  postDescuento: (nuevoDescuento: IDescuento) => void;
  updateDescuento: (descuentoActualizado: IDescuento) => void;
  deleteDescuento: (idDescuento: number) => void;
}

export const descuentoStore = create<IDescuentoStore>((set) => ({
  descuentos: [],
  descuentoActivo: null,
  setArrayDescuentos: (arrayDescuento) =>
    set(() => ({ descuentos: arrayDescuento })),
  setDescuentoActivo: (descuentoActivo) => set(() => ({ descuentoActivo })),
  postDescuento: (nuevoDescuento) =>
    set((state) => ({
      descuentos: [...state.descuentos, nuevoDescuento],
    })),
  updateDescuento: (descuentoActualizado) =>
    set((state) => ({
      descuentos: state.descuentos.map((descuento) =>
        descuento.id === descuentoActualizado.id
          ? descuentoActualizado
          : descuento
      ),
    })),
  deleteDescuento: (idDescuento) =>
    set((state) => ({
      descuentos: state.descuentos.filter(
        (descuento) => descuento.id !== idDescuento
      ),
    })),
}));
