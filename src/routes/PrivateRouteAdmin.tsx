import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { IUsuario } from "../types/IUsuario";

export const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const usuario: IUsuario = JSON.parse(
    localStorage.getItem("usuarioActivo") || "null"
  );

  if (!usuario || usuario.rol !== "ADMIN") {
    return <Navigate to="/vistaLogin" replace />;
  }

  return children;
};
