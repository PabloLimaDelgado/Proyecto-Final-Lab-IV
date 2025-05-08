import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ITalle } from "../../../../types/ITalle";
import styles from "./crearTalle.module.css";

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

    const talle: ITalle = {
      estado: true,
      talle: values.talle,
    };

    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/talle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(talle),
        }
      );
    } catch (error) {
      console.error("Error en crear talle", error);
    }

    resetForm();
    close();
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
