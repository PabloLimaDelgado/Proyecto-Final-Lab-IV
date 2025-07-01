import { JSX } from "react";
import { IUsuario } from "../types/IUsuario";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  let usuario: IUsuario | null = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
  } catch (error) {
    console.error("Error al parsear usuarioActivo:", error);
  }

  if (!usuario) {
    return <Navigate to="/vistaLogin" replace />;
  }

  return children;
};
