import { useLocation } from "react-router-dom";
import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { FilterBar } from "../../ui/filterBar/FilterBar";
import { Productos } from "../../ui/productos/Productos";
import styles from "./shop.module.css";

export const Shop = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tipo = params.get("tipo");
  const genero = params.get("genero");

  return (
    <>
      <HeaderShop />
      <div className={styles.shopContainer}>
        {tipo && genero && <FilterBar genero={genero} tipo={tipo} />}
        {tipo && genero && <Productos genero={genero} tipo={tipo} />}
      </div>
    </>
  );
};
