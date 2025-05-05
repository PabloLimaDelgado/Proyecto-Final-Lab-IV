import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { useLocation } from "react-router-dom";
import styles from "./detalleProducto.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useEffect, useState } from "react";

export const DetalleProducto = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idDetalleProducto = params.get("idDetalleProducto");
  const [detalle, setDetalle] = useState<null | IDetalle>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/${idDetalleProducto}`
        );
        const data: IDetalle = await response.json();
        console.log(data);

        setDetalle(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetalle();
  }, []);

  return (
    <>
      <HeaderShop />
      <div className={styles.detalleProductoContainer}>
        {detalle && (
          <>
            <div className={styles.imagenDivContainer}>
              <div>
                <h2>{detalle.producto.nombre}</h2>
                <p>{detalle.producto.categoria.nombre}</p>
              </div>
              <img src={detalle.imagenList[0].url} alt="" />
            </div>
            <div>
              <div>
                <ul>
                  <li>{detalle.talle.talle}</li>
                </ul>
              </div>
              <div>
                {detalle.imagenList.map((image) => (
                  <img src={image.url} alt={image.alt} key={image.id} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
