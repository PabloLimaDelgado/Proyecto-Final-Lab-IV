import { FC } from "react";
import styles from "./registrarse.module.css";

interface IRegistrarse {
  handleIniciarSesion: () => void;
}

export const Registrarse: FC<IRegistrarse> = ({ handleIniciarSesion }) => {
  return (
    <main className={styles.registrarseContainer}>
      <h1>Iniciar Sesion</h1>
      <span className="material-symbols-outlined">account_circle</span>
      <form>
        <input type="text" placeholder="Nombre" />
        <input type="text" placeholder="Apellido" />
        <input type="text" placeholder="Direccion" />
        <input type="text" placeholder="Contraseña" />
        <div>
          <button type="submit">Crear Usuario</button>
          <button onClick={handleIniciarSesion}>Iniciar Sesion</button>
        </div>
      </form>
    </main>
  );
};
