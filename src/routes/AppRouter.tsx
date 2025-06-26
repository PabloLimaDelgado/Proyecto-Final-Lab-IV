import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../components/screens/login/Login";
import { Admin } from "../components/screens/admin/Admin";
import { Shop } from "../components/screens/shop/Shop";
import { Landing } from "../components/screens/landing/Landing";
import { DetalleProducto } from "../components/screens/detalleProducto/DetalleProducto";
import { User } from "../components/screens/user/User";
import { Carrito } from "../components/screens/carrito/Carrito";
import { Pedidos } from "../components/screens/Pedidos/Pedidos";
import { PrivateRouteAdmin } from "./PrivateRouteAdmin"; // 👈

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/vistaLogin" replace />} />
        <Route path="/vistaLogin" element={<Login />} />

        <Route
          path="/vistaAdmin"
          element={
            <PrivateRouteAdmin>
              <Admin />
            </PrivateRouteAdmin>
          }
        />

        <Route path="/vistaShop" element={<Shop />} />
        <Route path="/VistaLanding" element={<Landing />} />
        <Route path="/vistaPedidos" element={<Pedidos />} />
        <Route path="/vistaDetalleProducto" element={<DetalleProducto />} />
        <Route path="/VistaUsuario" element={<User />} />
        <Route path="/VistaCarrito" element={<Carrito />} />
      </Routes>
    </>
  );
};
