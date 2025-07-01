import { useEffect, useState } from "react";
import { useOrdenCompra } from "../../../hooks/useOrdenCompra";
import { ordenCompraStore } from "../../../store/ordenCompraStore";
import styles from "./ConfirmacionPago.module.css";
import logoNegro from "../../../images/logonegro.png";

export const ConfirmacionPago = () => {
  const { crearOrden } = useOrdenCompra();
  const { setOrdenCompraActivo } = ordenCompraStore();
  const [estado, setEstado] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      confirmarPago();
    };
  }, []);
  useEffect(() => {
    return () => {
      setTimeout(() => {
        window.location.href = "/VistaLanding";
      }, 3000);
    };
  }, [estado]);

  const confirmarPago = async () => {
    try {
      crearOrden().then((ordenCreada) => {
        if (ordenCreada) {
          setOrdenCompraActivo(null);
          setEstado(true);
        } else if (!ordenCreada) {
          setOrdenCompraActivo(null);
          console.error("Error al crear la orden tras la confirmación de pago");
          setEstado(true);
        } else {
          setOrdenCompraActivo(null);
          console.error("Error al crear la orden tras la confirmación de pago");
          setEstado(true);
        }
      });
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
    }
  };

  return (
    <div className={styles.confirmacionPagoContainer}>
      <div className={styles.gracias}>
        <h1>Graciar por confiar en SneakProduct</h1>
        <img src={logoNegro} alt="" />
      </div>
      {!estado && (
        <div className={styles.spinner}>
          <span className="material-symbols-outlined">progress_activity</span>
          <h2>Redirigiendo al inicio</h2>
        </div>
      )}
    </div>
  );
};
