import { FC } from "react";
import logoNegro from "../../../images/logonegro.png";
import styles from "./filterBarAdmin.module.css";

interface IFilterBarAdmin {
  useHandleTabla: (tabla: string) => void;
  tabla: string;
}

export const FilterBarAdmin: FC<IFilterBarAdmin> = ({
  useHandleTabla,
  tabla,
}) => {
  return (
    <>
      <div className={styles.filterBarAdminContainer}>
        <div className={styles.logoContainer}>
          <img src={logoNegro} alt="" />
          <h1>SneakAdmin</h1>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            className={tabla === "productos" ? styles.activeButton : ""}
            onClick={() => useHandleTabla("productos")}
          >
            Productos
          </button>
          <button
            className={tabla === "pedidos" ? styles.activeButton : ""}
            onClick={() => useHandleTabla("pedidos")}
          >
            Pedidos
          </button>
          <button
            className={tabla === "descuentos" ? styles.activeButton : ""}
            onClick={() => useHandleTabla("descuentos")}
          >
            Descuentos
          </button>
        </div>
      </div>
    </>
  );
};
