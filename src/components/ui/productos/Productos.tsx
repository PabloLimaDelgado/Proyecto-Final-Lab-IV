import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "./productos.module.css";
import { IDetalle } from "../../../types/IDetalle";
import { useNavigate, useSearchParams } from "react-router-dom";
import { detalleProductoStore } from "../../../store/detalleProductoStore";

interface IProductos {
  genero: string;
  tipo: string;
}
export const Productos: FC<IProductos> = ({ genero, tipo }) => {
  const { detalles, setArrayDetalle } = detalleProductoStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState({ nombreProducto: "" });
  const descuento = searchParams.get("fechaDescuento");
  const categoria = searchParams.get("categoria");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        let url = `${
          import.meta.env.VITE_BASE_URL
        }/detalle/unicos/filtros?sexo=${genero}&tipo=${tipo.toUpperCase()}`;

        if (categoria) {
          url += `&categoria=${encodeURIComponent(categoria)}`;
        }
        if (descuento) {
          url += `&fechaDescuento=${encodeURIComponent(descuento)}`;
        }

        const response: Response = await fetch(url);

        if (!response.ok) {
          throw new Error("No se pudo obtener los detalles");
        }

        const data: IDetalle[] = await response.json();

        console.log(data);

        setArrayDetalle(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      }
    };

    fetchDetalle();
  }, [genero, tipo, categoria, setArrayDetalle, descuento]);

  const handleNavigate = (idProducto: number | null) => {
    navigate(`/vistaDetalleProducto?idProducto=${idProducto}`);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const productosFiltrados = Object.values(
    detalles
      ?.filter(
        (detalle) =>
          detalle.producto.sexo.toLowerCase() === genero.toLowerCase() &&
          detalle.producto.tipoProducto.toLowerCase() === tipo.toLowerCase() &&
          detalle.producto.estado === true
      )
      .filter((detalle) =>
        detalle.producto.nombre
          .toLowerCase()
          .includes(values.nombreProducto.toLowerCase())
      )
      .reduce((acc, detalle) => {
        const productoId = detalle.producto.id;
        if (productoId !== undefined && !acc[productoId]) {
          acc[productoId] = detalle;
        }
        return acc;
      }, {} as Record<number, IDetalle>)
  ).filter((detalle) => detalle.estado === true);

  return (
    <div className={styles.productosContainer}>
      <div className={styles.buscador}>
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

      <div className={styles.gridDetalles}>
        {productosFiltrados.length === 0 ? (
          <h2>Actualmente no hay productos</h2>
        ) : (
          productosFiltrados.map((detalle) => {
            const imagen = detalle.imagenList[0];
            const precio = Number(detalle.precioDTO?.precioVenta) ?? 0;
            const descuento =
              Number(detalle.precioDTO?.descuento?.descuento) ?? 0;
            const precioFinal = descuento
              ? (precio - (precio * descuento) / 100).toFixed(2)
              : precio.toFixed(2);

            return (
              <div key={detalle.producto.id} className={styles.divProducto}>
                <img src={imagen?.url} alt={imagen?.alt || "Imagen producto"} />
                <h5>{detalle.producto.nombre}</h5>

                <div>
                  {descuento > 0 && (
                    <h5
                      style={{ textDecoration: "line-through", color: "gray" }}
                    >
                      ${precio.toFixed(2)}
                    </h5>
                  )}
                  <h5 style={{ fontSize: "1.2rem" }}>${precioFinal}</h5>
                </div>

                <div className={styles.divButtonProducto}>
                  <button
                    onClick={() => handleNavigate(Number(detalle.producto.id))}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
