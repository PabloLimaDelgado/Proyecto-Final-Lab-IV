import React, { useEffect, useState } from "react";
import { IProducto } from "../../../types/IProducto";
import { IDetalle } from "../../../types/IDetalle";
import { IPrecio } from "../../../types/IPrecio";
import styles from "./ProductosAdmin.module.css";
import { CrearTalles } from "../modals/talles/CrearTalles";
import { CrearCategorias } from "../modals/categorias/CrearCategorias";
import { EditarCrearProducto } from "../modals/productos/EditarCrearProducto";
import { EditarCrearDetalleProducto } from "../modals/detalleProducto/EditarCrearDetalleProducto";
import { productoStore } from "../../../store/productoStore";
import { detalleProductoStore } from "../../../store/detalleProductoStore";
import { precioStore } from "../../../store/precioStore";
import { Imagenes } from "../imagenes/Imagenes";

export const ProductosAdmin = () => {
  const [detalleProductoAbierto, setDetalleProductoAbierto] = useState<
    number | null
  >(null);

  const [creartalle, setCrearTalle] = useState<boolean>(false);
  const [crearCategoria, setCrearCategoria] = useState<boolean>(false);
  const [crearEditarProducto, setCrearEditarProducto] =
    useState<boolean>(false);
  const [crearEditarDetalleProducto, setCrearEditarDetalleProducto] =
    useState<boolean>(false);
  const [crearImagen, setCrearImagen] = useState<boolean>(false);

  const { setArrayProducto, productos, productoActivo, setProductoActivo } =
    productoStore();
  const { setArrayDetalle, detalles, detalleActivo, setDetalleActivo } =
    detalleProductoStore();
  const { setArrayPrecio, precios, setPrecioActivo, precioActivo } =
    precioStore();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/producto`
        );

        const data: IProducto[] = await response.json();
        setArrayProducto(data);
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

        setArrayDetalle(data);
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

        setArrayPrecio(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrecio();
    fetchProducto();
    fetchDetalle();
  }, []);

  const toggleDetalleProducto = (productoId: number) => {
    setDetalleProductoAbierto((prevId) =>
      prevId === productoId ? null : productoId
    );
  };

  const handleCloseTalle = () => {
    setCrearTalle(!creartalle);
  };

  const handleCloseCategoria = () => {
    setCrearCategoria(!crearCategoria);
  };

  const handleCrearEditarProducto = () => {
    setCrearEditarProducto(!crearEditarProducto);
  };

  const handleCrearEditarDetalleProducto = () => {
    setCrearEditarDetalleProducto(!crearEditarDetalleProducto);
  };

  const handleCrearImagen = () => {
    setCrearImagen(!crearImagen);
  };

  return (
    <>
      <div className={styles.productosAdminContainer}>
        <h1>SneakAdmin</h1>
        <div className={styles.productosAdminButtons}>
          <button onClick={handleCrearEditarProducto}>Agregar Producto</button>
          <button onClick={handleCloseTalle}>Agregar Talle</button>
          <button onClick={handleCloseCategoria}>Agregar Categoria</button>
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
                      <span
                        className="material-symbols-outlined"
                        onClick={() => {
                          handleCrearEditarProducto();
                          setProductoActivo(producto);
                        }}
                      >
                        edit
                      </span>
                    </button>
                    <button className={styles.addButton}>
                      <span
                        className="material-symbols-outlined"
                        onClick={() => {
                          handleCrearEditarDetalleProducto();
                          setProductoActivo(producto);
                        }}
                      >
                        add
                      </span>
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
                                    <button className={styles.deleteButton}>
                                      <span className="material-symbols-outlined">
                                        delete
                                      </span>
                                    </button>
                                    <button
                                      className={styles.editButton}
                                      onClick={() => {
                                        handleCrearEditarDetalleProducto();
                                        setDetalleActivo(detalle);
                                        setPrecioActivo(precio);
                                        setProductoActivo(producto);
                                      }}
                                    >
                                      <span className="material-symbols-outlined">
                                        edit
                                      </span>
                                    </button>
                                    <button className={styles.visibilityButton}>
                                      <span className="material-symbols-outlined">
                                        visibility
                                      </span>
                                    </button>
                                    <button
                                      className={styles.imagesButtonAdd}
                                      onClick={() => {
                                        handleCrearImagen();
                                        setDetalleActivo(detalle);
                                      }}
                                    >
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

      {creartalle && <CrearTalles close={handleCloseTalle} />}
      {crearCategoria && <CrearCategorias close={handleCloseCategoria} />}
      {crearEditarProducto && (
        <EditarCrearProducto
          close={handleCrearEditarProducto}
          producto={productoActivo ?? undefined}
        />
      )}
      {crearEditarDetalleProducto && productoActivo && (
        <EditarCrearDetalleProducto
          close={handleCrearEditarDetalleProducto}
          producto={productoActivo}
          detalleProducto={detalleActivo ?? undefined}
          precio={precioActivo ?? undefined}
        />
      )}
      {crearImagen && detalleActivo && <Imagenes detalle={detalleActivo} close={handleCrearImagen}/>}
    </>
  );
};
