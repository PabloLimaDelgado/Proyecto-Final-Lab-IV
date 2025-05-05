import { FC, useState } from "react";
import { FiltroHeader } from "../filtroHeader/FiltroHeader";
import styles from "./filtrosHeader.module.css";
import { useNavigate } from "react-router-dom";

interface IFiltrosHeader {
  estado: boolean;
}

export const FiltrosHeader: FC<IFiltrosHeader> = ({ estado }) => {
  const [estadoFiltro, setEstadoFiltro] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setEstadoFiltro(true);
  };

  const handleMouseLeave = () => {
    setEstadoFiltro(false);
  };

  const handleSelect = (tipo: string, genero: string) => {
    navigate(`/vistaShop?tipo=${tipo}&genero=${genero}`);
  };

  return (
    (estado || estadoFiltro) && (
      <div
        className={styles.filtroHeaderContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FiltroHeader titulo="Femenino" onSelect={handleSelect} />
        <FiltroHeader titulo="Masculino" onSelect={handleSelect} />
      </div>
    )
  );
};
