import { FC, useState, useEffect } from "react";
import logo from "../../../images/logoblanco.png";
import styles from "./filterBar.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

interface IFilterBar {
  genero: string;
  tipo: string;
}

export const FilterBar: FC<IFilterBar> = ({ genero, tipo }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prendas = ["Buzo", "Pantalon", "Campera", "Remera", "Calzado"];

  const [filtros, setFiltros] = useState({
    precio: {
      masBarato: false,
      masCaro: false,
    },
    orden: {
      masVendido: false,
      nuevo: false,
    },
  });

  const handleCheckboxChange = (section: "precio" | "orden", key: string) => {
    setFiltros((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof (typeof prev)[typeof section]],
      },
    }));
  };

  const handleSelect = (tipo: string, genero: string) => {
    const url = new URLSearchParams();
    url.set("tipo", tipo);
    url.set("genero", genero);

    if (filtros.precio.masBarato) url.set("min", "0");
    if (filtros.precio.masCaro) url.set("max", "1000000");
    if (filtros.orden.masVendido) url.set("masVendido", "true");
    if (filtros.orden.nuevo) url.set("nuevo", "true");

    navigate(`/vistaShop?${url.toString()}`);
  };

  useEffect(() => {
    if (tipo && genero) {
      handleSelect(tipo, genero);
    }
  }, [filtros]);

  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterLogoContainer}>
        <h1>{genero}</h1>
        <img src={logo} alt="logo" />
      </div>

      <div className={styles.filterUlContainer}>
        <ul>
          {prendas.map((prenda) => (
            <li
              key={prenda}
              className={tipo === prenda ? styles.filterUlContainerSelected : ""}
              onClick={() => handleSelect(prenda, genero)}
            >
              {prenda}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterPrecio}>
        <h2>Ordenar por precio: </h2>
        <label>
          Más barato:
          <input
            type="checkbox"
            checked={filtros.precio.masBarato}
            onChange={() => handleCheckboxChange("precio", "masBarato")}
          />
        </label>
        <label>
          Más caro:
          <input
            type="checkbox"
            checked={filtros.precio.masCaro}
            onChange={() => handleCheckboxChange("precio", "masCaro")}
          />
        </label>
      </div>

      <div className={styles.filterMasVendido}>
        <label>
          Más vendido:
          <input
            type="checkbox"
            checked={filtros.orden.masVendido}
            onChange={() => handleCheckboxChange("orden", "masVendido")}
          />
        </label>

        <label>
          Nuevo:
          <input
            type="checkbox"
            checked={filtros.orden.nuevo}
            onChange={() => handleCheckboxChange("orden", "nuevo")}
          />
        </label>
      </div>
    </div>
  );
};
