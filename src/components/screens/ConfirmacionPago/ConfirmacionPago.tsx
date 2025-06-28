import { useEffect, useState } from "react";
import { useOrdenCompra } from "../../../hooks/useOrdenCompra";
import { ordenCompraStore } from "../../../store/ordenCompraStore";


export const ConfirmacionPago = () => {
    const { crearOrden } = useOrdenCompra();
    const { setOrdenCompraActivo } = ordenCompraStore();
    const[titulo, setTitulo] = useState("Verificando pago...");

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
    }, [titulo]);


    const confirmarPago = async () => {

        try{

            crearOrden().then((ordenCreada) => {
                if (ordenCreada) { 
                    setOrdenCompraActivo(null);
                    setTitulo("Pago confirmado, redirigiendo...");
                } else if(!ordenCreada) {
                    setOrdenCompraActivo(null);
                    console.error("Error al crear la orden tras la confirmación de pago");
                    setTitulo("Error al confirmar el pago, redirigiendo...");
                }else{
                    setOrdenCompraActivo(null);
                    console.error("Error al crear la orden tras la confirmación de pago");
                    setTitulo("Error al confirmar el pago, redirigiendo...");
                }
            });

        }catch(error) {
            console.error("Error al confirmar el pago:", error);
        }


    }

  return (
    <div>
        <h1>{titulo}</h1>
    </div>
  )
}
