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
import { ConfirmacionPago } from "../components/screens/ConfirmacionPago/ConfirmacionPago";
import { PrivateRoute } from "./PrivateRoute";

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

        <Route
          path="/vistaLanding"
          element={
            <PrivateRoute>
              <Landing />
            </PrivateRoute>
          }
        />

        <Route
          path="/vistaShop"
          element={
            <PrivateRoute>
              <Shop />
            </PrivateRoute>
          }
        />
        <Route
          path="/vistaPedidos"
          element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
        />
        <Route
          path="/confirmacionPago"
          element={
            <PrivateRoute>
              <ConfirmacionPago />
            </PrivateRoute>
          }
        />
        <Route
          path="/vistaDetalleProducto"
          element={
            <PrivateRoute>
              <DetalleProducto />
            </PrivateRoute>
          }
        />
        <Route
          path="/VistaUsuario"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/VistaCarrito"
          element={
            <PrivateRoute>
              <Carrito />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};
