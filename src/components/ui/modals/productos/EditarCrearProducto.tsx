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

  // Carga las categorías una sola vez cuando el componente monta
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const responseCategoria: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/categoria`
        );
        const data: ICategoria[] = await responseCategoria.json();

        setArrayCategoria(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategoria();
  }, [setArrayCategoria]);

  // Categoria vacía por defecto para inicializar el estado cuando no hay producto
  const emptyCategoria: ICategoria = { nombre: "", estado: true };

  // Inicializa el formulario, si viene producto, se usa sus datos, sino valores por defecto
  const initialForm: IProducto = {
    id: producto ? producto.id : undefined,
    estado: producto ? producto.estado : true,
    nombre: producto ? producto.nombre : "",
    categoria: producto ? producto.categoria : emptyCategoria,
    tipoProducto: producto ? producto.tipoProducto : ("" as ITipoProducto),
    sexo: producto ? producto.sexo : ("" as ISexo),
  };

  // Estado local para los valores del formulario
  const [values, setValues] = useState<IProducto>(initialForm);

  // Maneja cambios en inputs y selects, adaptando el tipo cuando corresponde
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setValues((prev) => {
      if (name === "sexo") {
        // Casting porque ISexo es un enum o union de strings
        return { ...prev, sexo: value as ISexo };
      }
      if (name === "tipoProducto") {
        return { ...prev, tipoProducto: value as ITipoProducto };
      }
      if (name === "categoria") {
        // Busca la categoria seleccionada en el listado
        const categoriaSeleccionada = categorias?.find(
          (cat) => cat.nombre === value
        );
        // Si no se encuentra la categoría, usa emptyCategoria
        return { ...prev, categoria: categoriaSeleccionada ?? emptyCategoria };
      }
      // Para campos texto normales
      return { ...prev, [name]: value };
    });
  };

  // Enviar formulario, crear o editar según si existe producto con id
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación simple: campos obligatorios no vacíos
    if (
      !values.nombre ||
      !values.categoria?.nombre || // Asegurar que categoria tiene nombre
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
          customClass: {
            popup: "no-x-scroll",
          },
        });
      } else {
        // Crear producto nuevo
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

      // Limpiar producto activo y cerrar modal
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
    <div className={styles.formProductoContainer}>
      <form className={styles.formProductoForm} onSubmit={onSubmit}>
        <h1>{producto ? "Editar" : "Crear"} Producto</h1>

        {/* Input para nombre */}
        <input
          type="text"
          placeholder="Ingrese un nombre"
          onChange={handleChange}
          value={values.nombre}
          name="nombre"
          autoComplete="off"
        />

        {/* Select para sexo */}
        <select
          name="sexo"
          value={values.sexo}
          onChange={handleChange}
          defaultValue=""
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

        {/* Select para categoria */}
        <select
          name="categoria"
          value={values.categoria?.nombre || ""}
          onChange={handleChange}
          defaultValue=""
        >
          <option value="" disabled hidden>
            Seleccione una Categoria
          </option>
          {categorias?.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        {/* Select para tipo de producto */}
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

        {/* Botones Cancelar y Guardar */}
        <div>
          <button
            type="button"
            onClick={() => {
              close();
              setProductoActivo(null);
            }}
            className={styles.buttonConcelar}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.buttonSubmit}>
            {producto ? "Editar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};
