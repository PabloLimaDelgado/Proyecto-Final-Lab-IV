import { create } from "zustand";
import { IUsuario } from "../types/IUsuario";

interface IUsuarioStore {
  usuarios: IUsuario[];
  usuarioActivo: IUsuario | null;
  setArrayUsuario: (arrayUsuario: IUsuario[]) => void;
  setUsuarioActivo: (productoUsuario: IUsuario | null) => void;
  postusuario: (nuevoUsuario: IUsuario) => void;
  updateUsuario: (usuarioActualizado: IUsuario) => void;
  deleteUsuario: (idUsuario: number) => void;
}

export const usuarioStore = create<IUsuarioStore>((set) => ({
  usuarios: [],
  usuarioActivo: null,
  setArrayUsuario: (arrayUsuario) => set(() => ({ usuarios: arrayUsuario })),
  setUsuarioActivo: (usuarioActivo) => set(() => ({ usuarioActivo })),
  postusuario: (nuevoUsuario) =>
    set((state) => ({ usuarios: [...state.usuarios, nuevoUsuario] })),
  updateUsuario: (usuarioActualizado) =>
    set((state) => ({
      usuarios: state.usuarios.map((usuario) =>
        usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario
      ),
    })),
  deleteUsuario: (idUsuario) =>
    set((state) => ({
      usuarios: state.usuarios.filter((usuario) => usuario.id !== idUsuario),
    })),
}));
