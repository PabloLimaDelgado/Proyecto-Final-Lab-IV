import { ChangeEvent, useEffect, useState } from "react";
import { IOrdenCompra } from "../../../types/IOrdenCompra";
import { ordenCompraStore } from "../../../store/ordenCompraStore";
import { ordenCompraDetalleStore } from "../../../store/ordenCompraDetalle";
import { IOrdenCompraDetalle } from "../../../types/IOrdenCompraDetalle";
import styles from "./pedidosAdmin.module.css";
import { DetallePedido } from "../detallePedido/DetallePedido";

export const PedidosAdmin = () => {
  const [verDetallePedido, setVerDetallePedido] = useState<boolean>(false);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState<
    IOrdenCompraDetalle[]
  >([]);
  const [initialValue, setInitialValue] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const {
    setArrayOrdenCompra,
    ordenesCompra,
    setOrdenCompraActivo,
    ordenCompraActivo,
  } = ordenCompraStore();

  const { setArrayOrdenCompraDetalle, ordenesCompraDetalle } =
    ordenCompraDetalleStore();

  // Carga inicial de datos de órdenes y detalles desde backend
  useEffect(() => {
    const fethOrdenCompra = async () => {
      try {
        const token = localStorage.getItem("token");
        const responseOrdenCompra: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/ordenCompra/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: IOrdenCompra[] = await responseOrdenCompra.json();
        setArrayOrdenCompra(data);
      } catch (error) {
        console.log("Error en traer ordenes compra", error);
      }
    };

    const fethOrdenCompraDetalle = async () => {
      try {
        const token = localStorage.getItem("token");
        const responseOrdenCompraDetalle: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/ordenCompraDetalle/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: IOrdenCompraDetalle[] =
          await responseOrdenCompraDetalle.json();
        setArrayOrdenCompraDetalle(data);
      } catch (error) {
        console.log("Error en traer ordenes compra detalle", error);
      }
    };

    fethOrdenCompra();
    fethOrdenCompraDetalle();
  }, []);

  // Maneja cambios en filtros de fecha
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInitialValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerDetallePedido = () => {
    setVerDetallePedido(!verDetallePedido);
  };

  const ITEMS_POR_PAGINA = 6;
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [paginasTotales, setPaginasTotales] = useState<number>(1);

  // Actualiza la cantidad total de páginas cuando cambian las órdenes
  useEffect(() => {
    const ordenesCompraFiltrados = ordenesCompra.filter(
      (orden) => orden.estado === true
    );
    const totalPaginas = Math.max(
      1,
      Math.ceil(ordenesCompraFiltrados.length / ITEMS_POR_PAGINA)
    );
    setPaginasTotales(totalPaginas);

    // Ajusta la página actual si quedó fuera de rango
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [ordenesCompra, paginaActual]);

  const handleAvanzarPagina = () => {
    setPaginaActual((prev) => (prev < paginasTotales ? prev + 1 : prev));
  };

  const handleRetrocederPagina = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Filtra solo las órdenes activas
  const ordenesComprasFiltrados = ordenesCompra.filter(
    (orden) => orden.estado === true
  );

  // Aplica paginado
  const ordenesComprasPaginado = ordenesComprasFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <>
      <div className={styles.pedidosAdminContainer}>
        <h1>SneakAdmin - Pedidos</h1>

        <div className={styles.pedidosAdminButton}>
          <div>
            <label>Desde: </label>
            <input
              type="date"
              onChange={handleChange}
              value={initialValue.fechaInicio}
              name="fechaInicio"
            />
          </div>

          <div>
            <label>Hasta: </label>
            <input
              type="date"
              onChange={handleChange}
              value={initialValue.fechaFin}
              name="fechaFin"
            />
          </div>
        </div>

        <div className={styles.pedidosMapAdminContainer}>
          {ordenesComprasPaginado
            .filter((ordenCompra) => {
              const fechaOrden = new Date(ordenCompra.fecha).getTime();
              const fechaInicio = initialValue.fechaInicio
                ? new Date(initialValue.fechaInicio).getTime()
                : null;
              const fechaFin = initialValue.fechaFin
                ? new Date(initialValue.fechaFin).getTime()
                : null;

              if (fechaInicio && fechaFin) {
                return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
              } else if (fechaInicio) {
                return fechaOrden >= fechaInicio;
              } else if (fechaFin) {
                return fechaOrden <= fechaFin;
              }

              return true;
            })
            .map((ordenCompra) => (
              <div key={ordenCompra.id}>
                <h1>Pedido id: {ordenCompra.id}</h1>
                <h2>Usuario: {ordenCompra.usuario.nombre}</h2>
                <h2>Total: {ordenCompra.total}</h2>
                <h2>Fecha: {ordenCompra.fecha}</h2>
                <button
                  onClick={() => {
                    // Filtra los detalles que corresponden a la orden seleccionada
                    const detallesPedido: IOrdenCompraDetalle[] =
                      ordenesCompraDetalle.filter(
                        (detalle) => detalle.ordenCompra.id === ordenCompra.id
                      );

                    setDetallesSeleccionados(detallesPedido);
                    setOrdenCompraActivo(ordenCompra);
                    handleVerDetallePedido();
                  }}
                  aria-label={`Ver detalles del pedido ${ordenCompra.id}`}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
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

      {/* Modal o sección para mostrar el detalle del pedido */}
      {verDetallePedido && ordenCompraActivo && (
        <DetallePedido
          detallesPedido={detallesSeleccionados}
          close={handleVerDetallePedido}
          ordenCompra={ordenCompraActivo}
        />
      )}
    </>
  );
};
