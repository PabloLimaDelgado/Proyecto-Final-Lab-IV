import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from "./registrarse.module.css";
import { IUsuario } from "../../../types/IUsuario";
import { usuarioStore } from "../../../store/usuarioStore";
import { useNavigate } from "react-router-dom";
import { IRol } from "../../../types/enums/IRol";
import Swal from "sweetalert2";

interface IRegistrarse {
  handleIniciarSesion: () => void;
}

export const Registrarse: FC<IRegistrarse> = ({ handleIniciarSesion }) => {
  const navigate = useNavigate();
  const { postusuario, setUsuarioActivo } = usuarioStore();

  const initialForm: IUsuario = {
    nombre: "",
    password: "",
    dni: "",
    estado: true,
    rol: IRol.USER,
    mail: "",
    direcciones: [],
  };

  const [values, setValues] = useState<IUsuario>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dniRegex = /^\d+$/;

    if (
      !values.nombre.trim() ||
      !values.mail.trim() ||
      !values.dni.trim() ||
      !values.password.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Por favor complete todos los campos obligatorios.",
      });
      return;
    }

    if (!emailRegex.test(values.mail)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor ingrese un email válido.",
      });
      return;
    }

    if (!dniRegex.test(values.dni)) {
      Swal.fire({
        icon: "error",
        title: "DNI inválido",
        text: "El DNI debe contener solo números.",
      });
      return;
    }

    const usuarioCreado: IUsuario = {
      nombre: values.nombre,
      password: values.password,
      dni: values.dni,
      mail: values.mail,
      estado: initialForm.estado,
      rol: initialForm.rol,
      direcciones: [],
    };

    try {
      const responseUsuario: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/registrarUsuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioCreado),
        }
      );

      if (!responseUsuario.ok) {
        const errorText = await responseUsuario.text();
        throw new Error(errorText);
      }

      const data: IUsuario = await responseUsuario.json();

      if ((data as any).token) {
        localStorage.setItem("token", (data as any).token);
      }

      postusuario(data);
      setUsuarioActivo(data);
      localStorage.setItem("usuarioActivo", JSON.stringify(data));

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "Se registró el usuario correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/vistaLanding");
    } catch (error) {
      console.error("Error en crear usuario", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear el usuario",
        text: "Verifique los datos ingresados o intente más tarde.",
      });
    }
  };

  return (
    <main className={styles.registrarseContainer}>
      <h1>Iniciar Sesion</h1>
      <span className="material-symbols-outlined">account_circle</span>
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre">Nombre y apellido</label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre y apellido"
          value={values.nombre}
          onChange={handleChange}
          name="nombre"
        />

        <label htmlFor="dni">DNI</label>
        <input
          id="dni"
          type="text"
          placeholder="DNI"
          value={values.dni}
          onChange={handleChange}
          name="dni"
          maxLength={8}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          value={values.password}
          onChange={handleChange}
          name="password"
        />

        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="text"
          placeholder="Mail"
          value={values.mail}
          onChange={handleChange}
          name="mail"
        />

        <div>
          <button type="submit">Crear Usuario</button>
          <button type="button" onClick={handleIniciarSesion}>
            Iniciar Sesion
          </button>
        </div>
      </form>
    </main>
  );
};
