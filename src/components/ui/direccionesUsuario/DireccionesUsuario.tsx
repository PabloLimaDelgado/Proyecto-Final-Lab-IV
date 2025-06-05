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
  const { usuarioActivo, setUsuarioActivo, updateUsuario } = usuarioStore();

  const [modificarDireccion, setModificarDireccion] = useState<boolean>(false);

  const handleCrearEditarDireccion = () => {
    setModificarDireccion(!modificarDireccion);
  };

  useEffect(() => {
    setUsuarioActivo(usuario);
  }, [usuario, setUsuarioActivo]);

  const ITEMS_POR_PAGINA = 6;

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [paginasTotales, setPaginasTotales] = useState<number>(1);

  useEffect(() => {
    const direccionesFiltrados = direcciones.filter(
      (direccion) => direccion.estado !== false
    );

    const totalPaginas = Math.max(
      1,
      Math.ceil(direccionesFiltrados.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [direcciones]);

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

  const handleDeleteDireccion = async (idDireccion?: number) => {
    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/direccion/${idDireccion}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (idDireccion) {
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
            onClick={() => close()}
          >
            close
          </button>
          <div className={styles.divDireccionesMapContainer}>
            {direccionesPaginadas
              .filter((direccion) => direccion.estado !== false)
              .map((direccion) => (
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
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteDireccion(direccion.id)}
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
