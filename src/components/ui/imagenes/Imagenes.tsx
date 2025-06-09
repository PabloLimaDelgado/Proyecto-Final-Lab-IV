import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDetalle } from "../../../types/IDetalle";
import styles from "./imagenes.module.css";
import { IImagen } from "../../../types/IImagen";
import { detalleProductoStore } from "../../../store/detalleProductoStore";

interface IImagenes {
  detalle: IDetalle;
  close: () => void;
}

export const Imagenes: FC<IImagenes> = ({ detalle, close }) => {
  const [agregarImagen, setAgregarImagen] = useState<boolean>(false);
  const { updateDetalle } = detalleProductoStore();

  const initialForm: IImagen = {
    url: "",
    alt: "",
    estado: true,
  };

  const [values, setValues] = useState<IImagen>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteImage = async (idImagen?: number) => {
    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/imagen/${idImagen}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      detalle.imagenList = detalle.imagenList.filter(
        (imagen) => imagen.id !== idImagen
      );

      updateDetalle(detalle);
    } catch (error) {}
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const imagenCreada: IImagen = {
      url: values.url,
      alt: values.alt,
      estado: true,
      detalle: detalle,
    };

    const imagenZustand: IImagen = {
      url: values.url,
      alt: values.alt,
      estado: true,
    };

    detalle.imagenList.push(imagenZustand);

    const token = localStorage.getItem("token");

    const response: Response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/imagen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(imagenCreada),
      }
    );
    updateDetalle(detalle);

    try {
    } catch (error) {
      console.error("Error en crear imagen", error);
    }
  };
  return (
    <>
      <div className={styles.imagenContainer}>
        <div className={styles.imagenContainerDiv}>
          <h1>{detalle.producto.nombre}</h1>
          <button
            className={`material-symbols-outlined ${styles.buttonCancelar}`}
            onClick={close}
          >
            close
          </button>

          <div className={styles.divImagenes}>
            {detalle.imagenList
              .filter((imagen) => imagen.estado === true)
              .map((imagen) => (
                <div key={imagen.id} className={styles.imagenWrapper}>
                  <img src={imagen.url} alt={imagen.alt} />
                  <button
                    className={`material-symbols-outlined ${styles.botonCerrarImagen}`}
                    onClick={() => {
                      handleDeleteImage(imagen.id);
                    }}
                  >
                    close
                  </button>
                </div>
              ))}

            <button
              className={styles.imagenAgregarBoton}
              onClick={() => setAgregarImagen(!agregarImagen)}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          {agregarImagen && (
            <div className={styles.formContainer}>
              <form onSubmit={onSubmit}>
                <div className={styles.formInputs}>
                  <input
                    type="text"
                    placeholder="Ingrese una URL"
                    onChange={handleChange}
                    value={values.url}
                    name="url"
                  />
                  <input
                    type="text"
                    placeholder="Ingrese un alt"
                    onChange={handleChange}
                    value={values.alt}
                    name="alt"
                  />
                </div>
                <button type="submit">Crear</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
