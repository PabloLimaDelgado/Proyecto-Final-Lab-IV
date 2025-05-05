import React, { useEffect, useState } from "react";
import { IProducto } from "../../../types/IProducto";
import { IDetalle } from "../../../types/IDetalle";
import { IPrecio } from "../../../types/IPrecio";
import styles from "./ProductosAdmin.module.css";
import { CrearTalle } from "../modals/crearTalle";

export const ProductosAdmin = () => {
  const [productos, setProductos] = useState<null | IProducto[]>(null);
  const [detalles, setDetalles] = useState<null | IDetalle[]>(null);
  const [precios, setPrecios] = useState<null | IPrecio[]>(null);
  const [detalleProductoAbierto, setDetalleProductoAbierto] = useState<
    number | null
  >(null);
  const [creartalle, setCrearTalle] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto`
        );
        const data: IProducto[] = await response.json();
        console.log(data);

        setProductos(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDetalle = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`
        );
        const data: IDetalle[] = await response.json();
        console.log(data);

        setDetalles(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPrecio = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/precio`
        );
        const data: IPrecio[] = await response.json();
        console.log(data);

        setPrecios(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrecio();
    fetchProducto();
    fetchDetalle();

    console.log(detalles, precios, productos);
  }, []);

  const toggleDetalleProducto = (productoId: number) => {
    setDetalleProductoAbierto((prevId) =>
      prevId === productoId ? null : productoId
    );
  };

  const handleCloseTalle = () => {
    setCrearTalle(!creartalle);
  };

  return (
    <>
      <div className={styles.productosAdminContainer}>
        <h1>SneakAdmin</h1>
        <div className={styles.productosAdminButtons}>
          <button>Agregar Producto</button>
          <button onClick={handleCloseTalle}>Agregar Talle</button>

          <div className={styles.productosAdminSearch}>
            <input type="text" placeholder="Buscar producto" />
            <button>
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
        <div className={styles.productosMapAdminContainer}>
          {productos &&
            productos.map((producto) => (
              <>
                <div key={producto.id}>
                  <h1>Producto id: {producto.id}</h1>
                  <h2>{producto.nombre}</h2>
                  <h2>Tipo producto: {producto.tipoProducto}</h2>
                  <h2>Sexo: {producto.sexo}</h2>
                  <h2>Categoria: {producto.categoria.nombre}</h2>
                  <div className={styles.productoAdminButtonsDiv}>
                    <button className={styles.deleteButton}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className={styles.editButton}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className={styles.addButton}>
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  {producto.id !== undefined && (
                    <button onClick={() => toggleDetalleProducto(producto.id!)}>
                      <span className="material-symbols-outlined">
                        {detalleProductoAbierto === producto.id
                          ? "arrow_drop_up"
                          : "arrow_drop_down"}
                      </span>
                    </button>
                  )}
                  {detalles &&
                    detalleProductoAbierto === producto.id &&
                    detalles
                      .filter((detalle) => detalle.producto.id === producto.id)
                      .map((detalle) => (
                        <React.Fragment key={detalle.id}>
                          <h2>Detalle id: {detalle.id}</h2>
                          <h3>Talle: {detalle.talle.talle}</h3>
                          {precios &&
                            precios
                              .filter(
                                (precio) => precio.detalle.id === detalle.id
                              )
                              .map((precio) => (
                                <React.Fragment key={precio.id}>
                                  <h3>Precio compra: {precio.precioCompra}</h3>
                                  <h3>Precio venta: {precio.precioVenta}</h3>
                                  <h3>Color: {detalle.color}</h3>
                                  <h3>
                                    Descuento: {precio.descuento?.descuento}%
                                  </h3>
                                  <div
                                    className={styles.productoAdminButtonsDiv}
                                  >
                                    <button className={styles.imageButton}>
                                      <span className="material-symbols-outlined">
                                        image
                                      </span>
                                    </button>
                                    <button className={styles.deleteButton}>
                                      <span className="material-symbols-outlined">
                                        delete
                                      </span>
                                    </button>
                                    <button className={styles.editButton}>
                                      <span className="material-symbols-outlined">
                                        edit
                                      </span>
                                    </button>
                                    <button className={styles.visibilityButton}>
                                      <span className="material-symbols-outlined">
                                        visibility
                                      </span>
                                    </button>
                                    <button className={styles.imagesButtonAdd}>
                                      IMG
                                    </button>
                                  </div>
                                </React.Fragment>
                              ))}
                        </React.Fragment>
                      ))}
                </div>
              </>
            ))}
        </div>
      </div>

      {creartalle && <CrearTalle close={handleCloseTalle} />}
    </>
  );
};
