import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { IProducto } from "../../../../types/IProducto";
import { ICategoria } from "../../../../types/ICategoria";
import { ITipoProducto } from "../../../../types/enums/ITipoProducto";
import { ISexo } from "../../../../types/enums/ISexo";
import styles from "./editarCrearProducto.module.css";
import { productoStore } from "../../../../store/productoStore";
import { categoriaStore } from "../../../../store/categoriaStore";

interface IEditarCrearProducto {
  close: () => void;
  producto?: IProducto;
}

export const EditarCrearProducto: FC<IEditarCrearProducto> = ({
  close,
  producto,
}) => {
  const { updateProducto, postProducto, setProductoActivo } = productoStore();
  const { categorias, setArrayCategoria } = categoriaStore();
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const responseCategoria: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/categoria`
        );
        const data: ICategoria[] = await responseCategoria.json();

        setArrayCategoria(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategoria();
  }, []);

  const emptyCategoria: ICategoria = { nombre: "", estado: true };

  const initialForm: IProducto = {
    id: producto ? producto.id : undefined,
    estado: producto ? producto.estado : true,
    nombre: producto ? producto.nombre : "",
    categoria: producto ? producto.categoria : emptyCategoria,
    tipoProducto: producto ? producto.tipoProducto : ("" as ITipoProducto),
    sexo: producto ? producto.sexo : ("" as ISexo),
  };

  const [values, setValues] = useState<IProducto>(initialForm);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setValues((prev) => {
      if (name === "sexo") {
        return { ...prev, sexo: value as ISexo };
      }
      if (name === "tipoProducto") {
        return { ...prev, tipoProducto: value as ITipoProducto };
      }
      if (name === "categoria") {
        const categoriaSeleccionada = categorias?.find(
          (cat) => cat.nombre === value
        );
        return { ...prev, categoria: categoriaSeleccionada ?? emptyCategoria };
      }
      return { ...prev, [name]: value };
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (producto && producto.id) {
      const productoEditado: IProducto = {
        id: producto.id,
        estado: true,
        categoria: values.categoria,
        nombre: values.nombre,
        tipoProducto: values.tipoProducto,
        sexo: values.sexo,
      };

      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto/${productoEditado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoEditado),
          }
        );
        const data: IProducto = await response.json();
        updateProducto(data);
      } catch (error) {
        console.error("Error en editar producto", error);
      }
    } else {
      const productoCreado: IProducto = {
        estado: true,
        categoria: values.categoria,
        nombre: values.nombre,
        tipoProducto: values.tipoProducto,
        sexo: values.sexo,
      };

      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoCreado),
          }
        );

        const data: IProducto = await response.json();
        postProducto(data);
      } catch (error) {
        console.error("Error en crear producto", error);
      }
    }

    setProductoActivo(null);
    close();
  };

  return (
    <>
      <div className={styles.formProductoContainer}>
        <form className={styles.formProductoForm} onSubmit={onSubmit}>
          <h1>{producto ? "Editar" : "Crear"} Producto</h1>
          <input
            type="text"
            placeholder="Ingrese un nombre"
            onChange={handleChange}
            value={values.nombre}
            name="nombre"
          />
          <select
            name="sexo"
            defaultValue=""
            value={values.sexo}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Seleccione un Sexo
            </option>
            {Object.values(ISexo).map((sexo) => (
              <option key={sexo} value={sexo}>
                {sexo}
              </option>
            ))}
          </select>
          <select
            name="categoria"
            value={values.categoria.nombre || ""}
            onChange={handleChange}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Seleccione una Categoria
            </option>
            {categorias &&
              categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
          </select>
          <select
            name="tipoProducto"
            value={values.tipoProducto}
            onChange={handleChange}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Seleccione un Tipo de Producto
            </option>
            {Object.values(ITipoProducto).map((tipoProducto) => (
              <option key={tipoProducto} value={tipoProducto}>
                {tipoProducto}
              </option>
            ))}
          </select>
          <div>
            <button
              onClick={() => {
                close();
                setProductoActivo(null);
              }}
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
    </>
  );
};
