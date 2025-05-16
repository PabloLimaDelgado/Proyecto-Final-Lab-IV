import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { useLocation } from "react-router-dom";
import styles from "./detalleProducto.module.css";
import { IDetalle } from "../../../types/IDetalle";
import React, { useEffect, useState } from "react";
import { detalleProductoStore } from "../../../store/detalleProductoStore";

export const DetalleProducto = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idProducto = params.get("idProducto");
  const { detalles, setArrayDetalle } = detalleProductoStore();

  const [detalleIndex, setDetalleIndex] = useState<number>(0);
  const [imagenIndex, setImagenIndex] = useState<number>(0);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`
        );
        const data: IDetalle[] = await response.json();
        setArrayDetalle(data);

        const index = data.findIndex(
          (detalle) => detalle.producto?.id === Number(idProducto)
        );

        setDetalleIndex(index);
      } catch (error) {
        console.log("Error al traer detalles:", error);
      }
    };

    fetchDetalle();
  }, [idProducto, setArrayDetalle]);

  return (
    <>
      <HeaderShop />
      <div className={styles.detalleProductoContainer}>
        {detalles && (
          <>
            {detalles && (
              <>
                <div className={styles.imagenDivContainer}>
                  <div
                    className={styles.imagenDivWitdh}
                    style={{
                      backgroundImage: `url(${detalles[detalleIndex].imagenList[imagenIndex].url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div>
                      <img
                        src={detalles[detalleIndex].imagenList[imagenIndex].url}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.carritoContainer}>
              <h2>{detalles[detalleIndex].producto.nombre}</h2>
              <ul>
                {detalles
                  .filter(
                    (detalle) => detalle.producto.id === Number(idProducto)
                  )
                  .map((detalle) => (
                    <li key={detalle.id}>{detalle.talle.talle}</li>
                  ))}
              </ul>
              <div className={styles.imagenesContainer}>
                {detalles
                  .filter(
                    (detalle) => detalle.producto.id === Number(idProducto)
                  )
                  .map((detalle, indexDetalle) =>
                    detalle.imagenList.map((image, indexImagen) => (
                      <img
                        src={image.url}
                        onClick={() => {
                          setImagenIndex(indexImagen);
                          setDetalleIndex(indexDetalle);
                        }}
                      />
                    ))
                  )}
              </div>
              <button>Añadir al Carrito</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
