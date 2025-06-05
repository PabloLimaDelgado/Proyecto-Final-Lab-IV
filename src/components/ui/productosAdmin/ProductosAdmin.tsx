import React, { ChangeEvent, useEffect, useState } from "react";
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

  const {
    setArrayProducto,
    productos,
    productoActivo,
    setProductoActivo,
    deleteProducto,
  } = productoStore();
  const {
    setArrayDetalle,
    detalles,
    detalleActivo,
    setDetalleActivo,
    deleteDetalle,
  } = detalleProductoStore();
  const { setArrayPrecio, precios, setPrecioActivo, precioActivo } =
    precioStore();

  const searchValue = {
    nombreProducto: "",
  };

  const [values, setValues] = useState(searchValue);

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
        setArrayPrecio(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrecio();
    fetchProducto();
    fetchDetalle();
  }, []);

  const ITEMS_POR_PAGINA = 6;

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [paginasTotales, setPaginasTotales] = useState<number>(1);

  useEffect(() => {
    const productosFiltrados = productos.filter(
      (producto) =>
        producto.nombre
          .toLowerCase()
          .includes(values.nombreProducto.toLowerCase()) &&
        producto.estado === true
    );
    const totalPaginas = Math.max(
      1,
      Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);

    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [productos, values.nombreProducto]);

  const handleAvanzarPagina = () => {
    setPaginaActual((prev) => (prev < paginasTotales ? prev + 1 : prev));
  };

  const handleRetrocederPagina = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre
        .toLowerCase()
        .includes(values.nombreProducto.toLowerCase()) &&
      producto.estado === true
  );

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteProducto = async (idProducto?: number) => {
    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/producto/${idProducto}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (idProducto) {
        deleteProducto(idProducto);
      }
    } catch (error) {
      console.error("Error en crear producto", error);
    }
  };

  const handleDeleteDetalleProducto = async (idDetalle?: number) => {
    try {
      const response: Response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/detalle/${idDetalle}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (idDetalle) {
        deleteDetalle(idDetalle);
      }
    } catch (error) {
      console.error("Error en crear producto", error);
    }
  };

  return (
    <>
      <div className={styles.productosAdminContainer}>
        <h1>SneakAdmin - Productos</h1>
        <div className={styles.productosAdminButtons}>
          <button onClick={handleCrearEditarProducto}>Agregar Producto</button>
          <button onClick={handleCloseTalle}>Agregar Talle</button>
          <button onClick={handleCloseCategoria}>Agregar Categoria</button>
          <div className={styles.productosAdminSearch}>
            <input
              type="text"
              placeholder="Buscar producto"
              onChange={handleChange}
              value={values.nombreProducto}
              name="nombreProducto"
            />
            <button>
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
        <div className={styles.productosMapAdminContainer}>
          {productos &&
            productosPaginados.map((producto) => (
              <>
                <div key={producto.id}>
                  <h1>Producto id: {producto.id}</h1>
                  <h2>{producto.nombre}</h2>
                  <h2>Tipo producto: {producto.tipoProducto}</h2>
                  <h2>Sexo: {producto.sexo}</h2>
                  <h2>Categoria: {producto.categoria.nombre}</h2>
                  <div className={`${styles.productoAdminButtonsDiv}`}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteProducto(producto.id)}
                    >
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

                  <section></section>
                  {detalles &&
                    detalleProductoAbierto === producto.id &&
                    detalles
                      .filter((detalle) => detalle.producto.id === producto.id)
                      .filter((detalle) => detalle.estado === true)
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
                                  <h3>Stock: {detalle.stock}</h3>
                                  <h3>Color: {detalle.color}</h3>
                                  <h3>
                                    Descuento:{" "}
                                    {precio.descuento
                                      ? precio.descuento.descuento
                                      : 0}
                                    %
                                  </h3>
                                  <div
                                    className={styles.productoAdminButtonsDiv}
                                  >
                                    <button
                                      className={styles.deleteButton}
                                      onClick={() =>
                                        handleDeleteDetalleProducto(detalle.id)
                                      }
                                    >
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
        <div className={styles.divPaginadoBotones}>
          <button
            onClick={handleRetrocederPagina}
            disabled={paginaActual === 1}
          >
            <span className="material-symbols-outlined">
              keyboard_double_arrow_left
            </span>
          </button>
          <p>
            Página {paginaActual} de {paginasTotales}
          </p>
          <button
            onClick={handleAvanzarPagina}
            disabled={paginaActual === paginasTotales}
          >
            <span className="material-symbols-outlined">
              keyboard_double_arrow_right
            </span>
          </button>
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
      {crearImagen && detalleActivo && (
        <Imagenes detalle={detalleActivo} close={handleCrearImagen} />
      )}
    </>
  );
};
