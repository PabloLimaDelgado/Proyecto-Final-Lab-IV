import { FC, useState } from "react";
import { IOrdenCompraDetalle } from "../../../types/IOrdenCompraDetalle";
import styles from "./detallePedido.module.css";
import { IOrdenCompra } from "../../../types/IOrdenCompra";
import { castOrdenCompraDetallesFind, IOrdenCompraDetalleFind } from "../../../types/IProductoFind";
import { BuscadorDetalleProducto } from "../BuscadorDetalles/BuscadorDetalle";
import { IOrdenPost, IOrdenUpdate } from "../../../types/IOrdenPost";
import Swal from "sweetalert2";

interface IDetallePedido {
  detallesPedido: IOrdenCompraDetalle[];
  close: () => void;
  ordenCompra: IOrdenCompra;
  modoEdicion?: boolean;
  onGuardarCambios?: () => void;
}


export const DetallePedido: FC<IDetallePedido> = ({
  detallesPedido,
  close,
  onGuardarCambios,
  ordenCompra,
  modoEdicion = false
}) => {
const [direccionEditada, setDireccionEditada] = useState(ordenCompra.direccion);
const [seGuardaronCambios, setSeGuardaronCambios] = useState(true);
  const [detallesEditados, setDetallesEditados] = useState<IOrdenCompraDetalleFind[]>(castOrdenCompraDetallesFind(detallesPedido));
  
  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setDireccionEditada((prev) => ({ ...prev, [name]: value }));
  setSeGuardaronCambios(false);
};
  const handleEliminarDetalle = (id: number) => {
    setDetallesEditados((prev) => prev.filter(d => d.id !== id));
  };

  const onSelect = (nuevoDetalle: IOrdenCompraDetalleFind) => {
  const yaExiste = detallesEditados.some(
    (d) => d.detalle.id === nuevoDetalle.detalle.id
  );
  console.log(nuevoDetalle)
  if (yaExiste) {
    alert("Este producto ya está en el pedido.");
    return;
  }

  if (nuevoDetalle.detalle.stock === 0) {
    alert("No se puede agregar un producto sin stock.");
    return;
  }

  setDetallesEditados((prev) => [...prev, nuevoDetalle]);
};

  const calcularPrecioFinal = (detalle: IOrdenCompraDetalleFind): string => {
    const precioBase = detalle.detalle.precio.precioVenta ?? 0;
    const descuento = detalle.detalle.precio.descuento;
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

  const guardarCambios = async ()=>{
    try {
      let ordenCompraActualizada: IOrdenUpdate;
      if(!seGuardaronCambios){
         ordenCompraActualizada = {
          direccion: {
            codigoPostal: direccionEditada.codigoPostal,
            departamento: direccionEditada.departamento,
            estado:true,
            localidad: direccionEditada.localidad,
            pais: direccionEditada.pais,
            provincia: direccionEditada.provincia,},
          usuario: { id: ordenCompra.usuario.id },
          estado: ordenCompra.estado, 
          direccionUsuario: false,
          detalles: detallesEditados
        }
      }else{
         ordenCompraActualizada  = {
          direccion: {id: ordenCompra.direccion.id},
          usuario: { id: ordenCompra.usuario.id },
          estado: ordenCompra.estado, 
          direccionUsuario: true,
          detalles: detallesEditados
        }
      }
      
      console.log(ordenCompraActualizada)
    const responseUpdate = await fetch(
      `${import.meta.env.VITE_BASE_URL}/ordenCompra/${ordenCompra.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ordenCompraActualizada),
      }
    );
    if(responseUpdate.ok){
      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "Los cambios se han guardado correctamente.",
      });
      onGuardarCambios?.();
      close();
      
    }
    } catch (error) {
        Swal.fire({
        icon: "error",
        title: "Error al guardar cambios",
        text: "Ha ocurrido un error al intentar guardar los cambios. Por favor, inténtelo de nuevo más tarde.",
      });
    }
  }

  const handleCantidadChange = (id: number, nuevaCantidad: number) => {
    setDetallesEditados((prev) =>
      prev.map((detalle) =>
        detalle.id === id ? { ...detalle, cantidad: nuevaCantidad } : detalle
      )
    );
  };

  const totalCalculado = detallesEditados.reduce(
    (acc, detalle) => acc + Number(calcularPrecioFinal(detalle)),
    0
  );

  return (
    <div className={styles.divDetalleCompra}>
      <div className={styles.divDetalleCompraDiv}>
        <h1>Pedido id: {ordenCompra.id}</h1>
        <div className={styles.gridDireccion}>
          {modoEdicion ? (
            <>
              <input
                type="text"
                name="pais"
                value={direccionEditada.pais}
                onChange={handleDireccionChange}
                placeholder="País"
              />
              <input
                type="text"
                name="provincia"
                value={direccionEditada.provincia}
                onChange={handleDireccionChange}
                placeholder="Provincia"
              />
              <input
                type="text"
                name="localidad"
                value={direccionEditada.localidad}
                onChange={handleDireccionChange}
                placeholder="Localidad"
              />
              <input
                type="text"
                name="departamento"
                value={direccionEditada.departamento}
                onChange={handleDireccionChange}
                placeholder="Departamento"
              />
              <input
                type="text"
                name="codigoPostal"
                value={direccionEditada.codigoPostal}
                onChange={handleDireccionChange}
                placeholder="Código Postal"
              />
            </>
          ) : (
            <>
              <h3>{direccionEditada.pais}</h3>
              <h3>{direccionEditada.provincia}</h3>
              <h3>{direccionEditada.localidad}</h3>
              <h3>{direccionEditada.departamento}</h3>
              <h3>{direccionEditada.codigoPostal}</h3>
            </>
          )}
        </div>

        <BuscadorDetalleProducto onSelect={onSelect} ordenCompra={ordenCompra}></BuscadorDetalleProducto>
        <div className={styles.detallesProductosDiv}>
        <table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Talle</th>
      <th>Color</th>
      <th>Cantidad</th>
      <th>Precio</th>
      <th>Acción</th> {/* Nueva columna */}
    </tr>
  </thead>
  <tbody>
    {detallesEditados.map((detallePedido) => (
      <tr key={detallePedido.id}>
        <td>{detallePedido.producto}</td>
        <td>{detallePedido.detalle.talle.talle}</td>
        <td>{detallePedido.detalle.color}</td>
        <td>
          {modoEdicion ? (
            <input
              type="number"
              min={1}
              value={detallePedido.cantidad}
              onChange={(e) =>
                handleCantidadChange(
                  detallePedido.id,
                  Number(e.target.value)
                )
              }
            />
          ) : (
            detallePedido.cantidad
          )}
        </td>
        <td>${calcularPrecioFinal(detallePedido)}</td>
        <td>
          {modoEdicion && (
            <button
              onClick={() => handleEliminarDetalle(detallePedido.id)}
              style={{
                background: "transparent",
                color: "red",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
              title="Eliminar"
            >
              ❌
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={5}>Total: ${totalCalculado.toFixed(2)}</td>
    </tr>
  </tfoot>
</table>


          <div style={{ marginTop: "1rem" }}>
            {modoEdicion? (
              <button onClick={() => guardarCambios()}>
                Guardar cambios
              </button>
            ): null}
            <button onClick={close} style={{ marginLeft: "1rem" }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
