import { FC, useEffect, useState } from "react";
import { IDireccion } from "../../../types/IDireccion";
import styles from "./direccionesUsuario.module.css";
import { direccionStore } from "../../../store/domiciliStore";
import { CrearEditarDireccion } from "../modals/direcciones/CrearEditarDireccion";
import { IUsuario } from "../../../types/IUsuario";
import { usuarioStore } from "../../../store/usuarioStore";

interface IDireccionesUsuario {
  close: () => void;
  direcciones: IDireccion[];
  usuario: IUsuario;
}

export const DireccionesUsuario: FC<IDireccionesUsuario> = ({
  direcciones,
  close,
  usuario,
}) => {
  const { setDireccionActiva, direccionActiva } = direccionStore();
  const { usuarioActivo, setUsuarioActivo } = usuarioStore();

  const [modificarDireccion, setModificarDireccion] = useState<boolean>(false);

  const handleCrearEditarDireccion = () => {
    setModificarDireccion(!modificarDireccion);
  };

  useEffect(() => {
    setUsuarioActivo(usuario);
  }, [usuario, setUsuarioActivo]);

  return (
    <>
      <div className={styles.divDireccionesContainer}>
        <div>
          <h1>Direcciones</h1>
          <button
            className={`material-symbols-outlined ${styles.buttonCancelar}`}
            onClick={() => close()}
          >
            close
          </button>
          <div className={styles.divDireccionesMapContainer}>
            {direcciones.map((direccion) => (
              <div key={direccion.id}>
                <h2>Codigo postal: {direccion.codigoPostal}</h2>
                <h2>Localidad: {direccion.localidad}</h2>
                <h2>Departamento: {direccion.departamento}</h2>
                <h2>Provincia: {direccion.provincia}</h2>
                <h2>Pais: {direccion.pais}</h2>
                <div className={styles.direccionesButtonMapContainer}>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      handleCrearEditarDireccion(),
                        setDireccionActiva(direccion);
                    }}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className={styles.deleteButton}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modificarDireccion && direccionActiva && usuarioActivo && (
        <CrearEditarDireccion
          close={handleCrearEditarDireccion}
          direccion={direccionActiva}
          usuario={usuarioActivo}
        />
      )}
    </>
  );
};
