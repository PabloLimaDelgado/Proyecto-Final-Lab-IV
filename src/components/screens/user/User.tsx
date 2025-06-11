import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import zapatoLogoBlanco from "../../../images/logoblanco.png";
import { usuarioStore } from "../../../store/usuarioStore";
import styles from "./user.module.css";
import { ModificarUsuario } from "../../ui/modals/usuarios/ModificarUsuario";
import { CrearEditarDireccion } from "../../ui/modals/direcciones/CrearEditarDireccion";
import { DireccionesUsuario } from "../../ui/direccionesUsuario/DireccionesUsuario";

export const User = () => {
  /*ESTADOS PARA MANEJAR MODALES Y QUÉ CAMPO MODIFICAR*/
  const [editarUsuario, setEditarUsuario] = useState<boolean>(false);
  const [añadirDireccion, setAñadirDireccion] = useState<boolean>(false);
  const [verDirecciones, setVerDirecciones] = useState<boolean>(false);
  const [campoAModificar, setCampoAModificar] = useState<string>("");

  /*ESTADO GLOBAL DE USUARIO ACTIVO Y FUNCIÓN PARA ACTUALIZARLO*/
  const { usuarioActivo, setUsuarioActivo } = usuarioStore();

  const navigate = useNavigate();

  /* FUNCIONES DE NAVEGACIÓN Y MODALES */
  const handleNavigate = () => {
    navigate(-1);
  };

  const handleEditarUsuario = () => {
    setEditarUsuario(!editarUsuario);
  };

  const handleCrearEditarDireccion = () => {
    setAñadirDireccion(!añadirDireccion);
  };

  const handeVerDirecciones = () => {
    setVerDirecciones(!verDirecciones);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuarioActivo(null);
    navigate("/");
  };

  /* GUARDA EL USUARIO ACTIVO EN LOCALSTORAGE AL CAMBIAR */
  useEffect(() => {
    if (usuarioActivo) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
    }
  }, [usuarioActivo]);

  return (
    <>
      <header className={styles.header}>
        <img src={zapatoLogoBlanco} alt="Logo SneakShop" />
        <h1>SNEAKSHOP - User</h1>
      </header>

      <div className={styles.divContainer}>
        <button className={styles.goBack} onClick={handleNavigate}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className={styles.divUserInfo}>
          <div className={styles.divAtributoEdit}>
            <h2>Nombre</h2>
            <div>
              <h3>{usuarioActivo?.nombre}</h3>
              <button
                onClick={() => {
                  setCampoAModificar("nombre");
                  handleEditarUsuario();
                }}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          </div>

          <div className={styles.divContraseña}>
            <h2>Contraseña</h2>
          </div>

          <div className={styles.divDNI}>
            <h2>DNI</h2>
            <h3>{usuarioActivo?.dni}</h3>
          </div>

          <div className={styles.divAtributoEdit}>
            <h2>Mail</h2>
            <div>
              <h3>{usuarioActivo?.mail}</h3>
              <button
                onClick={() => {
                  setCampoAModificar("mail");
                  handleEditarUsuario();
                }}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          </div>

          <div className={styles.divDirecciones}>
            <h2>Direcciones</h2>
            <div>
              <button onClick={handleCrearEditarDireccion}>
                Añadir direccion{" "}
                <span className={`material-symbols-outlined ${styles.spanAdd}`}>
                  add
                </span>
              </button>
              <button onClick={handeVerDirecciones}>
                Ver direcciones{" "}
                <span className={`material-symbols-outlined ${styles.spanVer}`}>
                  visibility
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.divButtons}>
          <button onClick={handleCerrarSesion}>Cerrar Sesion</button>
          <button>Eliminar Cuenta</button>
        </div>
      </div>

      {editarUsuario && usuarioActivo && (
        <ModificarUsuario
          close={handleEditarUsuario}
          usuario={usuarioActivo}
          campoModificar={campoAModificar}
        />
      )}

      {añadirDireccion && usuarioActivo && (
        <CrearEditarDireccion
          close={handleCrearEditarDireccion}
          usuario={usuarioActivo}
        />
      )}

      {verDirecciones && usuarioActivo?.direcciones && (
        <DireccionesUsuario
          direcciones={usuarioActivo.direcciones}
          close={handeVerDirecciones}
          usuario={usuarioActivo}
        />
      )}
    </>
  );
};
