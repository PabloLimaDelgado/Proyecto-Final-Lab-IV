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
        const today = new Date().toISOString().split("T")[0];
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/precio/fechaDescuento/${today}`
        );
        const data: IPrecio[] = await response.json();

        // Mezcla aleatoria
        const shuffled = data.sort(() => 0.5 - Math.random());
        // Obtiene solo 5
        const selected = shuffled.slice(0, 5);

        setPrecios(selected);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetalle();
  }, []);

  const handleSelect = (tipo: string, genero: string) => {
    navigate(`/vistaShop?tipo=${tipo}&genero=${genero}`);
  };

  const handleNavigate = (idProducto: number | null) => {
    navigate(`/vistaDetalleProducto?idProducto=${idProducto}`);
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
            {precios &&
              precios.map((precio) => (
                <div key={precio.id}>
                  <img src={precio.detalle.imagenList[0].url} alt="" />
                  <h4>{precio.detalle.producto.nombre}</h4>
                  <div className={styles.divPrecio}>
                    <h4
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                      }}
                    >
                      $ {precio.precioVenta}
                    </h4>
                    <h4>
                      {precio.descuento
                        ? `$${(
                            Number(precio.precioVenta) -
                            (Number(precio.precioVenta) *
                              precio.descuento.descuento) /
                              100
                          ).toFixed(2)}`
                        : `$${Number(precio.precioVenta).toFixed(2)}`}
                    </h4>
                  </div>

                  <div className={styles.divButtonProducto}>
                    <button
                      onClick={() =>
                        handleNavigate(precio.detalle.producto.id ?? null)
                      }
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))}
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
