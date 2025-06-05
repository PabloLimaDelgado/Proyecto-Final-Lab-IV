import { ChangeEvent, useEffect, useState } from "react";
import zapatoLogoBlanco from "../../../images/logoblanco.png";
import { usuarioStore } from "../../../store/usuarioStore";
import { CarritoDireccion } from "../../ui/carritoDireccion/CarritoDireccion";
import styles from "./carrito.module.css";
import { carritoStore } from "../../../store/carritoStore";
import { IPrecio } from "../../../types/IPrecio";
import { precioStore } from "../../../store/precioStore";
import { useOrdenCompra } from "../../../hooks/useOrdenCompra";
import { direccionStore } from "../../../store/domiciliStore";
import { useNavigate } from "react-router-dom";
import { IDetalle } from "../../../types/IDetalle";
import { ICarrito } from "../../../types/ICarrito";
import { IDireccion } from "../../../types/IDireccion";
import { IUsuario } from "../../../types/IUsuario";
import {
  agruparDetalles,
  calcularSubtotal,
  calcularTotalConDescuento,
} from "../../../hooks/agruparDetalles";

export const Carrito = () => {
  const { usuarioActivo, setUsuarioActivo } = usuarioStore();
  const { carritoActivo, updateCarrito, setCarritoActivo } = carritoStore();
  const { setDireccionActiva, direccionActiva, postDireccion } =
    direccionStore();
  const { setArrayPrecio, precios } = precioStore();
  const { añadirOrden } = useOrdenCompra();
  const navigate = useNavigate();

  const [usarDireccionUsuario, setUsarDireccionUsuario] =
    useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsarDireccionUsuario(event.target.checked);
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  const detallesAgrupados = agruparDetalles(carritoActivo?.detallesProductos);

  const subtotal = calcularSubtotal(detallesAgrupados, precios);
  const totalConDescuento = calcularTotalConDescuento(
    detallesAgrupados,
    precios
  );

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

  useEffect(() => {
    const fetchPrecio = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/precio`
        );
        const data: IPrecio[] = await response.json();

        setArrayPrecio(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrecio();
  }, []);

  const initialForm: IDireccion = {
    localidad: "",
    estado: true,
    pais: "",
    provincia: "",
    departamento: "",
    codigoPostal: "",
    usuarios: usuarioActivo ? [usuarioActivo] : [],
  };

  const [direccionFormulario, setDireccionFormulario] =
    useState<IDireccion>(initialForm);

  const handleChangeDireccion = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDireccionFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDireccion = async (): Promise<IDireccion | null> => {
    try {
      const direccionConUsuario = {
        ...direccionFormulario,
        usuarios: usuarioActivo ? [usuarioActivo] : [],
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/direccion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(direccionConUsuario),
        }
      );

      const nuevaDireccion: IDireccion = await response.json();

      if (!response.ok) throw new Error("Error al crear dirección");

      postDireccion(nuevaDireccion);
      setDireccionActiva(nuevaDireccion);

      const usuarioActualizado: IUsuario = {
        ...usuarioActivo!,
        direcciones: [
          ...(usuarioActivo?.direcciones ?? []),
          direccionConUsuario,
        ],
      };

      setUsuarioActivo(usuarioActualizado);
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));

      return direccionConUsuario;
    } catch (error) {
      console.error("Error al crear dirección:", error);
      return null;
    }
  };

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
                            <p className={styles.PPrecio}>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                }}
                              >
                                ${precioVenta}
                              </span>
                              <span style={{ color: "black" }}>
                                ${precioConDescuento.toFixed(2)}
                              </span>
                            </p>
                          </>
                        );
                      }

                      return `$${precioVenta}`;
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
            <div>
              <p>¿Usar Direcciones Usuario? </p>
              <input
                type="checkbox"
                checked={usarDireccionUsuario}
                onChange={handleCheckboxChange}
              />
            </div>

            <div className={styles.divSelectPago}>
              <select
                name=""
                id=""
                defaultValue=""
                className={styles.selectCarrito}
              >
                <option value="" disabled hidden>
                  Medios de pago
                </option>
              </select>
            </div>
          </div>

          <div className={styles.divUsuarioCheck}>
            {!usarDireccionUsuario ? (
              <CarritoDireccion
                values={direccionFormulario}
                onChange={handleChangeDireccion}
              />
            ) : (
              <div className={styles.direccionesUsuarios}>
                {usuarioActivo?.direcciones
                  .filter((direcccion) => direcccion.estado !== false)
                  .map((direccion) => (
                    <label key={direccion.id}>
                      <p>
                        {direccion.departamento} - {direccion.localidad}
                      </p>
                      <input
                        type="checkbox"
                        onClick={() => setDireccionActiva(direccion)}
                      />
                    </label>
                  ))}
              </div>
            )}
          </div>

          <div className={styles.divComprarProductos}>
            <button
              onClick={async () => {
                if (!usarDireccionUsuario) {
                  const nueva = await handleSubmitDireccion();
                  if (usuarioActivo && nueva) {
                    añadirOrden(
                      usuarioActivo,
                      nueva,
                      usarDireccionUsuario,
                      totalConDescuento
                    );
                  }
                } else if (usuarioActivo && direccionActiva) {
                  añadirOrden(
                    usuarioActivo,
                    direccionActiva,
                    usarDireccionUsuario,
                    totalConDescuento
                  );
                }
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
