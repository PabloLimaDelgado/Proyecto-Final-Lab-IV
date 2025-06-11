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
  /*STORES*/
  const { setDireccionActiva, direccionActiva } = direccionStore();
  const { usuarioActivo, setUsuarioActivo, updateUsuario } = usuarioStore();

  const [modificarDireccion, setModificarDireccion] = useState<boolean>(false);

  /*ACTUALIZAR EL USUARIO ACTIVO CUANDO EN EL STORE CAMBIA LA PROP USUARIO*/
  useEffect(() => {
    setUsuarioActivo(usuario);
  }, [usuario, setUsuarioActivo]);

  const ITEMS_POR_PAGINA = 6;
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [paginasTotales, setPaginasTotales] = useState<number>(1);

  /*ACTUALIZA TOTAL DE PÁGINAS CUANDO CAMBIA LA LISTA DE DIRECCIONES O LA PAGINA ACTUAL*/
  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(direcciones.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [direcciones, paginaActual]);

  const handleAvanzarPagina = () => {
    setPaginaActual((prev) => (prev < paginasTotales ? prev + 1 : prev));
  };

  const handleRetrocederPagina = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const direccionesFiltradas = direcciones.filter(
    (direccion) => direccion.estado !== false
  );

  const direccionesPaginadas = direccionesFiltradas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  /*HANDLE*/
  const handleCrearEditarDireccion = () => {
    setModificarDireccion(!modificarDireccion);
  };

  const handleDeleteDireccion = async (idDireccion?: number) => {
    try {
      const token = localStorage.getItem("token");

      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/direccion/${idDireccion}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok && idDireccion && usuario.direcciones) {
        const usuarioNuevo: IUsuario = {
          ...usuario,
          direcciones: usuario.direcciones.filter(
            (direccion) => direccion.id !== idDireccion
          ),
        };

        updateUsuario(usuarioNuevo);
        setUsuarioActivo(usuarioNuevo);
      } else {
        console.error("Falló el DELETE:", response.status);
      }
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
    }
  };

  return (
    <>
      <div className={styles.divDireccionesContainer}>
        <div>
          <h1>Direcciones</h1>

          <button
            className={`material-symbols-outlined ${styles.buttonCancelar}`}
            onClick={close}
            aria-label="Cerrar"
          >
            close
          </button>

          <div className={styles.divDireccionesMapContainer}>
            {direccionesPaginadas.map((direccion) => (
              <div key={direccion.id} className={styles.direccionItem}>
                <h2>Código postal: {direccion.codigoPostal}</h2>
                <h2>Localidad: {direccion.localidad}</h2>
                <h2>Departamento: {direccion.departamento}</h2>
                <h2>Provincia: {direccion.provincia}</h2>
                <h2>País: {direccion.pais}</h2>

                <div className={styles.direccionesButtonMapContainer}>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      handleCrearEditarDireccion();
                      setDireccionActiva(direccion);
                    }}
                    aria-label={`Editar dirección ${direccion.id}`}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDireccion(direccion.id)}
                    aria-label={`Eliminar dirección ${direccion.id}`}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divPaginadoBotones}>
            <button
              onClick={handleRetrocederPagina}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
            >
              <span className="material-symbols-outlined">
                keyboard_double_arrow_left
              </span>
            </button>

            <p>
              Página {paginaActual} de {paginasTotales}
            </p>

            <button
              onClick={handleAvanzarPagina}
              disabled={paginaActual === paginasTotales}
              aria-label="Página siguiente"
            >
              <span className="material-symbols-outlined">
                keyboard_double_arrow_right
              </span>
            </button>
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
