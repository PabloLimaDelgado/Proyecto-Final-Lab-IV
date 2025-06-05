import { ChangeEvent, FC } from "react";
import styles from "./carritoDireccion.module.css";
import { IDireccion } from "../../../types/IDireccion";

interface ICarritoDireccion {
  values: IDireccion;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const CarritoDireccion: FC<ICarritoDireccion> = ({
  values,
  onChange,
}) => {
  return (
    <form className={styles.formContainer}>
      <input
        type="text"
        placeholder="Ingrese un país"
        name="pais"
        value={values.pais}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Ingrese una provincia"
        name="provincia"
        value={values.provincia}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Ingrese un departamento"
        name="departamento"
        value={values.departamento}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Ingrese un código postal"
        name="codigoPostal"
        value={values.codigoPostal}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Ingrese una localidad"
        name="localidad"
        value={values.localidad}
        onChange={onChange}
      />
    </form>
  );
};
