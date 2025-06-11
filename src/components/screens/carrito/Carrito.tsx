import { useEffect, useState } from "react";
import zapatoLogoBlanco from "../../../images/logoblanco.png";
import { usuarioStore } from "../../../store/usuarioStore";
import styles from "./carrito.module.css";
import { carritoStore } from "../../../store/carritoStore";
import { useOrdenCompra } from "../../../hooks/useOrdenCompra";
import { direccionStore } from "../../../store/domiciliStore";
import { useNavigate } from "react-router-dom";
import { IDetalle } from "../../../types/IDetalle";
import { ICarrito } from "../../../types/ICarrito";
import { IDireccion } from "../../../types/IDireccion";
import {
  agruparDetalles,
  calcularSubtotal,
  calcularTotalConDescuento,
} from "../../../hooks/agruparDetalles";
import Swal from "sweetalert2";

export const Carrito = () => {
  const { usuarioActivo } = usuarioStore();
  const { carritoActivo, updateCarrito, setCarritoActivo } = carritoStore();
  const { setDireccionActiva, direccionActiva } = direccionStore();
  const { añadirOrden } = useOrdenCompra();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  const [medioPagoSeleccionado, setMedioPagoSeleccionado] =
    useState<string>("");

  const detallesAgrupados = agruparDetalles(carritoActivo?.detallesProductos);

  const subtotal = calcularSubtotal(detallesAgrupados);
  console.log(detallesAgrupados);
  
  const totalConDescuento = calcularTotalConDescuento(detallesAgrupados);

  const handleEliminarProducto = (idDetalle: number) => {
    if (!carritoActivo) return;

    const nuevosDetalles: IDetalle[] = carritoActivo.detallesProductos.filter(
      (detalle) => detalle.id !== idDetalle
    );

    const carritoActualizado: ICarrito = {
      ...carritoActivo,
      detallesProductos: nuevosDetalles,
    };

    updateCarrito(carritoActualizado);
    setCarritoActivo(carritoActualizado);
  };

  const handleNavigateLanding = () => navigate("/VistaLanding");

  useEffect(() => {
    if (carritoActivo) {
      localStorage.setItem("carritoActivo", JSON.stringify(carritoActivo));
    }
  }, [carritoActivo]);

  return (
    <>
      <div className={styles.divCarritoContainer}>
        <header className={styles.header}>
          <img src={zapatoLogoBlanco} alt="" />
          <h1>SNEAKSHOP - Carrito</h1>
        </header>

        <main className={styles.mainContainer}>
          <button className={styles.goBack} onClick={handleNavigate}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div className={styles.scrollContainer}>
            {carritoActivo &&
              detallesAgrupados.map(({ detalle, cantidad }) => (
                <div key={detalle.id} className={styles.productCard}>
                  <img
                    src={detalle.imagenList[0].url}
                    alt={detalle.imagenList[0].alt}
                  />
                  <h2>Nombre: {detalle.producto.nombre}</h2>
                  <h2>Talle: {detalle.talle.talle}</h2>
                  <h2>Color: {detalle.color}</h2>
                  <h2>
                    <p>Precio: </p>
                    {(() => {
                      const precio = detalle.precioDTO.precioVenta;

                      if (!precio) return "N/A";

                      const hoy = new Date();

                      if (
                        detalle.precioDTO.descuento &&
                        detalle.precioDTO.descuento.fechaInicio &&
                        detalle.precioDTO.descuento.fechaFin &&
                        new Date(detalle.precioDTO.descuento.fechaInicio) <=
                          hoy &&
                        hoy <= new Date(detalle.precioDTO.descuento.fechaFin)
                      ) {
                        const porcentaje = Number(
                          detalle.precioDTO.descuento.descuento
                        );
                        const precioConDescuento =
                          Number(detalle.precioDTO.precioVenta) -
                          (Number(detalle.precioDTO.precioVenta) * porcentaje) /
                            100;
                        return (
                          <>
                            <p className={styles.PPrecio}>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                }}
                              >
                                ${detalle.precioDTO.precioVenta}
                              </span>
                              <span style={{ color: "black" }}>
                                ${precioConDescuento.toFixed(2)}
                              </span>
                            </p>
                          </>
                        );
                      }

                      return `$${detalle.precioDTO.precioVenta}`;
                    })()}
                  </h2>
                  <h2>Cantidad: {cantidad}</h2>
                  <button
                    onClick={() => handleEliminarProducto(detalle.id ?? 0.1)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.divEleccionCarrito}>
            <div className={styles.divSelectPago}></div>
          </div>

          <div className={styles.divUsuarioCheck}>
            <div className={styles.direccionesUsuarios}>
              <div>
                <h2>Direciones: </h2>
                {usuarioActivo?.direcciones &&
                  usuarioActivo?.direcciones
                    .filter((direccion) => direccion.estado !== false)
                    .map((direccion) => (
                      <label key={direccion.id}>
                        <p>
                          {direccion.departamento} - {direccion.localidad}
                        </p>
                        <input
                          type="radio"
                          name="direccion" // mismo nombre para agrupar radios
                          checked={direccionActiva?.id === direccion.id} // marcado si es la activa
                          onChange={() => setDireccionActiva(direccion)} // cambiar la dirección activa
                        />
                      </label>
                    ))}
              </div>

              <select
                value={medioPagoSeleccionado}
                onChange={(e) => setMedioPagoSeleccionado(e.target.value)}
                className={styles.selectCarrito}
              >
                <option value="" disabled hidden>
                  Medios de pago
                </option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="mercado_pago">Mercado Pago</option>
              </select>
            </div>
          </div>

          <div className={styles.divComprarProductos}>
            <button
              onClick={async () => {
                let direccionAUsar: IDireccion | null = direccionActiva;

                if (!usuarioActivo || !direccionAUsar) {
                  Swal.fire({
                    title: "Error",
                    text: "Por favor, selecciona una dirección antes de comprar.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                  });
                  return;
                }

                if (!medioPagoSeleccionado) {
                  Swal.fire({
                    title: "Error",
                    text: "Por favor, selecciona un medio de pago antes de comprar.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                  });
                  return;
                }

                await añadirOrden(
                  usuarioActivo,
                  direccionAUsar,
                  true,
                  Number(totalConDescuento.toFixed(2))
                );

                const diasEntrega = Math.floor(Math.random() * 5) + 2;

                Swal.fire({
                  title: "¡Compra realizada!",
                  text: `Tu producto será entregado en aproximadamente ${diasEntrega} días.`,
                  confirmButtonText: "Aceptar",
                  customClass: {
                    popup: "swal-custom-popup",
                    icon: "swal-custom-icon",
                    title: "swal-custom-title",
                    confirmButton: "swal-custom-button",
                  },
                });

                const carritoVacio: ICarrito = {
                  ...carritoActivo!,
                  detallesProductos: [],
                };

                updateCarrito(carritoVacio);
                setCarritoActivo(carritoVacio);
                localStorage.setItem(
                  "carritoActivo",
                  JSON.stringify(carritoVacio)
                );

                handleNavigateLanding();
              }}
            >
              Comprar
            </button>

            <h3>Subtotal: ${subtotal}</h3>
            <h2>Total: ${totalConDescuento.toFixed(2)}</h2>
          </div>
        </footer>
      </div>
    </>
  );
};
