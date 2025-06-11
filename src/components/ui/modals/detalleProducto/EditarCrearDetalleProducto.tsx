import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { IDetalle } from "../../../../types/IDetalle";
import { ITalle } from "../../../../types/ITalle";
import { IPrecio } from "../../../../types/IPrecio";
import { IProducto } from "../../../../types/IProducto";
import styles from "./editarCrearDetalleProducto.module.css";
import { talleStore } from "../../../../store/talleStore";
import { detalleProductoStore } from "../../../../store/detalleProductoStore";
import { precioStore } from "../../../../store/precioStore";
import { productoStore } from "../../../../store/productoStore";
import { IDescuento } from "../../../../types/IDescuento";
import { descuentoStore } from "../../../../store/descuentoStore";
import Swal from "sweetalert2";

interface IEditarCrearDetalleProducto {
  close: () => void;
  producto: IProducto;
  detalleProducto?: IDetalle;
  precio?: IPrecio;
}
export const EditarCrearDetalleProducto: FC<IEditarCrearDetalleProducto> = ({
  close,
  detalleProducto,
  precio,
  producto,
}) => {
  const { setArrayTalle, talles } = talleStore();
  const { postDetalle, updateDetalle, setDetalleActivo } =
    detalleProductoStore();
  const { postPrecio, updatePrecio, setPrecioActivo } = precioStore();
  const { setProductoActivo } = productoStore();
  const { setArrayDescuentos, descuentos } = descuentoStore();
  useEffect(() => {
    const fetchTalle = async () => {
      try {
        const responseTalle: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/talle`
        );
        const data: ITalle[] = await responseTalle.json();
        setArrayTalle(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDescuento = async () => {
      try {
        const responseDescuento: Response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/descuento`
        );
        const data: IDescuento[] = await responseDescuento.json();
        setArrayDescuentos(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTalle();
    fetchDescuento();
  }, []);

  const emptyTalle: ITalle = { talle: "", estado: true };
  const empyPrecio: IPrecio = { precioVenta: 0, precioCompra: 0, estado: true };

  const initialFormDetalle: IDetalle = {
    id: detalleProducto ? detalleProducto.id : undefined,
    talle: detalleProducto ? detalleProducto.talle : emptyTalle,
    estado: true,
    color: detalleProducto ? detalleProducto.color : "",
    producto: detalleProducto ? detalleProducto.producto : producto,
    stock: detalleProducto ? detalleProducto.stock : "",
    imagenList: detalleProducto ? detalleProducto.imagenList : [],
    precioDTO: detalleProducto ? detalleProducto.precioDTO : empyPrecio,
  };

  const [valuesDetalle, setValuesDetalle] =
    useState<IDetalle>(initialFormDetalle);

  const initialFormPrecio: IPrecio = {
    id: precio ? precio.id : undefined,
    precioVenta: precio ? precio.precioVenta : "",
    precioCompra: precio ? precio.precioCompra : "",
    estado: true,
  };

  const [valuesPrecio, setValuesPrecio] = useState<IPrecio>(initialFormPrecio);

  const handleChangeDetalle = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setValuesDetalle((prev) => {
      if (name === "talle") {
        const talleSeleccionado = talles?.find(
          (talle) => talle.talle === value
        );
        return { ...prev, talle: talleSeleccionado ?? emptyTalle };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleChangePrecio = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValuesPrecio((prev) => {
      if (name === "descuento") {
        const descuentoSeleccionado = descuentos.find(
          (descuento) => String(descuento.id) === value
        );
        return { ...prev, descuento: descuentoSeleccionado ?? undefined };
      }

      return { ...prev, [name]: value };
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validaciones básicas
    if (
      !valuesDetalle.talle ||
      !valuesDetalle.color ||
      !valuesDetalle.producto ||
      isNaN(Number(valuesDetalle.stock)) ||
      isNaN(Number(valuesPrecio.precioCompra)) ||
      isNaN(Number(valuesPrecio.precioVenta))
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos inválidos",
        text: "Por favor complete todos los campos correctamente.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (detalleProducto && precio) {
        // Modo edición
        const precioEditado: IPrecio = {
          id: precio.id,
          precioVenta: Number(valuesPrecio.precioVenta),
          precioCompra: Number(valuesPrecio.precioCompra),
          estado: true,
          descuento: valuesPrecio.descuento,
        };

        const detalleEditado: IDetalle = {
          id: detalleProducto.id,
          talle: valuesDetalle.talle,
          estado: true,
          color: valuesDetalle.color,
          producto: detalleProducto.producto,
          imagenList: detalleProducto.imagenList,
          stock: Number(valuesDetalle.stock),
          precioDTO: precioEditado,
        };

        console.log(detalleEditado);

        const responseDetalle = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detalleEditado),
          }
        );

        if (!responseDetalle.ok) {
          const errorText = await responseDetalle.text();
          throw new Error(errorText);
        }

        const detalleGuardado: IDetalle = await responseDetalle.json();
        console.log(detalleGuardado);

        updateDetalle(detalleGuardado);
        updatePrecio(precioEditado);

        Swal.fire({
          icon: "success",
          title: "Detalle actualizado",
          text: "El detalle y precio se actualizaron correctamente.",
        });
      } else {
        // Modo creación
        const precioCreado: IPrecio = {
          precioVenta: Number(valuesPrecio.precioVenta),
          precioCompra: Number(valuesPrecio.precioCompra),
          estado: true,
          descuento: valuesPrecio.descuento ?? null,
        };

        const detalleCreado: IDetalle = {
          talle: valuesDetalle.talle,
          estado: true,
          color: valuesDetalle.color,
          producto: valuesDetalle.producto,
          imagenList: [],
          stock: Number(valuesDetalle.stock),
          precioDTO: precioCreado,
        };

        const detalleParaBackend = {
          ...detalleCreado,
          precio: detalleCreado.precioDTO,
        };

        const responseDetalle = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detalleParaBackend),
          }
        );

        if (!responseDetalle.ok) {
          const errorText = await responseDetalle.text();
          throw new Error(errorText);
        }

        const data: IDetalle = await responseDetalle.json();
        postDetalle(data);
        postPrecio(precioCreado);

        Swal.fire({
          icon: "success",
          title: "Detalle creado",
          text: "El detalle y precio se guardaron correctamente.",
        });
      }

      setDetalleActivo(null);
      setPrecioActivo(null);
      close();
    } catch (error) {
      console.error("Error en crear o editar detalle/precio", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el detalle. Verifique los datos e intente nuevamente.",
      });
    }
  };

  return (
    <>
      <div className={styles.formDetalleProductoContainer}>
        <form className={styles.formDetalleProductoForm} onSubmit={onSubmit}>
          <h1>{detalleProducto ? "Editar" : "Crear"} Detalle Producto</h1>
          <input
            type="text"
            placeholder="Ingrese un color"
            onChange={handleChangeDetalle}
            value={valuesDetalle.color}
            name="color"
          />
          <input
            type="number"
            placeholder="Stock"
            onChange={handleChangeDetalle}
            value={valuesDetalle.stock}
            name="stock"
          />
          <select
            name="talle"
            value={valuesDetalle.talle.talle || ""}
            onChange={handleChangeDetalle}
          >
            <option value="" disabled hidden>
              Seleccione un Talle
            </option>
            {talles &&
              talles.map((talle) => (
                <option key={talle.id} value={talle.talle}>
                  {talle.talle}
                </option>
              ))}
          </select>

          <select
            name="descuento"
            value={
              valuesPrecio.descuento ? String(valuesPrecio.descuento.id) : ""
            }
            onChange={handleChangePrecio}
          >
            <option value="" disabled hidden>
              Seleccione un Descuento
            </option>
            {descuentos.map((descuento) => (
              <option key={descuento.id} value={String(descuento.id)}>
                {descuento.descuento}%
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Ingrese precio venta"
            value={valuesPrecio.precioVenta ?? ""}
            onChange={handleChangePrecio}
            name="precioVenta"
          />
          <input
            type="number"
            placeholder="Ingrese precio compra"
            onChange={handleChangePrecio}
            value={valuesPrecio.precioCompra ?? ""}
            name="precioCompra"
          />
          <div>
            <button
              onClick={() => {
                close();
                setDetalleActivo(null);
                setPrecioActivo(null);
                setProductoActivo(null);
              }}
              className={styles.buttonConcelar}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.buttonSubmit}>
              {detalleProducto ? "Editar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
