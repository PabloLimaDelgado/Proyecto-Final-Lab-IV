import { FC, useEffect, useState } from "react";
import styles from "./productos.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useNavigate } from "react-router-dom";

interface IProductos {
  genero: string;
  tipo: string;
}

export const Productos: FC<IProductos> = ({ genero, tipo }) => {
  const [detalles, setDetalles] = useState<null | IDetalle[]>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`
        );
        const data: IDetalle[] = await response.json();
        console.log(data);

        setDetalles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetalle();
  }, []);

  const handleNavigate = (idDetalleProducto: number | null) => {
    navigate(`/vistaDetalleProducto?idDetalleProducto=${idDetalleProducto}`);
  };

  return (
    <>
      <div className={styles.productosContainer}>
        <div className={styles.buscador}>
          <input type="text" placeholder="Buscar producto" />
          <button>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        <div className={styles.gridDetalles}>
          {detalles &&
            detalles
              .filter(
                (detalle) =>
                  detalle.producto.sexo.toLowerCase() ===
                    genero.toLowerCase() &&
                  detalle.producto.tipoProducto.toLowerCase() ===
                    tipo.toLowerCase()
              )
              .map((detalle) => (
                <>
                  <div className={styles.divProducto}>
                    <img src={detalle.imagenList[0].url} alt="" />
                    <h5>{detalle.producto.nombre}</h5>

                    <div className={styles.divButtonProducto}>
                      <button
                        onClick={() =>
                          handleNavigate(detalle.id ? detalle.id : null)
                        }
                      >
                        Ver mas
                      </button>
                    </div>
                  </div>
                </>
              ))}
        </div>
      </div>
    </>
  );
};
