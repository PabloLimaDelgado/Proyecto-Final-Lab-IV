import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { IProducto } from "../../../../types/IProducto";
import { ICategoria } from "../../../../types/ICategoria";
import { ITipoProducto } from "../../../../types/enums/ITipoProducto";
import { ISexo } from "../../../../types/enums/ISexo";
import styles from "./editarCrearProducto.module.css";
import { productoStore } from "../../../../store/productoStore";
import { categoriaStore } from "../../../../store/categoriaStore";
import Swal from "sweetalert2";

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

    // Validación de campos obligatorios
    if (
      !values.nombre ||
      !values.categoria ||
      !values.tipoProducto ||
      !values.sexo
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos obligatorios del producto.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (producto && producto.id) {
        // Editar producto
        const productoEditado: IProducto = {
          id: producto.id,
          estado: true,
          categoria: values.categoria,
          nombre: values.nombre,
          tipoProducto: values.tipoProducto,
          sexo: values.sexo,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto/${productoEditado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productoEditado),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data: IProducto = await response.json();
        updateProducto(data);

        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto fue editado correctamente.",
        });
      } else {
        // Crear producto
        const productoCreado: IProducto = {
          estado: true,
          categoria: values.categoria,
          nombre: values.nombre,
          tipoProducto: values.tipoProducto,
          sexo: values.sexo,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productoCreado),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data: IProducto = await response.json();
        postProducto(data);

        Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: "El producto fue creado correctamente.",
        });
      }

      setProductoActivo(null);
      close();
    } catch (error) {
      console.error("Error al crear/editar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el producto. Intente nuevamente.",
      });
    }
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
