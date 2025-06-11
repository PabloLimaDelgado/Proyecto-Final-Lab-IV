import { useEffect, useState } from "react";
import styles from "./landing.module.css";
import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { useNavigate } from "react-router-dom";
import { IDetalle } from "../../../types/IDetalle";

export const Landing = () => {
  const [detalles, setDetalles] = useState<null | IDetalle[]>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        console.log(today);

        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/conDescuento/${today}`,
        );
        const data: IDetalle[] = await response.json();

        // Mezcla aleatoria
        const shuffled = data.sort(() => 0.5 - Math.random());
        // Obtiene solo 5
        const selected = shuffled.slice(0, 5);

        setDetalles(selected);
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
            {detalles &&
              detalles.map((detalle) => (
                <div key={detalle.id}>
                  <img src={detalle.imagenList[0].url} alt="" />
                  <h4>{detalle.producto.nombre}</h4>
                  <div className={styles.divPrecio}>
                    <h4
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                      }}
                    >
                      $ {detalle.precioDTO.precioVenta}
                    </h4>
                    <h4>
                      {detalle.precioDTO.descuento
                        ? `$${(
                            Number(detalle.precioDTO.precioVenta) -
                            (Number(detalle.precioDTO.precioVenta) *
                              detalle.precioDTO.descuento.descuento) /
                              100
                          ).toFixed(2)}`
                        : `$${Number(detalle.precioDTO.precioVenta).toFixed(2)}`}
                    </h4>
                  </div>

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
