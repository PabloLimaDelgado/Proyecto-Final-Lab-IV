import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ICategoria } from "../../../../types/ICategoria";
import styles from "./crearCategorias.module.css";
import { categoriaStore } from "../../../../store/categoriaStore";
import Swal from "sweetalert2";

interface ICrearCategorias {
  close: () => void;
}

export const CrearCategorias: FC<ICrearCategorias> = ({ close }) => {

  /*ZUSTAND*/
  const { postCategoria } = categoriaStore();

  /*FORM*/
  const initialForm: ICategoria = {
    estado: true,
    nombre: "",
  };

  const [values, setValues] = useState<ICategoria>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setValues(initialForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.nombre.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campo vacío",
        text: "Por favor ingrese un nombre de categoría.",
      });
      return;
    }

    const categoria: ICategoria = {
      estado: initialForm.estado,
      nombre: values.nombre.trim(),
    };

    try {
      const token = localStorage.getItem("token");

      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/categoria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoria),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo crear la categoría");
      }

      const data: ICategoria = await response.json();

      postCategoria(data);

      Swal.fire({
        icon: "success",
        title: "Categoría creada",
        text: `La categoría "${data.nombre}" se creó correctamente.`,
      });

      resetForm();
      close();
    } catch (error) {
      console.error("Error en crear categoría", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear la categoría.",
      });
    }
  };

  return (
    <div className={styles.formCategoriaContainer}>
      <form onSubmit={onSubmit} className={styles.formCategoriaForm}>
        <h1>Crear Categoría</h1>

        <input
          type="text"
          placeholder="Ingrese una categoría"
          onChange={handleChange}
          value={values.nombre}
          name="nombre"
          aria-label="Nombre de la categoría"
        />

        <div>
          <button
            type="button"
            onClick={close}
            className={styles.buttonConcelar}
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
