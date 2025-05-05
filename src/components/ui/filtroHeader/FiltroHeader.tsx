import { FC } from "react";
import styles from "./filtroHeader.module.css";

interface IFiltroHeader {
  titulo: string;
  onSelect: (tipo: string, genero: string) => void;
}

export const FiltroHeader: FC<IFiltroHeader> = ({ titulo, onSelect }) => {
  const prendas = ["Buzo", "Calzado", "Campera", "Remera", "Zapatillas"];
  return (
    <div className={styles.filtroContainer}>
      <h2>{titulo}</h2>
      <ul>
        {prendas.map((prenda) => (
          <li key={prenda}>
            <a onClick={() => onSelect(prenda, titulo)}>{prenda}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
