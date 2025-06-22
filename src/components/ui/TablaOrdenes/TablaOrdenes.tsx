import { FC, useState } from "react";
import { IOrdenCompra } from "../../../types/IOrdenCompra";
import { IOrdenCompraDetalle } from "../../../types/IOrdenCompraDetalle";
import styles from "./TablaOrdenes.module.css";

interface TablaOrdenesProps {
  ordenes: IOrdenCompra[];
}

const ITEMS_POR_PAGINA = 3;

export const TablaOrdenes: FC<TablaOrdenesProps> = ({ ordenes }) => {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(ordenes.length / ITEMS_POR_PAGINA);

  const ordenesPaginadas = ordenes.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const calcularPrecioFinal = (detalle: IOrdenCompraDetalle): string => {
    const precioBase = detalle.detalle.precioDTO.precioVenta ?? 0;
    const descuento = detalle.detalle.precioDTO.descuento;
    const hoy = new Date();
    let precioFinal = Number(precioBase);

    if (
      descuento &&
      new Date(descuento.fechaInicio) <= hoy &&
      hoy <= new Date(descuento.fechaFin)
    ) {
      precioFinal -= (precioFinal * descuento.descuento) / 100;
    }
    return (precioFinal * detalle.cantidad).toFixed(2);
  };

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      {}
      <table
        style={{ width: "100%", borderCollapse: "collapse" }}
        className={styles.tablePedidos}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "black", color: "white" }}>ID</th>
            <th style={{ backgroundColor: "black", color: "white" }}>
              Usuario
            </th>
            <th style={{ backgroundColor: "black", color: "white" }}>Fecha</th>
            <th style={{ backgroundColor: "black", color: "white" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {ordenesPaginadas.map((orden) => (
            <>
              <tr key={orden.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td className={styles.idCss}>{orden.id}</td>
                <td>{orden.usuario.nombre}</td>
                <td>{new Date(orden.fecha).toLocaleString()}</td>
                <td>${orden.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={5} style={{
                      backgroundColor: "#f6f6f6",
                    }}>
                  <table
                    style={{
                      width: "100%",
                      backgroundColor: "white",
                    }}
                  >
                    <thead>
                      <tr style={{ fontWeight: "bold" }}>
                        <td style={{ backgroundColor: "gray", color: "white" }}>Producto</td>
                        <td style={{ backgroundColor: "gray", color: "white" }}>Cantidad</td>
                        <td style={{ backgroundColor: "gray", color: "white" }}>Precio</td>
                        <td style={{ backgroundColor: "gray", color: "white" }}>SubTotal</td>
                      </tr>
                    </thead>
                    <tbody>
                      {orden.ordenCompraDetalles?.map((detalle, i) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor: "white",
                          }}
                        >
                          <td>{detalle.detalle?.producto?.nombre}</td>
                          <td>{detalle.cantidad}</td>
                          <td>${detalle.detalle.precioDTO.precioVenta}</td>
                          <td>${calcularPrecioFinal(detalle)}</td>
                        </tr>
                      )) ?? (
                        <tr>
                          <td colSpan={3}>Sin detalles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        className={styles.divPaginadoBotones}
      >
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          <span className="material-symbols-outlined">
            keyboard_double_arrow_left
          </span>
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          <span className="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
        </button>
      </div>
    </div>
  );
};
