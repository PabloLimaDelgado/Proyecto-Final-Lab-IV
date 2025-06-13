import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDescuento } from "../../../../types/IDescuento";
import { descuentoStore } from "../../../../store/descuentoStore";
import styles from "./editarCrearDescuento.module.css";
import Swal from "sweetalert2";

interface IEditarCrearDescuento {
  close: () => void;
  descuento?: IDescuento;
}

export const EditarCrearDescuento: FC<IEditarCrearDescuento> = ({
  close,
  descuento,
}) => {
  const { postDescuento, updateDescuento, setDescuentoActivo } =
    descuentoStore();

  const initialForm: IDescuento = {
    id: descuento?.id,
    estado: descuento?.estado ?? true,
    fechaInicio: descuento?.fechaInicio ?? "",
    fechaFin: descuento?.fechaFin ?? "",
    descuento: descuento?.descuento ?? 0,
  };

  const [values, setValues] = useState<IDescuento>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "descuento" ? Number(value) : value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.descuento || values.descuento <= 0) {
      Swal.fire({
        icon: "error",
        title: "Descuento inválido",
        text: "Ingrese un porcentaje de descuento válido.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (descuento) {
        const descuentoEditado: IDescuento = {
          ...initialForm,
          fechaInicio: values.fechaInicio,
          fechaFin: values.fechaFin,
          descuento: values.descuento,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/descuento/${descuentoEditado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(descuentoEditado),
          }
        );

        if (!response.ok) throw new Error("Error al editar descuento");

        const data: IDescuento = await response.json();
        updateDescuento(data);

        Swal.fire({
          icon: "success",
          title: "Descuento actualizado",
          text: "El descuento fue editado correctamente.",
        });
      } else {
        const descuentoCreado: IDescuento = {
          estado: true,
          fechaInicio: values.fechaInicio,
          fechaFin: values.fechaFin,
          descuento: values.descuento,
        };

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/descuento`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(descuentoCreado),
          }
        );
console.log(descuentoCreado)
        if (!response.ok) throw new Error("Error al crear descuento");

        const data: IDescuento = await response.json();
        postDescuento(data);

        Swal.fire({
          icon: "success",
          title: "Descuento creado",
          text: "El descuento se creó correctamente.",
        });
      }

      close();
      setDescuentoActivo(null);
    } catch (error) {
      console.error("Error en descuento", error);
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "No se pudo procesar el descuento. Intente nuevamente.",
      });
    }
  };

  return (
    <div className={styles.formDescuentoContainer}>
      <form className={styles.formDescuentoContainerForm} onSubmit={onSubmit}>
        <h1>{descuento ? "Editar" : "Crear"} descuento</h1>

        <input
          type="date"
          name="fechaInicio"
          onChange={handleChange}
          value={values.fechaInicio}
          placeholder="Ingrese una fecha inicio"
        />

        <input
          type="date"
          name="fechaFin"
          onChange={handleChange}
          value={values.fechaFin}
          placeholder="Ingrese una fecha fin"
        />

        <input
          type="number"
          name="descuento"
          onChange={handleChange}
          value={values.descuento === 0 ? "" : values.descuento}
          placeholder="Ingrese un porcentaje de descuento"
          min="1"
        />

        <div>
          <button
            type="button"
            className={styles.buttonConcelar}
            onClick={() => {
              close();
              setDescuentoActivo(null);
            }}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.buttonSubmit}>
            {descuento ? "Editar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};
