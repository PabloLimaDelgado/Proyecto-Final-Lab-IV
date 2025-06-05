import { create } from "zustand";
import { ICarrito } from "../types/ICarrito";

interface ICarritoStore {
  carritos: ICarrito[];
  carritoActivo: ICarrito | null;
  setArrayCarrito: (arrayCarrito: ICarrito[]) => void;
  setCarritoActivo: (carritoActivo: ICarrito | null) => void;
  postCarrito: (nuevoCarrito: ICarrito) => void;
  updateCarrito: (carritoActualizado: ICarrito) => void;
  deleteCarrito: (idCarrito: number) => void;
}

export const carritoStore = create<ICarritoStore>((set) => ({
  carritos: [],
  carritoActivo: null,
  setArrayCarrito: (arrayCarrito) => set(() => ({ carritos: arrayCarrito })),
  setCarritoActivo: (carritoActivo) => set(() => ({ carritoActivo })),
  postCarrito: (nuevoCarrito) =>
    set((state) => ({ carritos: [...state.carritos, nuevoCarrito] })),
  updateCarrito: (carritoActualizado) =>
    set((state) => ({
      carritos: state.carritos.map((carrito) =>
        carrito.id === carritoActualizado.id ? carritoActualizado : carrito
      ),
    })),
  deleteCarrito: (idCarrito) =>
    set((state) => ({
      carritos: state.carritos.filter((carrito) => carrito.id !== idCarrito),
    })),
}));
