import { useState } from "react";
import { FilterBarAdmin } from "../../ui/filterBarAdmin/FilterBarAdmin";
import { ProductosAdmin } from "../../ui/productosAdmin/ProductosAdmin";
import { DescuentosAdmin } from "../../ui/descuentosAdmin/DescuentosAdmin";
import { PedidosAdmin } from "../../ui/pedidosAdmin/PedidosAdmin";
import styles from "./admin.module.css";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const navigate = useNavigate();
  const [tabla, setTabla] = useState<string>("productos");

  const useHandleTabla = (tabla: string) => {
    setTabla(tabla);
  };

  const handleNavigate = () => {
    navigate("/vistaLogin");
  };

  return (
    <>
      <button className={styles.buttonLanding} onClick={handleNavigate}>
        <span className="material-symbols-outlined">home</span>
      </button>
      <div className={styles.adminContainer}>
        <FilterBarAdmin useHandleTabla={useHandleTabla} tabla={tabla} />
        {tabla === "productos" ? (
          <ProductosAdmin />
        ) : tabla === "descuentos" ? (
          <DescuentosAdmin />
        ) : tabla === "pedidos" ? (
          <PedidosAdmin />
        ) : (
          ""
        )}
      </div>
    </>
  );
};
