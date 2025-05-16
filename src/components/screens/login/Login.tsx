import { useState } from "react";
import { IniciarSesion } from "../../ui/iniciarSesion/IniciarSesion";
import zapatoLogo from "../../../images/logoblanco.png";
import styles from "./login.module.css";
import { Registrarse } from "../../ui/registrarse/Registrarse";

export const Login = () => {
  const [iniciarUsuario, setIniciarUsuario] = useState<boolean>(false);

  const handleRegistarseIniciarSesion = () => {
    setIniciarUsuario(!iniciarUsuario);
  };

  return (
    <>
      <header className={styles.header}>
        <img src={zapatoLogo} alt="" />
        <h1>SNEAKSHOP</h1>
      </header>
      {iniciarUsuario == false ? (
        <div>
          <IniciarSesion handleRegistarse={handleRegistarseIniciarSesion} />
        </div>
      ) : (
        <Registrarse handleIniciarSesion={handleRegistarseIniciarSesion} />
      )}
    </>
  );
};
