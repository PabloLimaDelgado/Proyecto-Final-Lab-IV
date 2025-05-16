import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import styles from "./iniciarSesion.module.css";
import { usuarioStore } from "../../../store/usuarioStore";
import { IUsuario } from "../../../types/IUsuario";
import { useNavigate } from "react-router-dom";

interface IIniciarSesion {
  handleRegistarse: () => void;
}

export const IniciarSesion: FC<IIniciarSesion> = ({ handleRegistarse }) => {
  const { setArrayUsuario, usuarios, setUsuarioActivo, usuarioActivo } =
    usuarioStore();
  const navigate = useNavigate();

  const initialForm = {
    usuario: "",
    contraseña: "",
  };

  const [values, setValues] = useState(initialForm);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const responseUsuario: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/usuario/get`
        );
        const data: IUsuario[] = await responseUsuario.json();
        setArrayUsuario(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuario();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalForm = {
      usuario: values.usuario,
      contraseña: values.contraseña,
    };

    const usuarioIniciado = usuarios.find(
      (usuario) =>
        usuario.contra === finalForm.contraseña &&
        usuario.nombre === values.usuario
    );
    
    if (!usuarioIniciado) {
    } else {
      if (
        usuarioIniciado.contra === "1234" &&
        usuarioIniciado.nombre.toLowerCase() === "admin"
      ) {
        setUsuarioActivo(usuarioIniciado);
        navigate("/VistaAdmin");
      } else {
        setUsuarioActivo(usuarioIniciado);

        navigate("/VistaLanding");
      }
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
            placeholder="Nombre de usuario"
            onChange={handleChange}
            value={values.usuario}
            name="usuario"
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
