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
  console.log("BASE_URL:", import.meta.env.VITE_BASE_URL);

  try {
    console.log("Credenciales:", values.mail, values.contraseña);

    const loginResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/usuario/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: values.mail,
        password: values.contraseña,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login fallido: ${loginResponse.status}`);
    }

    const usuario: IUsuario = await loginResponse.json();
    console.log("Usuario logueado:", usuario);
    if (usuario.token) {
      localStorage.setItem("token", usuario.token);
    } else {
      throw new Error("Token no recibido");
    }



    const usuarioEncontrado = usuario;

    if (!usuarioEncontrado) throw new Error("Usuario no encontrado");

    setUsuarioActivo(usuarioEncontrado);
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
    navigate("/VistaLanding");

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
