import { FC } from "react";
import styles from "./iniciarSesion.module.css";

interface IIniciarSesion {
  handleRegistarse: () => void;
}

export const IniciarSesion: FC<IIniciarSesion> = ({ handleRegistarse }) => {
  return (
    <>
      <main className={styles.iniciarSesionContainer}>
        <h1>Iniciar Sesion</h1>
        <span className="material-symbols-outlined">account_circle</span>
        <form>
          <input type="text" placeholder="Mail" />
          <input type="text" placeholder="Contraseña" />
          <div>
            <button type="submit">Ingresar Usuario</button>
            <button onClick={handleRegistarse}>Registrarse</button>
          </div>
        </form>
      </main>
    </>
  );
};
