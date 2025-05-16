import { create } from "zustand";
import { IDireccion } from "../types/IDireccion";

interface IDireccionStore {
  direcciones: IDireccion[];
  direccionActiva: IDireccion | null;
  setArrayDireccion: (arrayDireccion: IDireccion[]) => void;
  setDireccionActiva: (direccionActiva: IDireccion) => void;
  postDireccion: (nuevaDireccion: IDireccion) => void;
  updateDireccion: (direccionActualizada: IDireccion) => void;
  deleteDireccion: (idDireccion: number) => void;
}

export const direccionStore = create<IDireccionStore>((set) => ({
  direcciones: [],
  direccionActiva: null,
  setArrayDireccion: (arrayDireccion) =>
    set(() => ({ direcciones: arrayDireccion })),
  setDireccionActiva: (direccionActiva) => set(() => ({ direccionActiva })),
  postDireccion: (nuevaDireccion) =>
    set((state) => ({ direcciones: [...state.direcciones, nuevaDireccion] })),
  updateDireccion: (direccionActualizada) =>
    set((state) => ({
      direcciones: state.direcciones.map((direccion) =>
        direccion.id === direccionActualizada.id
          ? direccionActualizada
          : direccion
      ),
    })),
  deleteDireccion: (idDireccion) =>
    set((state) => ({
      direcciones: state.direcciones.filter(
        (direccion) => direccion.id !== idDireccion
      ),
    })),
}));
