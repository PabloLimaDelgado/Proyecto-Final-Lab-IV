import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FilterBarAdmin } from "../../ui/filterBarAdmin/FilterBarAdmin";
import { ProductosAdmin } from "../../ui/productosAdmin/ProductosAdmin";
import { DescuentosAdmin } from "../../ui/descuentosAdmin/DescuentosAdmin";
import { PedidosAdmin } from "../../ui/pedidosAdmin/PedidosAdmin";

import styles from "./admin.module.css";

export const Admin = () => {
  
  /*NAVIGATE*/
  const navigate = useNavigate();

  /*USE STATE*/
  const [tabla, setTabla] = useState<string>("productos");

  /*HANDLES*/
  const handleTablaChange = (tabla: string) => {
    setTabla(tabla);
  };

  const handleNavigateToLogin = () => {
    navigate("/vistaLogin");
  };

  return (
    <>
      <button className={styles.buttonLanding} onClick={handleNavigateToLogin}>
        <span className="material-symbols-outlined">home</span>
      </button>

      <div className={styles.adminContainer}>
        <FilterBarAdmin useHandleTabla={handleTablaChange} tabla={tabla} />
        {tabla === "productos" && <ProductosAdmin />}
        {tabla === "descuentos" && <DescuentosAdmin />}
        {tabla === "pedidos" && <PedidosAdmin />}
      </div>
    </>
  );
};
