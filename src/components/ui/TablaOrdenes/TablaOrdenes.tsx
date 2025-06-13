import { FC, useState } from "react";
import { IOrdenCompra } from "../../../types/IOrdenCompra";

interface TablaOrdenesProps {
  ordenes: IOrdenCompra[];
}

const ITEMS_POR_PAGINA = 5;

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

  return (
    <div style={{ maxHeight: "600px", overflowY: "auto", border: "1px solid #ccc", padding: "1rem" }}>
        {}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ordenesPaginadas.map((orden) => (
            <>
              <tr key={orden.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{orden.id}</td>
                <td>{orden.usuario.nombre}</td>
                <td>{new Date(orden.fecha).toLocaleString()}</td>
                <td>${orden.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <table style={{ width: "100%", marginLeft: "1rem", backgroundColor: "#f9f9f9" }}>
                    <thead>
                      <tr style={{ fontWeight: "bold" }}>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Precio</td>
                        <td>SubTotal</td>
                      </tr>
                    </thead>
                    <tbody>
                      {orden.ordenCompraDetalles?.map((detalle, i) => (
                        <tr key={i}>
                          <td>{detalle.detalle?.producto?.nombre}</td>
                          <td>{detalle.cantidad}</td>
                          <td>${detalle.detalle.precioDTO.precioVenta}</td>
                          <td>${detalle.subtotal}</td>
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

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
        <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
          Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
          Siguiente
        </button>
      </div>
    </div>
  );
};
