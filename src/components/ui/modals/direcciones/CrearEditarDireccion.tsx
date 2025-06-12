import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDireccion } from "../../../../types/IDireccion";
import { IUsuario } from "../../../../types/IUsuario";
import styles from "./crearEditarDireccion.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";
import Swal from "sweetalert2";

interface ICrearEditarDireccion {
  close: () => void; // Función para cerrar el modal o componente
  direccion?: IDireccion; // Si existe, se edita. Si no, se crea una nueva.
  usuario: IUsuario; // Usuario actual, para actualizar sus direcciones
}

export const CrearEditarDireccion: FC<ICrearEditarDireccion> = ({
  close,
  direccion,
  usuario,
}) => {
  const { updateUsuario, setUsuarioActivo } = usuarioStore();

  // Estado inicial del formulario. Si viene una dirección, se usa para edición.
  const initialForm: IDireccion = {
    localidad: direccion ? direccion.localidad : "",
    estado: direccion ? direccion.estado : true,
    pais: direccion ? direccion.pais : "",
    provincia: direccion ? direccion.provincia : "",
    departamento: direccion ? direccion.departamento : "",
    codigoPostal: direccion ? direccion.codigoPostal : "",
    usuarios: direccion ? [...(direccion.usuarios ?? [])] : [], // Se clona el array por precaución
  };

  const [values, setValues] = useState<IDireccion>(initialForm);

  // Manejador de cambios de inputs
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador de envío del formulario
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de campos requeridos
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
        // Si se está editando una dirección existente
        const direccionEditada: IDireccion = {
          id: direccion.id,
          localidad: values.localidad,
          estado: true,
          pais: values.pais,
          provincia: values.provincia,
          departamento: values.departamento,
          codigoPostal: values.codigoPostal,
          usuarios: direccion ? [...(direccion.usuarios ?? [])] : [], // Clon defensivo
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

        // Se reemplaza la dirección editada en la lista del usuario
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
        // Si se está creando una nueva dirección
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

        // Se guarda en localStorage solo al crear (puede omitirse si no hace falta)
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

      // Cierra el modal o formulario al terminar
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
    <div className={styles.formDireccionesContainer}>
      <form onSubmit={onSubmit} className={styles.formDirecciones}>
        <h1>{direccion ? "Editar" : "Crear"} dirección</h1>

        {/* Inputs controlados */}
        <input
          type="text"
          placeholder="Ingrese un país"
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
          placeholder="Ingrese un código postal"
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

        {/* Botones */}
        <div>
          <button
            type="button" // Evita que dispare un submit
            onClick={close}
            className={styles.buttonConcelar}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.buttonSubmit}>
            {direccion ? "Editar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};
