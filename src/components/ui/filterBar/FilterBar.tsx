import { FC } from "react";
import logo from "../../../images/logoblanco.png";
import styles from "./filterBar.module.css";
import { useNavigate } from "react-router-dom";

interface IFilterBar {
  genero: string;
  tipo: string;
}

export const FilterBar: FC<IFilterBar> = ({ genero, tipo }) => {
  const navigate = useNavigate();
  const prendas = ["Buzo", "Pantalon", "Campera", "Remera", "Calzado"];

  const handleSelect = (tipo: string, genero: string) => {
    navigate(`/vistaShop?tipo=${tipo}&genero=${genero}`);
  };

  return (
    <>
      <div className={styles.filterBarContainer}>
        <div className={styles.filterLogoContainer}>
          <h1>{genero}</h1>
          <img src={logo} alt="" />
        </div>

        <div className={styles.filterUlContainer}>
          <ul>
            {prendas.map((prenda) => (
              <li
                key={prenda}
                className={
                  tipo === prenda ? styles.filterUlContainerSelected : ""
                }
                onClick={() => handleSelect(prenda, genero)}
              >
                {prenda}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
