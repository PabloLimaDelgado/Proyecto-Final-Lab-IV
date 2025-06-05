import { useEffect } from "react";
import { AppRouter } from "./routes/AppRouter";
import { usuarioStore } from "./store/usuarioStore";
import { carritoStore } from "./store/carritoStore";

function App() {
  const { setUsuarioActivo } = usuarioStore();
  const { setCarritoActivo } = carritoStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioActivo");
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setUsuarioActivo(usuario);
    }

    const storedCarrito = localStorage.getItem("carritoActivo");
    if (storedCarrito) {
      const carrito = JSON.parse(storedCarrito);
      setCarritoActivo(carrito);
    }
  }, []);
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
