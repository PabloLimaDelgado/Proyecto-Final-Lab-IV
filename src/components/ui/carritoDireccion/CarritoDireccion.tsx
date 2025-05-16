import styles from "./carritoDireccion.module.css"

export const CarritoDireccion = () => {
  return (
    <>
      <form className={styles.formContainer}>
        <input type="text" placeholder="Ingrese un pais" name="pais" />
        <input
          type="text"
          placeholder="Ingrese una provincia"
          name="provincia"
        />
        <input
          type="text"
          placeholder="Ingrese un departamento"
          name="departamento"
        />
        <input
          type="text"
          placeholder="Ingrese un codigo postal"
          name="codigoPostal"
        />
        <input
          type="text"
          placeholder="Ingrese una localidad"
          name="localidad"
        />
      </form>
    </>
  );
};
