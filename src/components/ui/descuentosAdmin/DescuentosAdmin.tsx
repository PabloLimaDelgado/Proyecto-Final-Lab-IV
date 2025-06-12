import { useEffect, useState } from "react";
import { IDescuento } from "../../../types/IDescuento";
import { descuentoStore } from "../../../store/descuentoStore";

import styles from "./descuentosAdmin.module.css";
import { EditarCrearDescuento } from "../modals/descuentos/EditarCrearDescuento";

export const DescuentosAdmin = () => {
  /* ESTADO GLOBAL Y FUNCIONES DEL STORE */
  const {
    setArrayDescuentos,
    descuentos,
    setDescuentoActivo,
    descuentoActivo,
    deleteDescuento,
  } = descuentoStore();

  /* ESTADO LOCAL PARA MODAL DE CREAR/EDITAR */
  const [editarCrearDescuento, setCrearEditarDescuento] =
    useState<boolean>(false);

  /* CONSTANTES DE PAGINACIÓN */
  const ITEMS_POR_PAGINA = 6;

  /* ESTADOS LOCALES PARA PAGINACIÓN */
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [paginasTotales, setPaginasTotales] = useState<number>(1);

  /* EFECTO: CARGAR DESCUENTOS DESDE API AL MONTAR COMPONENTE */
  useEffect(() => {
    const fetchDescuentos = async () => {
      try {
        const responseDescuentos: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/descuento`
        );
        const data: IDescuento[] = await responseDescuentos.json();
        setArrayDescuentos(data);
      } catch (error) {
        console.log("Error al traer descuentos");
      }
    };

    fetchDescuentos();
  }, []);

  /* EFECTO: CALCULAR PÁGINAS TOTALES SEGÚN DESCUENTOS ACTIVOS */
  useEffect(() => {
    const descuentosFiltrados = descuentos.filter(
      (descuento) => descuento.estado === true
    );

    const totalPaginas = Math.max(
      1,
      Math.ceil(descuentosFiltrados.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [descuentos]);

  /* FUNCIONES PARA NAVEGAR ENTRE PÁGINAS */
  const handleAvanzarPagina = () => {
    setPaginaActual((prev) => (prev < paginasTotales ? prev + 1 : prev));
  };

  const handleRetrocederPagina = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  /* FILTRAR DESCUENTOS ACTIVOS Y APLICAR PAGINACIÓN */
  const descuentosFiltrados = descuentos.filter(
    (descuento) => descuento.estado === true
  );

  const descuentosPaginados = descuentosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  /*HANDLES*/
  const handleEditarCrearDescuento = () => {
    setCrearEditarDescuento(!editarCrearDescuento);
  };

  const handleDeleteDescuento = async (idDescuento?: number) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_BASE_URL}/descuento/${idDescuento}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (idDescuento) {
        deleteDescuento(idDescuento);
      }
    } catch (error) {
      console.error("Error al eliminar descuento", error);
    }
  };

  return (
    <>
      <div className={styles.descuentosAdminContainer}>
        <h1>SneakAdmin - Descuentos</h1>

        <div className={styles.descuentosAdminButtons}>
          <button onClick={handleEditarCrearDescuento}>
            Agregar Descuento
          </button>
        </div>

        <div className={styles.divDescuentos}>
          {descuentosPaginados.map((descuento) => (
            <div key={descuento.id} className={styles.divDescuentoContainer}>
              <h1>Descuento id: {descuento.id}</h1>
              <h2>Porcentaje: {descuento.descuento}%</h2>
              <h2>Fecha Inicio: {descuento.fechaInicio}</h2>
              <h2>Fecha Fin: {descuento.fechaFin}</h2>
              <div>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setDescuentoActivo(descuento);
                    handleEditarCrearDescuento();
                  }}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteDescuento(descuento.id)}
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

      {editarCrearDescuento && (
        <EditarCrearDescuento
          close={handleEditarCrearDescuento}
          descuento={descuentoActivo ?? undefined}
        />
      )}
    </>
  );
};
