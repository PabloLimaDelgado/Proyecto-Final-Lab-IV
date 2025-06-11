import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDireccion } from "../../../../types/IDireccion";
import { IUsuario } from "../../../../types/IUsuario";
import styles from "./crearEditarDireccion.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";
import Swal from "sweetalert2";

interface ICrearEditarDireccion {
  close: () => void;
  direccion?: IDireccion;
  usuario: IUsuario;
}
export const CrearEditarDireccion: FC<ICrearEditarDireccion> = ({
  close,
  direccion,
  usuario,
}) => {
  const { updateUsuario, setUsuarioActivo } = usuarioStore();

  const initialForm: IDireccion = {
    localidad: direccion ? direccion.localidad : "",
    estado: direccion ? direccion.estado : true,
    pais: direccion ? direccion.pais : "",
    provincia: direccion ? direccion.provincia : "",
    departamento: direccion ? direccion.departamento : "",
    codigoPostal: direccion ? direccion.codigoPostal : "",
    usuarios: direccion ? direccion.usuarios : [],
  };

  const [values, setValues] = useState<IDireccion>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validaciones básicas
    if (
      !values.localidad ||
      !values.pais ||
      !values.provincia ||
      !values.departamento ||
      !values.codigoPostal
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos de la dirección.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (direccion) {
        // Editar dirección
        const direccionEditada: IDireccion = {
          id: direccion.id,
          localidad: values.localidad,
          estado: true,
          pais: values.pais,
          provincia: values.provincia,
          departamento: values.departamento,
          codigoPostal: values.codigoPostal,
          usuarios: direccion.usuarios,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/direccion/${direccion.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(direccionEditada),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data: IDireccion = await response.json();

        const usuarioActualizado: IUsuario = {
          ...usuario,
          direcciones: usuario.direcciones?.map((d) =>
            d.id === data.id ? data : d
          ),
        };

        updateUsuario(usuarioActualizado);
        setUsuarioActivo(usuarioActualizado);

        Swal.fire({
          icon: "success",
          title: "Dirección actualizada",
          text: "La dirección fue editada correctamente.",
        });
      } else {
        // Crear dirección
        const direccionCreada: IDireccion = {
          localidad: values.localidad,
          estado: true,
          pais: values.pais,
          provincia: values.provincia,
          departamento: values.departamento,
          codigoPostal: values.codigoPostal,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/direccion/post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(direccionCreada),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data: IDireccion = await response.json();

        const usuarioActualizado: IUsuario = {
          ...usuario,
          direcciones:
            usuario.direcciones && usuario.direcciones.length > 0
              ? [...usuario.direcciones, data]
              : [data],
        };

        updateUsuario(usuarioActualizado);
        setUsuarioActivo(usuarioActualizado);
        localStorage.setItem(
          "usuarioActivo",
          JSON.stringify(usuarioActualizado)
        );

        Swal.fire({
          icon: "success",
          title: "Dirección guardada",
          text: "La nueva dirección fue añadida correctamente.",
        });
      }

      close();
    } catch (error) {
      console.error("Error en la operación de dirección", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al guardar la dirección. Inténtelo de nuevo.",
      });
    }
  };

  return (
    <>
      <div className={styles.formDireccionesContainer}>
        <form onSubmit={onSubmit} className={styles.formDirecciones}>
          <h1>{direccion ? "Editar" : "Crear"} direccion</h1>
          <input
            type="text"
            placeholder="Ingrese un pais"
            onChange={handleChange}
            value={values.pais}
            name="pais"
          />
          <input
            type="text"
            placeholder="Ingrese una provincia"
            onChange={handleChange}
            value={values.provincia}
            name="provincia"
          />
          <input
            type="text"
            placeholder="Ingrese un departamento"
            onChange={handleChange}
            value={values.departamento}
            name="departamento"
          />
          <input
            type="text"
            placeholder="Ingrese un codigo postal"
            onChange={handleChange}
            value={values.codigoPostal}
            name="codigoPostal"
          />
          <input
            type="text"
            placeholder="Ingrese una localidad"
            onChange={handleChange}
            value={values.localidad}
            name="localidad"
          />
          <div>
            <button onClick={() => close()} className={styles.buttonConcelar}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonSubmit}>
              {direccion ? "Editar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
