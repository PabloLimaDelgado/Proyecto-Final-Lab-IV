import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { IDetalle } from "../../../../types/IDetalle";
import { ITalle } from "../../../../types/ITalle";
import { IPrecio } from "../../../../types/IPrecio";
import { IProducto } from "../../../../types/IProducto";
import { IDescuento } from "../../../../types/IDescuento";
import styles from "./editarCrearDetalleProducto.module.css";

// Stores
import { talleStore } from "../../../../store/talleStore";
import { detalleProductoStore } from "../../../../store/detalleProductoStore";
import { precioStore } from "../../../../store/precioStore";
import { productoStore } from "../../../../store/productoStore";
import { descuentoStore } from "../../../../store/descuentoStore";

import Swal from "sweetalert2";

// Props del componente
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
  // Stores
  const { setArrayTalle, talles } = talleStore();
  const { postDetalle, updateDetalle, setDetalleActivo } =
    detalleProductoStore();
  const { postPrecio, updatePrecio, setPrecioActivo } = precioStore();
  const { setProductoActivo } = productoStore();
  const { setArrayDescuentos, descuentos } = descuentoStore();

  // Carga inicial de talles y descuentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTalle, resDescuento] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/talle`),
          fetch(`${import.meta.env.VITE_BASE_URL}/descuento`),
        ]);

        const dataTalle: ITalle[] = await resTalle.json();
        const dataDescuento: IDescuento[] = await resDescuento.json();

        setArrayTalle(dataTalle);
        setArrayDescuentos(dataDescuento);
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
      }
    };

    fetchData();
  }, []);

  // Valores iniciales
  const emptyTalle: ITalle = { talle: "", estado: true };
  const emptyPrecio: IPrecio = {
    precioVenta: 0,
    precioCompra: 0,
    estado: true,
  };

  const [valuesDetalle, setValuesDetalle] = useState<IDetalle>({
    id: detalleProducto?.id,
    talle: detalleProducto?.talle ?? emptyTalle,
    estado: true,
    color: detalleProducto?.color ?? "",
    producto: detalleProducto?.producto ?? producto,
    stock: detalleProducto?.stock ?? "",
    imagenList: detalleProducto?.imagenList ?? [],
    precioDTO: detalleProducto?.precioDTO ?? emptyPrecio,
  });

  const [valuesPrecio, setValuesPrecio] = useState<IPrecio>({
    id: detalleProducto?.precioDTO.id,
    precioVenta: precio?.precioVenta ?? "",
    precioCompra: precio?.precioCompra ?? "",
    estado: true,
    descuento: precio?.descuento,
  });

  // Manejo de cambios en el formulario del detalle
  const handleChangeDetalle = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValuesDetalle((prev) => ({
      ...prev,
      ...(name === "talle"
        ? { talle: talles?.find((t) => t.talle === value) ?? emptyTalle }
        : { [name]: value }),
    }));
  };

  // Manejo de cambios en el formulario del precio
  const handleChangePrecio = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValuesPrecio((prev) => ({
      ...prev,
      ...(name === "descuento"
        ? { descuento: descuentos.find((d) => String(d.id) === value) }
        : { [name]: value }),
    }));
  };

  // Envío del formulario
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    const fieldsValid =
      valuesDetalle.color.trim() !== "" &&
      valuesDetalle.talle &&
      !isNaN(Number(valuesDetalle.stock)) &&
      !isNaN(Number(valuesPrecio.precioVenta)) &&
      !isNaN(Number(valuesPrecio.precioCompra));

    if (!fieldsValid) {
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
        // EDICIÓN
        const precioEditado: IPrecio = {
          id: precio.id,
          precioVenta: Number(valuesPrecio.precioVenta),
          precioCompra: Number(valuesPrecio.precioCompra),
          estado: true,
          descuento: valuesPrecio.descuento,
        };

        console.log(precioEditado);

        const detalleEditado = {
          id: detalleProducto.id,
          talle: valuesDetalle.talle,
          estado: true,
          color: valuesDetalle.color,
          producto: detalleProducto.producto,
          imagenList: detalleProducto.imagenList,
          stock: Number(valuesDetalle.stock),
          precio: precioEditado, // Cambié precioDTO a precio para coincidir con el backend
        };

        const responseDetalle = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle/${detalleEditado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detalleEditado),
          }
        );

        if (!responseDetalle.ok) throw new Error(await responseDetalle.text());

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
        // CREACIÓN
        const precioNuevo: IPrecio = {
          precioVenta: Number(valuesPrecio.precioVenta),
          precioCompra: Number(valuesPrecio.precioCompra),
          estado: true,
          descuento: valuesPrecio.descuento ?? null,
        };

        const detalleNuevo: IDetalle = {
          talle: valuesDetalle.talle,
          estado: true,
          color: valuesDetalle.color,
          producto: valuesDetalle.producto,
          imagenList: [],
          stock: Number(valuesDetalle.stock),
          precioDTO: precioNuevo,
        };

        const detalleParaBackend = { ...detalleNuevo, precio: precioNuevo };

        const responseDetalle = await fetch(
          `${import.meta.env.VITE_BASE_URL}/detalle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detalleParaBackend),
          }
        );

        if (!responseDetalle.ok) throw new Error(await responseDetalle.text());

        const detalleCreado: IDetalle = await responseDetalle.json();

        postDetalle(detalleCreado);
        postPrecio(precioNuevo);

        Swal.fire({
          icon: "success",
          title: "Detalle creado",
          text: "El detalle y precio se guardaron correctamente.",
        });
      }

      // Reset de estados
      setDetalleActivo(null);
      setPrecioActivo(null);
      setProductoActivo(null);
      close();
    } catch (error) {
      console.error("Error en guardar detalle/precio", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el detalle. Verifique los datos e intente nuevamente.",
      });
    }
  };

  return (
    <div className={styles.formDetalleProductoContainer}>
      <form className={styles.formDetalleProductoForm} onSubmit={onSubmit}>
        <h1>{detalleProducto ? "Editar" : "Crear"} Detalle Producto</h1>

        <input
          type="text"
          name="color"
          placeholder="Ingrese un color"
          value={valuesDetalle.color}
          onChange={handleChangeDetalle}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={valuesDetalle.stock}
          onChange={handleChangeDetalle}
        />

        <select
          name="talle"
          value={valuesDetalle.talle.talle || ""}
          onChange={handleChangeDetalle}
        >
          <option value="" disabled hidden>
            Seleccione un Talle
          </option>
          {talles?.map((t) => (
            <option key={t.id} value={t.talle}>
              {t.talle}
            </option>
          ))}
        </select>

        <select
          name="descuento"
          value={valuesPrecio.descuento?.id?.toString() ?? ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedDescuento = descuentos.find(
              (d) => d.id && d.id.toString() === selectedId
            );
            setValuesPrecio((prev) => ({
              ...prev,
              descuento: selectedId === "" ? null : selectedDescuento ?? null,
            }));
          }}
        >
          <option value="">Sin descuento</option>{" "}
          {/* Opción para dejarlo en null */}
          {descuentos.map((d) => (
            <option key={d.id} value={String(d.id)}>
              {d.descuento}%
            </option>
          ))}
        </select>

        <input
          type="number"
          name="precioVenta"
          placeholder="Ingrese precio venta"
          value={valuesPrecio.precioVenta}
          onChange={handleChangePrecio}
        />

        <input
          type="number"
          name="precioCompra"
          placeholder="Ingrese precio compra"
          value={Number(valuesPrecio.precioCompra)}
          onChange={handleChangePrecio}
        />

        <div>
          <button
            type="button"
            className={styles.buttonConcelar}
            onClick={() => {
              setDetalleActivo(null);
              setPrecioActivo(null);
              setProductoActivo(null);
              close();
            }}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.buttonSubmit}>
            {detalleProducto ? "Editar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};
