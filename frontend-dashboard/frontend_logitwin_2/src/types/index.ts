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

// ─── SAP Sync Status ─────────────────────────────────────────────────────────

export interface SapTableStatus {
  name: string;
  description: string;
  records: number;
  latencyMs: number;
  status: "online" | "degraded" | "offline";
}

export interface SapSyncStatus {
  connection: {
    system: string;
    host: string;
    client: string;
    status: "connected" | "degraded" | "disconnected";
    lastSync: string;
    avgLatencyMs: number;
    totalRecords: number;
  };
  tables: SapTableStatus[];
}

// ─── Container Allocation Suggestions ────────────────────────────────────────

export interface ContainerCandidate {
  containerId: string;
  type: string;
  currentLocation: string;
  remainingCapacity: number;
  distanceUnits: number;
  fits: boolean;
  score: number;
}

export interface ContainerSuggestion {
  delivery: {
    id: string;
    orderId: string;
    material: string;
    weight: number;
    location: string;
  };
  candidates: ContainerCandidate[];
  bestMatch: ContainerCandidate | null;
}

export interface ContainerSuggestionsResponse {
  generatedAt: string;
  totalPendingDeliveries: number;
  totalActiveContainers: number;
  suggestions: ContainerSuggestion[];
}