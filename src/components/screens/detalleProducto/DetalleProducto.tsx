import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./detalleProducto.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useEffect, useState } from "react";
import { detalleProductoStore } from "../../../store/detalleProductoStore";
import { carritoStore } from "../../../store/carritoStore";
import { ICarrito } from "../../../types/ICarrito";
import { IPrecio } from "../../../types/IPrecio";
import { precioStore } from "../../../store/precioStore";

export const DetalleProducto = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idProducto = params.get("idProducto");

  const { detalles, setArrayDetalle } = detalleProductoStore();
  const { precios, setArrayPrecio } = precioStore();
  const {
    carritos,
    postCarrito,
    setCarritoActivo,
    carritoActivo,
    updateCarrito,
  } = carritoStore();

  const [detalleIndex, setDetalleIndex] = useState<number>(0);
  const [imagenIndex, setImagenIndex] = useState<number>(0);
  const [talleActivo, setTalleActivo] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`
        );
        const data: IDetalle[] = await response.json();

        const detalles: IDetalle[] = data.filter(
          (detalle) => detalle.producto.id == Number(idProducto)
        );

        setArrayDetalle(detalles);
        setTalleActivo(detalles[0].talle.talle);

        const index = detalles.findIndex(
          (detalle) => detalle.producto?.id === Number(idProducto)
        );

        setDetalleIndex(index);

        console.log(detalles);
      } catch (error) {
        console.log("Error al traer detalles:", error);
      }
    };

/*     const fetchPrecio = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/precio`
        );
        const data: IPrecio[] = await response.json();

        const precios: IPrecio[] = data.filter(
          (precio) => precio.detalle.producto.id == Number(idProducto)
        );

        setArrayPrecio(precios);
      } catch (error) {
        console.log("Error al traer detalles:", error);
      }
    };
  fetchPrecio(); */
    fetchDetalle();
  

    const carritoGuardado = localStorage.getItem("carritoActivo");

    if (carritoGuardado) {
      const carrito = JSON.parse(carritoGuardado);
      setCarritoActivo(carrito);
    } else if (carritos.length === 0) {
      const carritoNuevo: ICarrito = {
        id: 1,
        detallesProductos: [],
      };
      postCarrito(carritoNuevo);
      setCarritoActivo(carritoNuevo);
      localStorage.setItem("carritoActivo", JSON.stringify(carritoNuevo));
    }
  }, [idProducto, setArrayDetalle]);

  const [imagenActiva, setImagenActiva] = useState<{
    detalleId: number;
    imagenIndex: number;
  }>({
    detalleId: detalleIndex,
    imagenIndex: imagenIndex,
  });

  useEffect(() => {
    if (detalles.length > 0 && detalles[detalleIndex]) {
      setImagenActiva({
        detalleId: detalles[detalleIndex].id ?? 0,
        imagenIndex: detalles[detalleIndex].imagenList[0].id ?? 0,
      });
    }
  }, [detalleIndex, detalles]);

  const handleNavigate = () => {
    navigate(-1);
  };

  const ordenTalles = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <>
      <HeaderShop />
      <div className={styles.detalleProductoContainer}>
        {detalles && detalles[detalleIndex] && (
          <>
            {detalles.filter((detalle) => detalle.estado === true) && (
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
                    <button className={styles.goBack} onClick={handleNavigate}>
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                    </button>

                    <div>
                      <img
                        src={detalles[detalleIndex].imagenList[imagenIndex].url}
                        alt={detalles[detalleIndex].imagenList[imagenIndex].alt}
                      />
                    </div>

                    <div className={styles.imagenesNoSeleccionadas}>
                      {detalles[detalleIndex].imagenList
                        .filter((imagen) => imagen.estado === true)
                        .map((imagen, index) => (
                          <img
                            src={imagen.url}
                            alt={imagen.alt}
                            key={imagen.id}
                            onClick={() => setImagenIndex(index)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.carritoContainer}>
              <h2>{detalles[detalleIndex].producto.nombre}</h2>
              <ul>
                {(() => {
                  const tallesMostrados = new Set();
                  const ordenTalles = ["XS", "S", "M", "L", "XL", "XXL"];

                  return detalles
                    .filter(
                      (detalle) =>
                        detalle.producto.id === Number(idProducto) &&
                        detalle.estado === true
                    )
                    .filter((detalle) => {
                      const talle = detalle.talle.talle;
                      if (tallesMostrados.has(talle)) return false;
                      tallesMostrados.add(talle);
                      return true;
                    })
                    .sort(
                      (a, b) =>
                        ordenTalles.indexOf(a.talle.talle) -
                        ordenTalles.indexOf(b.talle.talle)
                    )
                    .map((detalle) => (
                      <li
                        key={detalle.id}
                        onClick={() => setTalleActivo(detalle.talle.talle)}
                        className={
                          talleActivo === detalle.talle.talle
                            ? styles.liActivo
                            : ""
                        }
                      >
                        {detalle.talle.talle}
                      </li>
                    ));
                })()}
              </ul>

              <div className={styles.imagenesContainer}>
                {detalles
                  .filter((detalle) => detalle.talle.talle === talleActivo)
                  .filter((detalle) => detalle.estado === true)
                  .map((detalle) => (
                    <>
                      <div
                        key={detalle.id}
                        className={`${
                          imagenActiva.detalleId === detalle.id &&
                          imagenActiva.imagenIndex === detalle.imagenList[0].id
                            ? styles.detalleActivo
                            : ""
                        }`}
                      >
                        <img
                          src={
                            detalle.imagenList.length > 0
                              ? detalle.imagenList[0].url
                              : ""
                          }
                          onClick={() => {
                            const nuevoDetalleIndex = detalles.findIndex(
                              (d) => d.id === detalle.id
                            );
                            setDetalleIndex(nuevoDetalleIndex);
                            setImagenActiva({
                              detalleId: detalle.id ?? 1,
                              imagenIndex: detalle.imagenList[0].id ?? 1,
                            });
                            setImagenIndex(0);
                          }}
                        />

                        <div>
                          <h2>
                            <p>Color: </p>
                            {detalle.color}
                          </h2>
                          <h2>
                            <p>Categoria:</p>{" "}
                            {detalle.producto.categoria.nombre}
                          </h2>

                          <h2>
                            <p>Precio: </p>
                            {(() => {
                              const precio = precios.find(
                                (precio) => precio.detalle.id === detalle.id
                              );

                              if (!precio) return "N/A";

                              const { precioVenta, descuento } = precio;
                              const hoy = new Date();

                              if (
                                descuento &&
                                descuento.fechaInicio &&
                                descuento.fechaFin &&
                                new Date(descuento.fechaInicio) <= hoy &&
                                hoy <= new Date(descuento.fechaFin)
                              ) {
                                const porcentaje = descuento.descuento;
                                const precioConDescuento =
                                  Number(precioVenta) -
                                  (Number(precioVenta) * porcentaje) / 100;
                                return (
                                  <>
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "gray",
                                      }}
                                    >
                                      ${precioVenta}
                                    </span>{" "}
                                    <span style={{ color: "green" }}>
                                      ${precioConDescuento.toFixed(2)}
                                    </span>
                                  </>
                                );
                              }

                              return `$${precioVenta}`;
                            })()}
                          </h2>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
              <button
                onClick={() => {
                  if (!carritoActivo) return;

                  const detalleSeleccionado: IDetalle = detalles[detalleIndex];
                  const carritoActualizado: ICarrito = {
                    ...carritoActivo,
                    detallesProductos: [
                      ...carritoActivo.detallesProductos,
                      detalleSeleccionado,
                    ],
                  };

                  updateCarrito(carritoActualizado);
                  setCarritoActivo(carritoActualizado);
                  localStorage.setItem(
                    "carritoActivo",
                    JSON.stringify(carritoActualizado)
                  );
                }}
              >
                Añadir al Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
