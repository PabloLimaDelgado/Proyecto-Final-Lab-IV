import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../components/screens/login/Login";
import { Admin } from "../components/screens/admin/Admin";
import { Shop } from "../components/screens/shop/Shop";
import { Landing } from "../components/screens/landing/Landing";
import { DetalleProducto } from "../components/screens/detalleProducto/DetalleProducto";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/vistaUsuario" replace />} />
        <Route path="/vistaUsuario" element={<Login />} />
        <Route path="/vistaAdmin" element={<Admin />} />
        <Route path="/vistaShop" element={<Shop />} />
        <Route path="/VistaLanding" element={<Landing />} />
        <Route path="/vistaDetalleProducto" element={<DetalleProducto />} />
      </Routes>
    </>
  );
};
