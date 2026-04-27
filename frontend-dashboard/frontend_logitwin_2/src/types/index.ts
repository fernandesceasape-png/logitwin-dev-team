// ─── Domínio ─────────────────────────────────────────────────────────────────

export type OrderStatus = "in-transit" | "delivered" | "pending";

export interface Delivery {
  deliveryId: string;
  material: string;
  weight: number;
  location: string;
  container: string | null;
}

export interface Order {
  orderNumber: string;
  status: OrderStatus;
  deliveries: Delivery[];
  totalWeight: number;
  primaryLocation: string;
  primaryContainer: string | null;
  createdAt: string | null;
}

// ─── Backend Raw (NOVO - baseado no seu JSON real) ───────────────────────────

export interface BackendDelivery {
  deliveryId: string;
  material: string;
  peso: number;
  unidade?: string;
  local: string;
  container: string | null;
  tipoContainer?: string;
  pesoBruto?: number;
}

export interface BackendOrder {
  pedido: string;
  cliente: string;
  data: string;
  gate?: string;
  entregas: BackendDelivery[];
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  totalDeliveries: number;
  totalWeight: number; // 🔥 antes era totalWeightKg
  activeContainers: number;
  uniqueLocations: number;
  avgWeightPerOrder: number;
  ordersInTransit: number;
  ordersDelivered: number;
  ordersPending: number;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}