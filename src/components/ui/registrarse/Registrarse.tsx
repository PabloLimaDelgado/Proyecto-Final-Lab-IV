import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from "./registrarse.module.css";
import { IUsuario } from "../../../types/IUsuario";
import { ITipoUsuario } from "../../../types/enums/ITipoUsuario";
import { usuarioStore } from "../../../store/usuarioStore";
import { useNavigate } from "react-router-dom";

interface IRegistrarse {
  handleIniciarSesion: () => void;
}

export const Registrarse: FC<IRegistrarse> = ({ handleIniciarSesion }) => {
  const navigate = useNavigate();
  const { postusuario, setUsuarioActivo } = usuarioStore();

  const initialForm: IUsuario = {
    nombre: "",
    contra: "",
    dni: "",
    estado: true,
    rol: ITipoUsuario.Usuario,
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

    const usuarioCreado: IUsuario = {
      nombre: values.nombre,
      contra: values.contra,
      dni: values.dni,
      mail: values.mail,
      estado: initialForm.estado,
      rol: initialForm.rol,
      direcciones: [],
    };

    try {
      const responseUsuario: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioCreado),
        }
      );

      const data: IUsuario = await responseUsuario.json();

      postusuario(data);
      setUsuarioActivo(data);
    } catch (error) {
      console.error("Error en crear usuario", error);
    }

    navigate("/vistaLanding");
  };

  return (
    <main className={styles.registrarseContainer}>
      <h1>Iniciar Sesion</h1>
      <span className="material-symbols-outlined">account_circle</span>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Nombre y apellido"
          value={values.nombre}
          onChange={handleChange}
          name="nombre"
        />
        <input
          type="text"
          placeholder="DNI"
          value={values.dni}
          onChange={handleChange}
          name="dni"
        />
        <input
          type="text"
          placeholder="Contraseña"
          value={values.contra}
          onChange={handleChange}
          name="contra"
        />
        <input
          type="text"
          placeholder="Mail"
          value={values.mail}
          onChange={handleChange}
          name="mail"
        />
        <div>
          <button type="submit">Crear Usuario</button>
          <button onClick={handleIniciarSesion}>Iniciar Sesion</button>
        </div>
      </form>
    </main>
  );
};
