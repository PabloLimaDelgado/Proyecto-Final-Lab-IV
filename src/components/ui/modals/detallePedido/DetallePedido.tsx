import { FC, useEffect } from "react";
import { IOrdenCompraDetalle } from "../../../../types/IOrdenCompraDetalle";
import { precioStore } from "../../../../store/precioStore";
import { IPrecio } from "../../../../types/IPrecio";
import styles from "./detallePedido.module.css";
import { IOrdenCompra } from "../../../../types/IOrdenCompra";
import {
  agruparDetalles,
  calcularSubtotal,
  calcularTotalConDescuento,
} from "../../../../hooks/agruparDetalles";

interface IDetallePedido {
  detallesPedido: IOrdenCompraDetalle[];
  close: () => void;
  ordenCompra: IOrdenCompra;
}

export const DetallePedido: FC<IDetallePedido> = ({
  detallesPedido,
  close,
  ordenCompra,
}) => {
  const { setArrayPrecio, precios } = precioStore();

  useEffect(() => {
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
  }, []);

  const detallePrecio = agruparDetalles(
    detallesPedido.map((detalle) => detalle.detalle)
  );

  const subtotal = calcularSubtotal(detallePrecio, precios);

  const totalConDescuento = calcularTotalConDescuento(detallePrecio, precios);

  return (
    <>
      <div className={styles.divDetalleCompra}>
        <div className={styles.divDetalleCompraDiv}>
          <h1>Pedido id: {ordenCompra.id}</h1>
          <div className={styles.gridDireccion}>
            <h3>{ordenCompra.direccion.pais}</h3>
            <h3>{ordenCompra.direccion.provincia}</h3>
            <h3>{ordenCompra.direccion.localidad}</h3>
            <h3>{ordenCompra.direccion.departamento}</h3>
            <h3>{ordenCompra.direccion.codigoPostal}</h3>
          </div>

          <div className={styles.detallesProductosDiv}>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Talle</th>
                  <th>Color</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {detallesPedido.map((detallePedido) => (
                  <tr key={detallePedido.id}>
                    <td>{detallePedido.detalle.producto.nombre}</td>
                    <td>{detallePedido.detalle.talle.talle}</td>
                    <td>{detallePedido.detalle.color}</td>
                    <td>{detallePedido.cantidad}</td>
                    <td>$ {totalConDescuento}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={4}>Total: ${ordenCompra.total}</td>
                </tr>
              </tfoot>
            </table>

            <button onClick={close}>Cerrar</button>
          </div>
        </div>
      </div>
    </>
  );
};
