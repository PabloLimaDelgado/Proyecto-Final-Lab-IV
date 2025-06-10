import { ChangeEvent, FC, FormEvent, useState } from "react";
import { IDireccion } from "../../../../types/IDireccion";
import { IUsuario } from "../../../../types/IUsuario";
import styles from "./crearEditarDireccion.module.css";
import { usuarioStore } from "../../../../store/usuarioStore";

interface ICrearEditarDireccion {
  close: () => void;
  direccion?: IDireccion;
  usuario: IUsuario;
}
export const CrearEditarDireccion: FC<ICrearEditarDireccion> = ({
  close,
  direccion,
  usuario,
}) => {
  const { updateUsuario, setUsuarioActivo } = usuarioStore();

  const initialForm: IDireccion = {
    localidad: direccion ? direccion.localidad : "",
    estado: direccion ? direccion.estado : true,
    pais: direccion ? direccion.pais : "",
    provincia: direccion ? direccion.provincia : "",
    departamento: direccion ? direccion.departamento : "",
    codigoPostal: direccion ? direccion.codigoPostal : "",
    usuarios: direccion ? direccion.usuarios : [],
  };

  const [values, setValues] = useState<IDireccion>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (direccion) {
      const direccionEditada: IDireccion = {
        id: direccion.id,
        localidad: values.localidad,
        estado: true,
        pais: values.pais,
        provincia: values.provincia,
        departamento: values.departamento,
        codigoPostal: values.codigoPostal,
        usuarios: direccion.usuarios,
      };

      console.log(direccionEditada);

      try {
        const token = localStorage.getItem("token");

        const responseDireccion: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/direccion/${direccion.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(direccionEditada),
          }
        );

        const data: IDireccion = await responseDireccion.json();
        const usuarioActualizado: IUsuario = {
          ...usuario,
          direcciones: usuario.direcciones.map((direccion) =>
            direccion.id === data.id ? data : direccion
          ),
        };

        updateUsuario(usuarioActualizado);
        setUsuarioActivo(usuarioActualizado);
      } catch (error) {
        console.error("Error en editarla direccion del usuario", error);
      }
    } else {
      const direccionCreada: IDireccion = {
        localidad: values.localidad,
        estado: initialForm.estado,
        pais: values.pais,
        provincia: values.provincia,
        departamento: values.departamento,
        codigoPostal: values.codigoPostal,
      };

      try {
        const token = localStorage.getItem("token");

        console.log(direccionCreada);

        const responseDireccion: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/direccion/post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(direccionCreada),
          }
        );

        const data: IDireccion = await responseDireccion.json();

        const usuarioActualizado: IUsuario = {
          ...usuario,
          direcciones: [...usuario.direcciones, data],
        };

        updateUsuario(usuarioActualizado);
        setUsuarioActivo(usuarioActualizado);
      } catch (error) {
        console.error("Error en añadir direccion a usuario", error);
      }
    }

    close();
  };

  return (
    <>
      <div className={styles.formDireccionesContainer}>
        <form onSubmit={onSubmit} className={styles.formDirecciones}>
          <h1>{direccion ? "Editar" : "Crear"} direccion</h1>
          <input
            type="text"
            placeholder="Ingrese un pais"
            onChange={handleChange}
            value={values.pais}
            name="pais"
          />
          <input
            type="text"
            placeholder="Ingrese una provincia"
            onChange={handleChange}
            value={values.provincia}
            name="provincia"
          />
          <input
            type="text"
            placeholder="Ingrese un departamento"
            onChange={handleChange}
            value={values.departamento}
            name="departamento"
          />
          <input
            type="text"
            placeholder="Ingrese un codigo postal"
            onChange={handleChange}
            value={values.codigoPostal}
            name="codigoPostal"
          />
          <input
            type="text"
            placeholder="Ingrese una localidad"
            onChange={handleChange}
            value={values.localidad}
            name="localidad"
          />
          <div>
            <button onClick={() => close()} className={styles.buttonConcelar}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonSubmit}>
              {direccion ? "Editar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
