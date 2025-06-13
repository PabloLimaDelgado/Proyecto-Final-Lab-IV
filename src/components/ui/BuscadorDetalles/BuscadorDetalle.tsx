import { useEffect, useState } from "react";
import axios from "axios";
import { IOrdenCompra } from "../../../types/IOrdenCompra";
import {
  IOrdenCompraDetalleFind,
  IProductoFind,
} from "../../../types/IProductoFind";
import styles from "./BuscadorDetalle.module.css";

interface Props {
  onSelect: (nuevoDetalle: IOrdenCompraDetalleFind) => void;
  ordenCompra: IOrdenCompra;
}
export const BuscadorDetalleProducto = ({
  onSelect,
  ordenCompra,
}: Props) => {
  const [query, setQuery] = useState("");
  const [productos, setProductos] = useState<IProductoFind[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        buscarDetalles(query);
      } else {
        setProductos([]);
        setShowDropdown(false);
      }
    }, 200);
    return () => clearTimeout(delay);
  }, [query]);

  const buscarDetalles = async (texto: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/producto/buscarAgrupado/${texto}`
      );
      setProductos(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error buscando detalles:", error);
      setProductos([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (detalleId: number) => {
    const producto = productos.find((p) =>
      p.detalles.some((d) => d.id === detalleId)
    );

    if (!producto) return;

    const detalle = producto.detalles.find((d) => d.id === detalleId);
    if (!detalle) return;

    const precioBase = detalle.precio.precioVenta;
    const hoy = new Date();
    let precioFinal = precioBase;

    if (
      detalle.precio.descuento &&
      new Date(detalle.precio.descuento.fechaInicio) <= hoy &&
      hoy <= new Date(detalle.precio.descuento.fechaFin)
    ) {
      const porcentaje = detalle.precio.descuento.descuento;
      precioFinal -= (precioFinal * porcentaje) / 100;
    }

    const nuevoDetalle: IOrdenCompraDetalleFind = {
      cantidad: 1,
      producto: producto.nombre,
      detalle,
      ordenCompra,
      subtotal: precioFinal,
      estado: false,
      id: 0,
    };

    onSelect(nuevoDetalle);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <div className={styles.inputBuscadorDetalle}>
      <input
        type="text"
        placeholder="Buscar producto, color o talle..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {showDropdown && (
        <select
          onChange={(e) => handleSelect(parseInt(e.target.value))}
          defaultValue=""
          style={{
            width: "100%",
            padding: "8px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          <option value="" disabled>
            Selecciona un detalle...
          </option>
          {productos.map((producto) => (
            <optgroup key={producto.id} label={producto.nombre}>
              {producto.detalles.map((detalle) => (
                <option
                  key={detalle.id}
                  value={detalle.id}
                  disabled={detalle.stock === 0}
                >
                  {`Color: ${detalle.color} | Talle: ${detalle.talle.talle} | Stock: ${detalle.stock} | $${detalle.precio.precioVenta}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
    </div>
  );
};
