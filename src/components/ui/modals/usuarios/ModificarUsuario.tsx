import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IUsuario } from "../../../../types/IUsuario";
import { usuarioStore } from "../../../../store/usuarioStore";
import styles from "./modificarUsuario.module.css";

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        `${import.meta.env.VITE_BASE_URL}/usuario/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(usuarioEditado),
        }
      );

      const data: IUsuario = await responseUsuario.json();

      console.log(data);

      updateUsuario(data);
      setUsuarioActivo(data);
    } catch (error) {
      console.error("Error en editar usuario", error);
    }

    close();
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
