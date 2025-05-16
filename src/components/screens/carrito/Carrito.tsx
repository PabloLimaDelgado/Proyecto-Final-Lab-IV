import { useState } from "react";
import zapatoLogoBlanco from "../../../images/logoblanco.png";
import { usuarioStore } from "../../../store/usuarioStore";
import { CarritoDireccion } from "../../ui/carritoDireccion/CarritoDireccion";
import styles from "./carrito.module.css";

export const Carrito = () => {
  const { usuarioActivo } = usuarioStore();

  const [usarDireccionUsuario, setUsarDireccionUsuario] =
    useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsarDireccionUsuario(event.target.checked);
  };

  return (
    <>
      <div className={styles.divCarritoContainer}>
        <header className={styles.header}>
          <img src={zapatoLogoBlanco} alt="" />
          <h1>SNEAKSHOP - Carrito</h1>
        </header>

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
              <CarritoDireccion />
            ) : (
              <div className={styles.direccionesUsuarios}>
                {usuarioActivo?.direcciones.map((direccion) => (
                  <label key={direccion.id}>
                    <p>
                      {direccion.departamento} - {direccion.localidad}
                    </p>
                    <input type="checkbox" />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.divComprarProductos}>
            <button>Comprar</button>
            <h3>Descuento: 10%</h3>
            <h2>Precio: 1000$</h2>
          </div>
        </footer>
      </div>
    </>
  );
};
