import  { useEffect, useState } from 'react';
import { HeaderShop } from '../../ui/headerShop/HeaderShop';
import { IOrdenCompra } from '../../../types/IOrdenCompra';
import { TablaOrdenes } from '../../ui/TablaOrdenes/TablaOrdenes';

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState<IOrdenCompra[]>();

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ordenCompra`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Pedidos recibidos:", data);
      setPedidos(data);
    } catch (error) {
      console.error("Error al traer pedidos:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <>
      <HeaderShop />
      <div className="container">
        {pedidos ? (
          pedidos.length === 0 ? (
            <h2>No hay pedidos disponibles</h2>
          ) : (
            <TablaOrdenes ordenes={pedidos} />
          )
        ) : (
          <h2>No has registrado ningún pedido, ¡comprá algo!</h2>
        )}
      </div>
    </>
  );
};
