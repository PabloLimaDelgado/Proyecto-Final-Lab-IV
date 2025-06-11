import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "./productos.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useNavigate } from "react-router-dom";
import { detalleProductoStore } from "../../../store/detalleProductoStore";

interface IProductos {
  genero: string;
  tipo: string;
}

export const Productos: FC<IProductos> = ({ genero, tipo }) => {
  const { detalles, setArrayDetalle } = detalleProductoStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`
        );
        const data: IDetalle[] = await response.json();
        
        setArrayDetalle(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetalle();
  }, []);

  const handleNavigate = (idProducto: number | null) => {
    navigate(`/vistaDetalleProducto?idProducto=${idProducto}`);
  };

  const searchValue = {
    nombreProducto: "",
  };

  const [values, setValues] = useState(searchValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className={styles.productosContainer}>
        <div className={styles.buscador}>
          <input
            type="text"
            placeholder="Buscar producto"
            onChange={handleChange}
            value={values.nombreProducto}
            name="nombreProducto"
          />
          <button>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        <div className={styles.gridDetalles}>
          {detalles &&
            Object.values(
              detalles
                .filter(
                  (detalle) =>
                    detalle.producto.sexo.toLowerCase() ===
                      genero.toLowerCase() &&
                    detalle.producto.tipoProducto.toLowerCase() ===
                      tipo.toLowerCase() &&
                    detalle.producto.estado === true
                )
                .filter((detalle) =>
                  detalle.producto.nombre
                    .toLowerCase()
                    .includes(values.nombreProducto.toLowerCase())
                )
                .reduce((acc, detalle) => {
                  const productoId = detalle.producto.id;
                  if (productoId !== undefined && !acc[productoId]) {
                    acc[productoId] = detalle;
                  }
                  return acc;
                }, {} as Record<number, IDetalle>)
            ).map((detalle) => (
                <div key={detalle.producto.id} className={styles.divProducto}>
                  <img src={detalle.imagenList[0]?.url} alt={detalle.imagenList[0].alt} />
                  <h5>{detalle.producto.nombre}</h5>
                  <div className={styles.divButtonProducto}>
                    <button
                      onClick={() =>
                        handleNavigate(detalle.producto.id ?? null)
                      }
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};
