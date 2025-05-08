import { create } from "zustand";
import { IProducto } from "../types/IProducto";

interface IProductoStore {
  productos: IProducto[];
  productoActivo: IProducto | null;
  setArrayProducto: (arrayProducto: IProducto[]) => void;
  setProductoActivo: (productoActivo: IProducto | null) => void;
  postProducto: (nuevoProducto: IProducto) => void;
  updateProducto: (productoActualizado: IProducto) => void;
  deleteProducto: (idProducto: number) => void;
}

export const productoStore = create<IProductoStore>((set) => ({
  productos: [],
  productoActivo: null,
  setArrayProducto: (arrayProducto) =>
    set(() => ({ productos: arrayProducto })),
  setProductoActivo: (productoActivo) => set(() => ({ productoActivo })),
  postProducto: (nuevoProducto) =>
    set((state) => ({ productos: [...state.productos, nuevoProducto] })),
  updateProducto: (productoActualizado) =>
    set((state) => ({
      productos: state.productos.map((producto) =>
        producto.id === productoActualizado.id ? productoActualizado : producto
      ),
    })),
  deleteProducto: (idProducto) =>
    set((state) => ({
      productos: state.productos.filter(
        (producto) => producto.id !== idProducto
      ),
    })),
}));
