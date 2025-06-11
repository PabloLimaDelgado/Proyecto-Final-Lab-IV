import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IUsuario } from "../../../../types/IUsuario";
import { usuarioStore } from "../../../../store/usuarioStore";
import styles from "./modificarUsuario.module.css";
import Swal from "sweetalert2";

interface IModificarUsuario {
  close: () => void;
  usuario: IUsuario;
  campoModificar: string;
}

export const ModificarUsuario: FC<IModificarUsuario> = ({
  close,
  usuario,
  campoModificar,
}) => {
  const { updateUsuario, setUsuarioActivo } = usuarioStore();
  const [values, setValues] = useState<IUsuario>(usuario);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  console.log(usuario);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de campos requeridos
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

      if (!responseUsuario.ok) {
        const errorText = await responseUsuario.text();
        throw new Error(errorText);
      }

      const data: IUsuario = await responseUsuario.json();

      updateUsuario(data);
      setUsuarioActivo(data);

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los datos del usuario fueron actualizados correctamente.",
      });

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
    <>
      <div className={styles.formModificarUsuarioContainer}>
        <form onSubmit={onSubmit} className={styles.formModificarUsuario}>
          <button
            className={`material-symbols-outlined ${styles.buttonCancelar}`}
            onClick={() => {
              close();
            }}
          >
            close
          </button>
          <h1>
            Editar {campoModificar === "password" ? "password" : campoModificar}
          </h1>
          <input
            type="text"
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
          />
          <button type="submit" className={styles.buttonSubmit}>
            Editar
          </button>
        </form>
      </div>
    </>
  );
};
