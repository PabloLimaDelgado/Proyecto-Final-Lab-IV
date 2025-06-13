import { ChangeEvent, FC, FormEvent, useState } from "react";
import Swal from "sweetalert2";
import styles from "../descuentos/EditarCrearDescuento.module.css";
import { IRol } from "../../../../types/enums/IRol";
import { usuarioStore } from "../../../../store/usuarioStore";

interface IUserForm {
  id: number;
  nombre: string;
  dni: string;
  mail: string;
  password: string;
  rol: IRol;
  estado: boolean;
}

interface ICrearAdminProps {
  close: () => void;
}

export const CrearAdmin: FC<ICrearAdminProps> = ({ close }) => {
  const { postusuario } = usuarioStore();
  const [values, setValues] = useState<IUserForm>({
    id: 0,
    nombre: "",
    dni: "",
    mail: "",
    password: "",
    rol: IRol.ADMIN,
    estado: true,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.nombre || !values.dni || !values.mail || !values.password) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/registrarUsuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...values,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al registrar admin");

      const usuario = await response.json();

      postusuario(usuario);
      Swal.fire({
        icon: "success",
        title: "Administrador creado",
        text: "El nuevo administrador fue registrado correctamente.",
      });

      close();
    } catch (error) {
      console.error("Error al crear admin:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el administrador. Intente nuevamente.",
      });
    }
  };

  return (
    <div className={styles.formDescuentoContainer}>
      <form
        className={styles.formDescuentoContainerForm}
        onSubmit={handleSubmit}
      >
        <h1>Crear Admin</h1>

        <input
          type="text"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="dni"
          value={values.dni}
          onChange={handleChange}
          placeholder="DNI"
        />
        <input
          type="email"
          name="mail"
          value={values.mail}
          onChange={handleChange}
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Contraseña"
        />

        <div>
          <button
            type="button"
            className={styles.buttonConcelar}
            onClick={close}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.buttonSubmit}>
            Crear
          </button>
        </div>
      </form>
    </div>
  );
};
