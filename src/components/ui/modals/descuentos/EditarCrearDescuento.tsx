import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDescuento } from "../../../../types/IDescuento";
import { descuentoStore } from "../../../../store/descuentoStore";
import styles from "./editarCrearDescuento.module.css";

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
    id: descuento ? descuento.id : undefined,
    estado: descuento ? descuento.estado : true,
    fechaInicio: descuento ? descuento.fechaInicio : "",
    fechaFin: descuento ? descuento.fechaFin : "",
    descuento: descuento ? descuento.descuento : 0,
  };

  const [values, setValues] = useState<IDescuento>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (descuento) {
      const descuentoEditado: IDescuento = {
        id: initialForm.id,
        estado: initialForm.estado,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        descuento: values.descuento,
      };

      const responseDescuento: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/descuento/${descuentoEditado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(descuentoEditado),
        }
      );

      const data: IDescuento = await responseDescuento.json();
      updateDescuento(data);
    } else {
      try {
        const descuentoCreado: IDescuento = {
          estado: initialForm.estado,
          fechaInicio: values.fechaInicio,
          fechaFin: values.fechaFin,
          descuento: values.descuento,
        };

        const responseDescuento: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/descuento`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(descuentoCreado),
          }
        );

        const data: IDescuento = await responseDescuento.json();
        postDescuento(data);
      } catch (error) {
        console.error("Error en crear descuento", error);
      }
    }

    close();
    setDescuentoActivo(null);
  };

  return (
    <>
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
            type="text"
            name="descuento"
            onChange={handleChange}
            value={values.descuento === 0 ? "" : values.descuento}
            placeholder="Ingrese un porcenaje de descuento"
          />

          <div>
            <button
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
    </>
  );
};
