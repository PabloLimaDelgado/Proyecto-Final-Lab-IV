import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import zapatoLogoBlanco from "../../../images/logoblanco.png";

import { usuarioStore } from "../../../store/usuarioStore";
import { carritoStore } from "../../../store/carritoStore";
import { direccionStore } from "../../../store/domiciliStore";
import { useOrdenCompra } from "../../../hooks/useOrdenCompra";

import {
  agruparDetalles,
  calcularSubtotal,
  calcularTotalConDescuento,
} from "../../../hooks/agruparDetalles";

import { IDetalle } from "../../../types/IDetalle";
import { ICarrito } from "../../../types/ICarrito";
import styles from "./carrito.module.css";
import { CarritoDireccion } from "../../ui/carritoDireccion/CarritoDireccion";
import { IDireccion } from "../../../types/IDireccion";
import withReactContent from "sweetalert2-react-content";

export const Carrito = () => {
  /*STORES Y HOOKS*/
  const MySwal = withReactContent(Swal);
  const { usuarioActivo } = usuarioStore();
  const { carritoActivo, updateCarrito, setCarritoActivo } = carritoStore();
  const { direccionActiva, setDireccionActiva } = direccionStore();
  const { añadirOrden, escucharWebSocket } = useOrdenCompra();
  const [usarDireccionNueva, setUsarDireccionNueva] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState<IDireccion>({
    localidad: "",
    pais: "",
    estado: true,
    provincia: "",
    departamento: "",
    codigoPostal: "",
  });
  const handleDireccionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaDireccion((prev) => ({ ...prev, [name]: value }));
  };

  /*USE STATE*/
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] =
    useState<string>("");

  /*HOOKS*/
  const detallesAgrupados = agruparDetalles(carritoActivo?.detallesProductos);
  const subtotal = calcularSubtotal(detallesAgrupados);
  const totalConDescuento = calcularTotalConDescuento(detallesAgrupados);

  /*NAVIGATE*/
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate(-1);
  const handleNavigateLanding = () => navigate("/VistaLanding");

  /*ELIMINAR PRODUCTO DEL CARRITO*/
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

  /*GUARDAR CAMBIOS EN EL LOCAL STORAGGE*/
  useEffect(() => {
    if (carritoActivo) {
      localStorage.setItem("carritoActivo", JSON.stringify(carritoActivo));
    }
  }, [carritoActivo]);

  /*FUNCION PARA MANEJAR LA COMPRA*/

const handleComprar = async () => {
  const direccionValida =
    nuevaDireccion &&
    nuevaDireccion.pais !== "" &&
    nuevaDireccion.provincia !== "" &&
    nuevaDireccion.departamento !== "" &&
    nuevaDireccion.codigoPostal !== "" &&
    nuevaDireccion.localidad !== "";
  let resultado;

  if (usarDireccionNueva && direccionValida) {
    resultado = await añadirOrden(nuevaDireccion, false);
  } else if (direccionActiva && !usarDireccionNueva) {
    resultado = await añadirOrden(direccionActiva, true);
  } else {
    Swal.fire({
      title: "Error",
      text: "Por favor ingresa todos los campos de la dirección.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return;
  }
  console.log(resultado)
  if (resultado?.initPoint) {
  window.open(resultado.initPoint, "_blank");
  }

  MySwal.fire({
    title: "Procesando pago...",
    text: "Esperando confirmación de Mercado Pago.",
    allowOutsideClick: false,
    didOpen: () => {
      MySwal.showLoading();
    },
  });

  const cerrarSocket = escucharWebSocket(async () => {
    const diasEntrega = Math.floor(Math.random() * 5) + 2;

    await Swal.fire({
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
    localStorage.setItem("carritoActivo", JSON.stringify(carritoVacio));

    handleNavigateLanding();
    cerrarSocket();
  });
};

  return (
    <div className={styles.divCarritoContainer}>
      <header className={styles.header}>
        <img src={zapatoLogoBlanco} alt="Logo Sneakshop" />
        <h1>SNEAKSHOP - Carrito</h1>
      </header>

      <main className={styles.mainContainer}>
        <button className={styles.goBack} onClick={handleNavigateBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className={styles.scrollContainer}>
          {carritoActivo &&
            detallesAgrupados.map(({ detalle, cantidad }) => (
              <div key={detalle.id} className={styles.productCard}>
                {detalle.imagenList && detalle.imagenList.length > 0 ? (
                  <img
                    src={detalle.imagenList[0].url}
                    alt={detalle.imagenList[0].alt || "Imagen del producto"}
                  ></img>
                ) : null}
                <h2>Nombre: {detalle.producto.nombre}</h2>
                <h2>Talle: {detalle.talle.talle}</h2>
                <h2>Color: {detalle.color}</h2>
                <h2>
                  Precio:{" "}
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
                        <p className={styles.PPrecio}>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                          >
                            ${detalle.precioDTO.precioVenta}
                          </span>{" "}
                          <span style={{ color: "black" }}>
                            ${precioConDescuento.toFixed(2)}
                          </span>
                        </p>
                      );
                    }

                    return `$${detalle.precioDTO.precioVenta}`;
                  })()}
                </h2>
                <h2>Cantidad: {cantidad}</h2>
                <button
                  onClick={() => handleEliminarProducto(detalle.id ?? 0.1)}
                  aria-label="Eliminar producto"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.divEleccionCarrito}>
          <label>
            <input
              type="checkbox"
              checked={usarDireccionNueva}
              onChange={() => setUsarDireccionNueva((prev) => !prev)}
            />
            Usar una nueva dirección
          </label>
        </div>

        <div className={styles.divUsuarioCheck}>
          <div className={styles.direccionesUsuarios}>
            <div className={styles.divDireccion}>
              {usarDireccionNueva ? (
                <CarritoDireccion
                  values={nuevaDireccion}
                  onChange={handleDireccionChange}
                />
              ) : (
                <>
                  <h2>Direcciones: </h2>
                  {usuarioActivo?.direcciones
                    ?.filter((direccion) => direccion.estado !== false)
                    .map((direccion) => (
                      <label key={direccion.id}>
                        <p>
                          {direccion.departamento} - {direccion.localidad}
                        </p>
                        <input
                          type="radio"
                          name="direccion"
                          checked={direccionActiva?.id === direccion.id}
                          onChange={() => setDireccionActiva(direccion)}
                        />
                      </label>
                    ))}
                </>
              )}
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
          <button onClick={handleComprar}>Comprar</button>
          <h3>Subtotal: ${subtotal}</h3>
          <h2>Total: ${totalConDescuento.toFixed(2)}</h2>
        </div>
      </footer>
    </div>
  );
};
