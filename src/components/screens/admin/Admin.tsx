import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FilterBarAdmin } from "../../ui/filterBarAdmin/FilterBarAdmin";
import { ProductosAdmin } from "../../ui/productosAdmin/ProductosAdmin";
import { DescuentosAdmin } from "../../ui/descuentosAdmin/DescuentosAdmin";
import { PedidosAdmin } from "../../ui/pedidosAdmin/PedidosAdmin";
import styles from "./admin.module.css";
import { Admins } from "../../ui/Admins/Admins";

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
    navigate("/VistaLanding");
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
      </div>

      <div className={styles.adminContainer}>
        <FilterBarAdmin useHandleTabla={handleTablaChange} tabla={tabla} />
        {tabla === "productos" && <ProductosAdmin />}
        {tabla === "descuentos" && <DescuentosAdmin />}
        {tabla === "pedidos" && <PedidosAdmin />}
        {tabla === "admins" && <Admins />}
      </div>
    </>
  );
};
