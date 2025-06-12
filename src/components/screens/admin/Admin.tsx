import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FilterBarAdmin } from "../../ui/filterBarAdmin/FilterBarAdmin";
import { ProductosAdmin } from "../../ui/productosAdmin/ProductosAdmin";
import { DescuentosAdmin } from "../../ui/descuentosAdmin/DescuentosAdmin";
import { PedidosAdmin } from "../../ui/pedidosAdmin/PedidosAdmin";

import styles from "./admin.module.css";
import { CrearUsuarioAdmin } from "../../ui/modals/usuarioAdmin/CrearUsuarioAdmin";

export const Admin = () => {
  /*NAVIGATE*/
  const navigate = useNavigate();

  /*USE STATE*/
  const [tabla, setTabla] = useState<string>("productos");
  const [crearAdmin, setCrearAdmin] = useState<boolean>(false);

  /*HANDLES*/
  const handleTablaChange = (tabla: string) => {
    setTabla(tabla);
  };

  const handleNavigateToLogin = () => {
    navigate("/vistaLogin");
  };

  const handleCrearAdmin = () => {
    setCrearAdmin(!crearAdmin);
  };

  console.log(crearAdmin);

  return (
    <>
      <div className={styles.divLanding}>
        <button onClick={handleNavigateToLogin}>
          <span className="material-symbols-outlined">home</span>
        </button>

        <div className={styles.crearUsuarioAdmin}>
          <button onClick={handleCrearAdmin}>
            <span>
              <span className="material-symbols-outlined">person_add</span>
            </span>
          </button>
          <h3>Añadir admin</h3>
        </div>
      </div>

      <div className={styles.adminContainer}>
        <FilterBarAdmin useHandleTabla={handleTablaChange} tabla={tabla} />
        {tabla === "productos" && <ProductosAdmin />}
        {tabla === "descuentos" && <DescuentosAdmin />}
        {tabla === "pedidos" && <PedidosAdmin />}
      </div>

      {crearAdmin && <CrearUsuarioAdmin close={handleCrearAdmin} />}
    </>
  );
};
