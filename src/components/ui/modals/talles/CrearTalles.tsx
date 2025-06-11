import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ITalle } from "../../../../types/ITalle";
import styles from "./crearTalle.module.css";
import Swal from "sweetalert2";

interface ICrearTalles {
  close: () => void;
}

export const CrearTalles: FC<ICrearTalles> = ({ close }) => {
  const initialForm: ITalle = {
    estado: true,
    talle: "",
  };

  const [values, setValues] = useState<ITalle>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setValues(initialForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar que el campo no esté vacío
    if (!values.talle.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debe ingresar un valor para el talle.",
      });
      return;
    }

    const talle: ITalle = {
      estado: true,
      talle: values.talle.trim(),
    };

    try {
      const token = localStorage.getItem("token");

      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/talle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(talle),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      Swal.fire({
        icon: "success",
        title: "Talle creado",
        text: "El talle fue creado correctamente.",
      });

      resetForm();
      close();
    } catch (error) {
      console.error("Error en crear talle", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear el talle. Intente nuevamente.",
      });
    }
  };

  return (
    <>
      <div className={styles.formTalleContainer}>
        <form onSubmit={onSubmit} className={styles.formTalleForm}>
          <h1>Crear Talle</h1>
          <input
            type="text"
            placeholder="Ingrese un talle"
            onChange={handleChange}
            value={values.talle}
            name="talle"
          />
          <div>
            <button onClick={() => close()} className={styles.buttonConcelar}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonSubmit}>
              Crear
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
