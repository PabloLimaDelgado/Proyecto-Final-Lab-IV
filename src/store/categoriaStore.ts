import { create } from "zustand";
import { ICategoria } from "../types/ICategoria";

interface ICategoriaStore {
  categorias: ICategoria[];
  categoriaActiva: ICategoria | null;
  setArrayCategoria: (arrayCategoria: ICategoria[]) => void;
  postCategoria: (nuevaCategoria: ICategoria) => void;
}

export const categoriaStore = create<ICategoriaStore>((set) => ({
  categorias: [],
  categoriaActiva: null,
  setArrayCategoria: (arrayCategorias) =>
    set(() => ({ categorias: arrayCategorias })),
  postCategoria: (categoriaNueva) =>
    set((state) => ({ categorias: [...state.categorias, categoriaNueva] })),
}));
