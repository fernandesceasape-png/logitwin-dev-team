const data = require("../data/data.json");

const WAREHOUSE_GRID = {
  ARMAZEM_A1: { x: 10, y: 10 },
  ARMAZEM_A2: { x: 12, y: 10 },
  ARMAZEM_A3: { x: 14, y: 10 },
  ARMAZEM_A5: { x: 16, y: 10 },
  ARMAZEM_A6: { x: 18, y: 10 },
  PATIO_B1:   { x: 30, y: 25 },
  PATIO_B3:   { x: 34, y: 25 },
  PATIO_C1:   { x: 50, y: 40 },
  PATIO_C2:   { x: 52, y: 40 },
  COFRE_C1:   { x: 70, y: 55 },
  COFRE_C2:   { x: 72, y: 55 },
  COFRE_C3:   { x: 74, y: 55 },
  ARMAZEM_D2: { x: 90, y: 70 },
};

const CONTAINER_CAPACITY_TON = {
  CONT_20_STD: 28.0,
  CONT_40_STD: 30.0,
  CONT_40_HC:  30.0,
};

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getActiveContainers() {
  const { lips_items, vekp_units } = data.sap_data_dump;

  return vekp_units.map(unit => {
    const delivery = lips_items.find(d => d.vbeln_delivery === unit.vbeln_delivery);
    const location = delivery?.lgort ?? "DESCONHECIDO";
    const position = WAREHOUSE_GRID[location] ?? { x: 0, y: 0 };
    const capacity = CONTAINER_CAPACITY_TON[unit.vhilm] ?? 30.0;

    return {
      containerId: unit.exidv,
      type: unit.vhilm,
      currentWeight: unit.brgew,
      capacity,
      utilization: Number(((unit.brgew / capacity) * 100).toFixed(1)),
      currentLocation: location,
      position,
    };
  });
}

function getPendingDeliveriesByLocation() {
  const { vbak_header, lips_items, vekp_units } = data.sap_data_dump;
  const containedDeliveries = new Set(vekp_units.map(u => u.vbeln_delivery));

  return lips_items
    .filter(item => !containedDeliveries.has(item.vbeln_delivery))
    .map(item => {
      const order = vbak_header.find(o => o.vbeln === item.vgbel_order);
      return {
        deliveryId: item.vbeln_delivery,
        orderId:    item.vgbel_order,
        material:   item.matnr,
        weight:     item.lfimg,
        location:   item.lgort,
        position:   WAREHOUSE_GRID[item.lgort] ?? { x: 0, y: 0 },
        createdAt:  order?.erdat ?? null,
      };
    });
}

function getContainerSuggestions() {
  const containers = getActiveContainers();
  const pendingDeliveries = getPendingDeliveriesByLocation();

  const suggestions = pendingDeliveries.map(delivery => {
    const ranked = containers
      .map(container => {
        const dist = distance(container.position, delivery.position);
        const remaining = container.capacity - container.currentWeight;
        const fits = remaining >= delivery.weight;

        return {
          containerId: container.containerId,
          type: container.type,
          currentLocation: container.currentLocation,
          remainingCapacity: Number(remaining.toFixed(2)),
          distanceUnits: Number(dist.toFixed(1)),
          fits,
          score: Number((dist + (fits ? 0 : 1000)).toFixed(2)),
        };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return {
      delivery: {
        id:       delivery.deliveryId,
        orderId:  delivery.orderId,
        material: delivery.material,
        weight:   delivery.weight,
        location: delivery.location,
      },
      candidates: ranked,
      bestMatch: ranked[0] ?? null,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalPendingDeliveries: pendingDeliveries.length,
    totalActiveContainers:  containers.length,
    suggestions,
  };
}

module.exports = { getContainerSuggestions };
