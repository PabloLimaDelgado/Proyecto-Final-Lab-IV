import { useEffect, useState } from "react";
import styles from "./landing.module.css";
import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { IPrecio } from "../../../types/IPrecio";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const [precios, setPrecios] = useState<null | IPrecio[]>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/precio/fechaDescuento/2025-06-29`
        );
        const data: IPrecio[] = await response.json();
        console.log(data);

        setPrecios(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetalle();
  }, []);

  const handleSelect = (tipo: string, genero: string) => {
    navigate(`/vistaShop?tipo=${tipo}&genero=${genero}`);
  };

  return (
    <>
      <HeaderShop />
      <div className={styles.landingContainer}>
        <div className={styles.landingInfo}>
          <h2>¿Quienes somos?</h2>
          <p>
            En SneakShop, llevamos la moda directamente a tu puerta, estés donde
            estés. Somos una tienda online de ropa pensada para llegar a cada
            rincón del país, ofreciendo las últimas tendencias, calidad
            garantizada y una experiencia de compra simple y segura.
          </p>
        </div>
        <div className={styles.landingDescuentos}>
          <h3>Descuentos</h3>
          <div className={styles.containerDescuentos}>
            <button>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {precios &&
              precios.map((precio) => (
                <div key={precio.id}>
                  <img src={precio.detalle.imagenList[0].url} alt="" />
                  <h4>{precio.detalle.producto.nombre}</h4>
                  <h4>{precio.precioVenta}</h4>
                </div>
              ))}
            <button>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className={styles.containerImagenes}>
          <div className={styles.containerHombre}>
            <button onClick={() => handleSelect("Remera", "Masculino")}>
              Hombre
            </button>
          </div>
          <div className={styles.containerMujer}>
            <button onClick={() => handleSelect("Remera", "Femenino")}>
              Mujer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
