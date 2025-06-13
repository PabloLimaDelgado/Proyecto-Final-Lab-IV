import { useEffect, useState } from "react";
import styles from "./admins.module.css";
import { IUsuario } from "../../../types/IUsuario";
import Swal from "sweetalert2";
import { CrearAdmin } from "../modals/CrearAdmin/CrearAdmin";
import { usuarioStore } from "../../../store/usuarioStore";

export const Admins = () => {
  const { setArrayUsuario, setUsuarioActivo, usuarios, deleteUsuario } =
    usuarioStore();
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState(1);
  const [crearAdmin, setCrearAdmin] = useState<boolean>(false);

  const ITEMS_POR_PAGINA = 6;

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/admin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: IUsuario[] = await response.json();
      setArrayUsuario(data.filter((admin) => admin.estado === true));
    } catch (error) {
      console.error("Error al traer admins:", error);
    }
  };

  const handleEliminarAdmin = async (admin: IUsuario) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar a ${admin.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/usuario/${admin.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("No se pudo eliminar");

        deleteUsuario(Number(admin.id));

        Swal.fire(
          "Eliminado",
          "El administrador ha sido eliminado.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar admin:", error);
        Swal.fire("Error", "No se pudo eliminar el administrador.", "error");
      }
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(usuarios.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [usuarios, paginaActual]);

  const handleAvanzarPagina = () => {
    setPaginaActual((prev) => (prev < paginasTotales ? prev + 1 : prev));
  };

  const handleRetrocederPagina = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const adminsPaginados = usuarios.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  console.log(adminsPaginados);

  return (
    <div className={styles.adminsContainer}>
      <h1>SneakAdmin - Administradores</h1>
      <div className={styles.crearUsuarioAdmin}>
        <button
          onClick={() => {
            setCrearAdmin(!crearAdmin);
          }}
        >
          <span>
            <span className="material-symbols-outlined">person_add</span>
          </span>
        </button>
      </div>
      <table className={styles.adminsTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {adminsPaginados.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.mail}</td>
              <td>{admin.rol}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleEliminarAdmin(admin)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.divPaginadoBotones}>
        <button onClick={handleRetrocederPagina} disabled={paginaActual === 1}>
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

      {crearAdmin && (
        <CrearAdmin
          close={function (): void {
            setCrearAdmin(false);
          }}
        ></CrearAdmin>
      )}
    </div>
  );
};
