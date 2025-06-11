import { HeaderShop } from "../../ui/headerShop/HeaderShop";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./detalleProducto.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useEffect, useState } from "react";
import { detalleProductoStore } from "../../../store/detalleProductoStore";
import { carritoStore } from "../../../store/carritoStore";
import { ICarrito } from "../../../types/ICarrito";

export const DetalleProducto = () => {

  /*PARAMS Y USE STATE*/
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idProducto = params.get("idProducto");

  const { detalles, setArrayDetalle } = detalleProductoStore();
  const {
    carritos,
    postCarrito,
    setCarritoActivo,
    carritoActivo,
    updateCarrito,
  } = carritoStore();

  const [detalleIndex, setDetalleIndex] = useState(0);
  const [imagenIndex, setImagenIndex] = useState(0);
  const [talleActivo, setTalleActivo] = useState("");
  const [imagenActiva, setImagenActiva] = useState<{
    detalleId: number;
    imagenIndex: number;
  }>({
    detalleId: 0,
    imagenIndex: 0,
  });

  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  /*FETCH DETALLES Y SETEAR ESTADO*/
  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/get`
        );
        const data: IDetalle[] = await response.json();

        const detallesFiltrados = data.filter(
          (detalle) => detalle.producto.id === Number(idProducto)
        );

        if (detallesFiltrados.length === 0) return;

        setArrayDetalle(detallesFiltrados);
        setTalleActivo(detallesFiltrados[0].talle.talle);

        /*DEFAULT INDEX AL PRIMER DETALLE*/
        setDetalleIndex(0);
      } catch (error) {
        console.error("Error al traer detalles:", error);
      }
    };

    fetchDetalle();

    /*CARGAR CARRITO DESDE LOCALSTORAGE O CREAR UNO NUEVO*/
    const carritoGuardado = localStorage.getItem("carritoActivo");
    if (carritoGuardado) {
      setCarritoActivo(JSON.parse(carritoGuardado));
    } else if (carritos.length === 0) {
      const carritoNuevo: ICarrito = { id: 1, detallesProductos: [] };
      postCarrito(carritoNuevo);
      setCarritoActivo(carritoNuevo);
      localStorage.setItem("carritoActivo", JSON.stringify(carritoNuevo));
    }
  }, [
    idProducto,
    setArrayDetalle,
    carritos.length,
    postCarrito,
    setCarritoActivo,
  ]);

  useEffect(() => {
    /*ACTUALIZAR IMAGEN ACTIVA CUANDO CAMBIA DETALLE SELECCIONADO*/
    if (detalles.length > 0 && detalles[detalleIndex]) {
      setImagenActiva({
        detalleId: detalles[detalleIndex].id ?? 0,
        imagenIndex: detalles[detalleIndex].imagenList[0]?.id ?? 0,
      });
      setImagenIndex(0);
    }
  }, [detalleIndex, detalles]);

  /*OBTENER DETALLES FILTRADOS Y ORDENADOS POR TALLE*/
  const obtenerDetallesFiltradosOrdenados = (): IDetalle[] => {
    if (!detalles.length) return [];

    const tallesMostrados = new Set<string>();
    const ordenTalles = ["XS", "S", "M", "L", "XL", "XXL"];

    let detallesFiltrados = detalles
      .filter((d) => d.producto.id === Number(idProducto) && d.estado === true)
      .filter((d) => {
        if (tallesMostrados.has(d.talle.talle)) return false;
        tallesMostrados.add(d.talle.talle);
        return true;
      });

    const tipoProducto = detallesFiltrados[0]?.producto.tipoProducto;

    if (tipoProducto === "CALZADO") {
      detallesFiltrados = detallesFiltrados.sort(
        (a, b) => parseInt(a.talle.talle) - parseInt(b.talle.talle)
      );
    } else {
      detallesFiltrados = detallesFiltrados.sort(
        (a, b) =>
          ordenTalles.indexOf(a.talle.talle) -
          ordenTalles.indexOf(b.talle.talle)
      );
    }

    return detallesFiltrados;
  };
  
  /*AÑADIR DETALLE SELECCIONADO AL CARRITO*/
  const handleAñadirAlCarrito = () => {
    if (!carritoActivo) return;

    const detalleSeleccionado = detalles[detalleIndex];
    const carritoActualizado: ICarrito = {
      ...carritoActivo,
      detallesProductos: [
        ...carritoActivo.detallesProductos,
        detalleSeleccionado,
      ],
    };

    updateCarrito(carritoActualizado);
    setCarritoActivo(carritoActualizado);
    localStorage.setItem("carritoActivo", JSON.stringify(carritoActualizado));
  };

  const detallesFiltradosOrdenados = obtenerDetallesFiltradosOrdenados();

  return (
    <>
      <HeaderShop />
      <div className={styles.detalleProductoContainer}>
        {detalles.length > 0 && detalles[detalleIndex] && (
          <>
            <div className={styles.imagenDivContainer}>
              <div
                className={styles.imagenDivWitdh}
                style={{
                  backgroundImage: `url(${detalles[detalleIndex].imagenList[imagenIndex]?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <button className={styles.goBack} onClick={handleNavigate}>
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <div>
                  <img
                    src={detalles[detalleIndex].imagenList[imagenIndex]?.url}
                    alt={detalles[detalleIndex].imagenList[imagenIndex]?.alt}
                  />
                </div>

                <div className={styles.imagenesNoSeleccionadas}>
                  {detalles[detalleIndex].imagenList
                    .filter((imagen) => imagen.estado === true)
                    .map((imagen, idx) => (
                      <img
                        key={imagen.id}
                        src={imagen.url}
                        alt={imagen.alt}
                        onClick={() => setImagenIndex(idx)}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className={styles.carritoContainer}>
              <h2>{detalles[detalleIndex].producto.nombre}</h2>

              <ul>
                {detallesFiltradosOrdenados.map((detalle) => (
                  <li
                    key={detalle.id}
                    onClick={() => setTalleActivo(detalle.talle.talle)}
                    className={
                      talleActivo === detalle.talle.talle ? styles.liActivo : ""
                    }
                  >
                    {detalle.talle.talle}
                  </li>
                ))}
              </ul>

              <div className={styles.imagenesContainer}>
                {detalles
                  .filter(
                    (d) => d.talle.talle === talleActivo && d.estado === true
                  )
                  .map((detalle) => (
                    <div
                      key={detalle.id}
                      className={
                        imagenActiva.detalleId === detalle.id &&
                        imagenActiva.imagenIndex === detalle.imagenList[0]?.id
                          ? styles.detalleActivo
                          : ""
                      }
                    >
                      <img
                        src={detalle.imagenList[0]?.url ?? ""}
                        alt={detalle.imagenList[0]?.alt ?? ""}
                        onClick={() => {
                          const nuevoDetalleIndex = detalles.findIndex(
                            (d) => d.id === detalle.id
                          );
                          setDetalleIndex(nuevoDetalleIndex);
                          setImagenActiva({
                            detalleId: detalle.id ?? 0,
                            imagenIndex: detalle.imagenList[0]?.id ?? 0,
                          });
                          setImagenIndex(0);
                        }}
                      />
                      <div>
                        <h2>
                          <p>Color: </p> {detalle.color}
                        </h2>
                        <h2>
                          <p>Categoria:</p> {detalle.producto.categoria.nombre}
                        </h2>
                        <h2>
                          <p>Precio:</p>{" "}
                          {(() => {
                            const precioDTO = detalle.precioDTO;
                            if (!precioDTO || precioDTO.precioVenta == null)
                              return "N/A";

                            const precioVenta = Number(precioDTO.precioVenta);
                            const descuento = precioDTO.descuento;
                            const hoy = new Date();

                            const tieneDescuento =
                              descuento &&
                              descuento.fechaInicio &&
                              descuento.fechaFin &&
                              new Date(descuento.fechaInicio) <= hoy &&
                              hoy <= new Date(descuento.fechaFin);

                            if (tieneDescuento) {
                              const porcentaje = Number(descuento.descuento);
                              const precioConDescuento =
                                precioVenta - (precioVenta * porcentaje) / 100;

                              return (
                                <>
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "gray",
                                    }}
                                  >
                                    ${precioVenta.toFixed(2)}
                                  </span>{" "}
                                  <span style={{ color: "green" }}>
                                    ${precioConDescuento.toFixed(2)}
                                  </span>
                                </>
                              );
                            }

                            return `$${precioVenta.toFixed(2)}`;
                          })()}
                        </h2>
                      </div>
                    </div>
                  ))}
              </div>

              <button onClick={handleAñadirAlCarrito}>Añadir al Carrito</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
