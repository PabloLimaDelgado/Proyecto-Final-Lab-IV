import { create } from "zustand";
import { ITalle } from "../types/ITalle";

interface ITalleStore {
  talles: ITalle[];
  talleActivo: ITalle | null;
  setArrayTalle: (arrayTalle: ITalle[]) => void;
  postTalle: (nuevoTalle: ITalle) => void;
}

export const talleStore = create<ITalleStore>((set) => ({
  talles: [],
  talleActivo: null,
  setArrayTalle: (arrayTalle) => set(() => ({ talles: arrayTalle })),
  postTalle: (talleNuevo) =>
    set((state) => ({ talles: [...state.talles, talleNuevo] })),
}));
