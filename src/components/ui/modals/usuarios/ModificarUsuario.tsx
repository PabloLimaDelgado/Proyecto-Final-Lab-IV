import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IUsuario } from "../../../../types/IUsuario";
import { usuarioStore } from "../../../../store/usuarioStore";
import styles from "./modificarUsuario.module.css";
import Swal from "sweetalert2";

interface IModificarUsuario {
  close: () => void; // Función para cerrar el modal/componente
  usuario: IUsuario; // Usuario a modificar
  campoModificar: string; // Campo que se va a editar (nombre, password, mail)
}

export const ModificarUsuario: FC<IModificarUsuario> = ({
  close,
  usuario,
  campoModificar,
}) => {
  const { updateUsuario, setUsuarioActivo } = usuarioStore();

  // Estado local para manejar los valores del usuario
  // Se inicializa con el usuario que llega como prop
  const [values, setValues] = useState<IUsuario>(usuario);

  // Maneja cambios en el input, actualizando solo el campo modificado
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Actualiza solo la propiedad correspondiente en el estado values
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Función para enviar el formulario y actualizar el usuario
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación simple: todos los campos requeridos deben estar completos y sin solo espacios
    if (
      !values.nombre.trim() ||
      !values.mail.trim() ||
      !values.dni.trim() ||
      !values.password.trim() ||
      !values.rol
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Por favor complete todos los campos obligatorios.",
      });
      return;
    }

    // Prepara el objeto para enviar al backend con los datos editados
    const usuarioEditado: IUsuario = {
      nombre: values.nombre,
      password: values.password,
      dni: values.dni,
      mail: values.mail,
      estado: values.estado,
      rol: values.rol,
      direcciones: values.direcciones,
    };

    try {
      const token = localStorage.getItem("token");

      // Llama a la API para actualizar el usuario en backend
      const responseUsuario: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/update/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(usuarioEditado),
        }
      );

      // Si la respuesta no es exitosa, lanza error para ser atrapado abajo
      if (!responseUsuario.ok) {
        const errorText = await responseUsuario.text();
        throw new Error(errorText);
      }

      // Parsear respuesta JSON con usuario actualizado
      const data: IUsuario = await responseUsuario.json();

      // Actualiza el store global con el usuario modificado
      updateUsuario(data);
      setUsuarioActivo(data);

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los datos del usuario fueron actualizados correctamente.",
      });

      // Cierra el modal/componente
      close();
    } catch (error) {
      console.error("Error en editar usuario", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario. Intente nuevamente.",
      });
    }
  };

  return (
    <div className={styles.formModificarUsuarioContainer}>
      <form onSubmit={onSubmit} className={styles.formModificarUsuario}>
        {/* Botón para cerrar el modal */}
        <button
          type="button" // Cambio para evitar submit accidental
          className={`material-symbols-outlined ${styles.buttonCancelar}`}
          onClick={() => {
            close();
          }}
        >
          close
        </button>

        {/* Título dinámico según campo que se edita */}
        <h1>
          Editar {campoModificar === "password" ? "password" : campoModificar}
        </h1>

        {/* Input para el campo que se quiere modificar */}
        <input
          type={campoModificar === "password" ? "password" : "text"} // si es password, input tipo password
          placeholder=""
          onChange={handleChange}
          name={campoModificar}
          value={
            campoModificar === "nombre"
              ? values.nombre
              : campoModificar === "password"
              ? values.password
              : values.mail
          }
          autoComplete="off"
        />

        {/* Botón para enviar el formulario */}
        <button type="submit" className={styles.buttonSubmit}>
          Editar
        </button>
      </form>
    </div>
  );
};
