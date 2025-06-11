import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IRol } from "../../../../types/enums/IRol";
import { IUsuario } from "../../../../types/IUsuario";
import styles from "./crearUsuarioAdmin.module.css";

interface ICrearUsuarioAdmin {
  close: () => void;
}

export const CrearUsuarioAdmin: FC<ICrearUsuarioAdmin> = ({ close }) => {
  const initialForm: IUsuario = {
    estado: true,
    nombre: "",
    password: "",
    mail: "",
    dni: "",
    rol: IRol.ADMIN,
  };

  const [values, setValues] = useState<IUsuario>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setValues(initialForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Usuario creado:", values);
    resetForm();
    close();
  };

  const handleCancel = () => {
    resetForm();
    close();
  };

  return (
    <div className={styles.formUsuarioAdminContainer}>
      <form className={styles.formUsuarioAdminForm} onSubmit={onSubmit}>
        <h1>Crear Usuario</h1>

        <input
          type="text"
          placeholder="Ingrese nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Ingrese contraseña"
          name="password"
          value={values.password}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Ingrese DNI"
          name="dni"
          value={values.dni}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Ingrese email"
          name="mail"
          value={values.mail}
          onChange={handleChange}
        />

        <div>
          <button
            type="button"
            className={styles.buttonConcelar}
            onClick={handleCancel}
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
