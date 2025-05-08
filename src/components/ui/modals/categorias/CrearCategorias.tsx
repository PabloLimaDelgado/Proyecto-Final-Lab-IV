import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ICategoria } from "../../../../types/ICategoria";
import styles from "./crearCategorias.module.css";
import { categoriaStore } from "../../../../store/categoriaStore";
interface ICrearCategorias {
  close: () => void;
}

export const CrearCategorias: FC<ICrearCategorias> = ({ close }) => {
  const initialForm: ICategoria = {
    estado: true,
    nombre: "",
  };

  const [values, setValues] = useState<ICategoria>(initialForm);
  const { postCategoria } = categoriaStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setValues(initialForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const categoria: ICategoria = {
      estado: initialForm.estado,
      nombre: values.nombre,
    };

    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/categoria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        }
      );
      const data: ICategoria = await response.json();
      postCategoria(data);
    } catch (error) {
      console.error("Error en crear categoria", error);
    }

    resetForm();
    close();
  };

  return (
    <>
      <div className={styles.formCategoriaContainer}>
        <form onSubmit={onSubmit} className={styles.formCategoriaForm}>
          <h1>Crear Categoria</h1>
          <input
            type="text"
            placeholder="Ingrese una categoria"
            onChange={handleChange}
            value={values.nombre}
            name="nombre"
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
