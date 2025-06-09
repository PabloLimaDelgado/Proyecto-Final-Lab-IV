import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from "./iniciarSesion.module.css";
import { usuarioStore } from "../../../store/usuarioStore";
import { IUsuario } from "../../../types/IUsuario";
import { data, useNavigate } from "react-router-dom";

interface IIniciarSesion {
  handleRegistarse: () => void;
}

export const IniciarSesion: FC<IIniciarSesion> = ({ handleRegistarse }) => {
  const { setUsuarioActivo } = usuarioStore();
  const navigate = useNavigate();

  const initialForm = {
    mail: "",
    contraseña: "",
  };

  const [values, setValues] = useState(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mail: values.mail,
            password: values.contraseña,
          }),
        }
      );

      if (!response.ok) throw new Error("Login fallido");

      const usuario: IUsuario = await response.json();

      if (usuario.token) {
        localStorage.setItem("token", usuario.token);
      }

      const token = localStorage.getItem("token");

      const getResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/usuario/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Error al traer usuarios: ${getResponse.status}`);
      } else {
        console.log("Entro bien");
      }

      const usuarios: IUsuario[] = await getResponse.json();
      const usuarioEncontrado = usuarios.find((u) => u.mail === usuario.mail);

      if (!usuarioEncontrado) throw new Error("Usuario no encontrado");

      setUsuarioActivo(usuarioEncontrado);
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

      if (
        usuario.mail === "admin@gmail.com" &&
        usuario.nombre.toLowerCase() === "admin"
      ) {
        navigate("/VistaAdmin");
      } else {
        navigate("/VistaLanding");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <>
      <main className={styles.iniciarSesionContainer}>
        <h1>Iniciar Sesion</h1>
        <span className="material-symbols-outlined">account_circle</span>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Correo electrónico"
            onChange={handleChange}
            value={values.mail}
            name="mail"
          />
          <input
            type="text"
            placeholder="Contraseña"
            onChange={handleChange}
            value={values.contraseña}
            name="contraseña"
          />
          <div>
            <button type="submit">Ingresar Usuario</button>
            <button onClick={handleRegistarse}>Registrarse</button>
          </div>
        </form>
      </main>
    </>
  );
};
