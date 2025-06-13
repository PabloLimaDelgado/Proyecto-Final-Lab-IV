import { FC, useEffect, useState } from "react";
import logo from "../../../images/logoblanco.png";
import styles from "./filterBar.module.css";
import { useNavigate } from "react-router-dom";
import { ICategoria } from "../../../types/ICategoria";

interface IFilterBar {
  genero: string;
  tipo: string;
}

export const FilterBar: FC<IFilterBar> = ({ genero, tipo }) => {
  const navigate = useNavigate();
  const prendas = ["Buzo", "Pantalon", "Campera", "Remera", "Calzado"];
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [usarFechaHoy, setUsarFechaHoy] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/categoria`
        );
        const data: ICategoria[] = await response.json();
        const dataFiltered = data.filter((categoria) => categoria.estado === true);
        setCategorias(dataFiltered);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategoria();
  }, []);

  const getFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
    };
  const handleSelect = (
    tipo: string,
    genero: string,
    categoria?: string | null
  ) => {
    setCategoriaSeleccionada(categoria ?? null);

    const queryParams = new URLSearchParams({
      tipo,
      genero,
    });

    if (categoria) {
      queryParams.append("categoria", categoria);
    }

    navigate(`/vistaShop?${queryParams.toString()}`);
  };
const handleCheckboxChange = (checked: boolean) => {
  setUsarFechaHoy(checked);

  const queryParams = new URLSearchParams({
    tipo,
    genero,
  });

  if (categoriaSeleccionada) {
    queryParams.append("categoria", categoriaSeleccionada);
  }

  if (checked) {
    queryParams.append("fechaDescuento", getFechaHoy());
  }

  navigate(`/vistaShop?${queryParams.toString()}`);
};

  return (
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
              className={tipo === prenda ? styles.filterUlContainerSelected : ""}
              onClick={() => handleSelect(prenda, genero, categoriaSeleccionada)}
            >
              {prenda}
            </li>
          ))}

          <li
            key="todas-categorias"
            className={categoriaSeleccionada === null ? styles.filterUlContainerSelected : ""}
            onClick={() => handleSelect(tipo, genero, null)}
          >
            Todas las categorías
          </li>

          {categorias.map((cat) => (
            <li
              key={cat.id}
              className={categoriaSeleccionada === cat.nombre ? styles.filterUlContainerSelected : ""}
              onClick={() => handleSelect(tipo, genero, cat.nombre)}
            >
              {cat.nombre}
            </li>
          ))}
        </ul>
        
        <div className={styles.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              checked={usarFechaHoy}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
            Buscar descuento
          </label>
        </div>
      </div>

    </div>
  );
};
