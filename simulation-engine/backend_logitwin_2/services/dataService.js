const data = require("../data/data.json");

function getOrders() {
  const { vbak_header, lips_items, vekp_units } = data.sap_data_dump;

  return vbak_header.map(order => {
    const deliveries = lips_items.filter(
      item => item.vgbel_order === order.vbeln
    );

    const enrichedDeliveries = deliveries.map(delivery => {
      const container = vekp_units.find(
        unit => unit.vbeln_delivery === delivery.vbeln_delivery
      );

      return {
        deliveryId: delivery.vbeln_delivery,
        material: delivery.matnr,
        peso: delivery.lfimg,
        unidade: delivery.meins,
        local: delivery.lgort,
        container: container?.exidv || null,
        tipoContainer: container?.vhilm,
        pesoBruto: container?.brgew
      };
    });

    return {
      pedido: order.vbeln,
      cliente: order.kunnr,
      data: order.erdat,
      gate: order.vstel,
      entregas: enrichedDeliveries
    };
  });
}

module.exports = { getOrders };