import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDetalle } from "../../../types/IDetalle";
import styles from "./imagenes.module.css";
import { IImagen } from "../../../types/IImagen";
import { detalleProductoStore } from "../../../store/detalleProductoStore";
import Swal from "sweetalert2";

interface IImagenes {
  detalle: IDetalle;
  close: () => void;
}

export const Imagenes: FC<IImagenes> = ({ detalle, close }) => {
  const [agregarImagen, setAgregarImagen] = useState<boolean>(false);

  /*ZUSTAND*/
  const { updateDetalle } = detalleProductoStore();

  /*FORM*/
  const initialForm: IImagen = {
    url: "",
    alt: "",
    estado: true,
  };
  const [values, setValues] = useState<IImagen>(initialForm);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "url" && files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile); // guardás el archivo
      setValues((prev) => ({ ...prev, [name]: selectedFile.name })); // opcional: mostrás el nombre
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Archivo requerido",
        text: "Debe seleccionar un archivo para subir.",
      });
      return;
    }
    const cloudName = "dr3ijjkoq";
    const presetName = "sneaks";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);

    let cloudinaryUrl = "";

    try {
      const responseCloud = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await responseCloud.json();
      cloudinaryUrl = data.secure_url;

      if (!cloudinaryUrl) throw new Error("No se obtuvo URL de Cloudinary.");
    } catch (uploadError) {
      console.error("Error subiendo imagen a Cloudinary:", uploadError);
      Swal.fire({
        icon: "error",
        title: "Error al subir imagen",
        text: "No se pudo subir la imagen a Cloudinary.",
      });
      return;
    }

    const imagenCreada: IImagen = {
      url: cloudinaryUrl,
      alt: values.alt,
      estado: true,
      detalle: detalle,
    };

    console.log(imagenCreada);

    const imagenZustand: IImagen = {
      url: cloudinaryUrl,
      alt: values.alt,
      estado: true,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/imagen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(imagenCreada),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      detalle.imagenList.push(imagenZustand);
      updateDetalle(detalle);

      setValues(initialForm);
      setFile(null);
      setAgregarImagen(false);

      Swal.fire({
        icon: "success",
        title: "Imagen agregada",
        text: "La imagen se agregó correctamente al detalle.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al crear imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar la imagen. Intente más tarde.",
      });
    }
  };

  /*DELETE*/
  const handleDeleteImage = async (idImagen?: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/imagen/${idImagen}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error eliminando imagen");
      }

      detalle.imagenList = detalle.imagenList.filter(
        (imagen) => imagen.id !== idImagen
      );

      updateDetalle(detalle);
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la imagen. Intente más tarde.",
      });
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
            aria-label="Cerrar"
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
                    onClick={() => handleDeleteImage(imagen.id)}
                    aria-label={`Eliminar imagen ${imagen.alt}`}
                  >
                    close
                  </button>
                </div>
              ))}

            <button
              className={styles.imagenAgregarBoton}
              onClick={() => setAgregarImagen(!agregarImagen)}
              aria-label="Agregar imagen"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          {agregarImagen && (
            <div className={styles.formContainer}>
              <form onSubmit={onSubmit}>
                <div className={styles.formInputs}>
                  <input
                    type="file"
                    placeholder="Ingrese un archivo"
                    onChange={handleChange}
                    name="url"
                    aria-label="URL de la imagen"
                  />
                  <input
                    type="text"
                    placeholder="Ingrese un alt"
                    onChange={handleChange}
                    value={values.alt}
                    name="alt"
                    aria-label="Texto alternativo de la imagen"
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
