export type Priority = "P1" | "P2" | "P3";
export type OrderStatus = "New" | "Accepted" | "Picking" | "Packed" | "Dispatched" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  company: string;
  site: string;
  area: string;
  status: OrderStatus;
  slaMinutesLeft: number;
  amount: number;
  items: { name: string; qty: number; price: number }[];
  driver: { name: string; phone: string; lastPing: string; gps: string };
  vendor: { hub: string; acceptedAt: string; pickedAt: string };
  placedAt: string;
}

export interface Incident {
  id: string;
  priority: Priority;
  title: string;
  orderId: string;
  elapsedMin: number;
  detail: string;
  resolved?: boolean;
}

export interface Hub {
  name: string;
  area: string;
  activeOrders: number;
  load: "low" | "medium" | "high";
}

export interface ActivityEvent {
  id: string;
  type: "order" | "driver" | "sla" | "vendor" | "system";
  text: string;
  time: string;
}

export interface VendorKYC {
  id: string;
  name: string;
  businessType: string;
  submitted: string;
  docsCount: number;
  gstin: string;
  pan: string;
  address: string;
  status: "pending" | "active";
}

export const HUBS: Hub[] = [
  { name: "Whitefield", area: "East", activeOrders: 24, load: "high" },
  { name: "Koramangala", area: "Central", activeOrders: 17, load: "medium" },
  { name: "HSR Layout", area: "South", activeOrders: 12, load: "medium" },
  { name: "Indiranagar", area: "Central", activeOrders: 8, load: "low" },
  { name: "Electronic City", area: "South", activeOrders: 31, load: "high" },
  { name: "Yelahanka", area: "North", activeOrders: 5, load: "low" },
];

const sampleItems = [
  { name: "OPC 53 Cement (50kg)", qty: 40, price: 420 },
  { name: "TMT Steel Bar Fe550 (12mm)", qty: 12, price: 5800 },
  { name: "M-Sand (1 ton)", qty: 5, price: 1450 },
  { name: "Red Bricks (1000 pcs)", qty: 2, price: 9200 },
  { name: "Wall Putty (40kg)", qty: 8, price: 1180 },
];

export const ORDERS: Order[] = [
  {
    id: "HZY-48217",
    customer: "Ramesh Iyer",
    company: "Pinnacle Builders Pvt Ltd",
    site: "Prestige Lakeside — Tower B",
    area: "Whitefield",
    status: "Dispatched",
    slaMinutesLeft: 14,
    amount: 84720,
    items: sampleItems.slice(0, 3),
    driver: { name: "Suresh K.", phone: "+91 98455 12340", lastPing: "12s ago", gps: "Live" },
    vendor: { hub: "Whitefield Hub", acceptedAt: "2 min", pickedAt: "11 min" },
    placedAt: "32 min ago",
  },
  {
    id: "HZY-48218",
    customer: "Anjali Reddy",
    company: "Urban Nest Constructions",
    site: "Brigade Cornerstone Site-3",
    area: "Koramangala",
    status: "Picking",
    slaMinutesLeft: 28,
    amount: 42180,
    items: sampleItems.slice(1, 4),
    driver: { name: "Awaiting assignment", phone: "—", lastPing: "—", gps: "—" },
    vendor: { hub: "Koramangala Hub", acceptedAt: "3 min", pickedAt: "in progress" },
    placedAt: "18 min ago",
  },
  {
    id: "HZY-48219",
    customer: "Vikram Shetty",
    company: "Shelter Homes LLP",
    site: "HSR Plot 47 — Foundation",
    area: "HSR Layout",
    status: "Accepted",
    slaMinutesLeft: 47,
    amount: 18900,
    items: sampleItems.slice(0, 2),
    driver: { name: "—", phone: "—", lastPing: "—", gps: "—" },
    vendor: { hub: "HSR Hub", acceptedAt: "1 min", pickedAt: "—" },
    placedAt: "8 min ago",
  },
  {
    id: "HZY-48220",
    customer: "Karthik Menon",
    company: "BuildRight Infra",
    site: "Indira Heights — Block A",
    area: "Indiranagar",
    status: "Delivered",
    slaMinutesLeft: 0,
    amount: 56400,
    items: sampleItems.slice(2, 5),
    driver: { name: "Manoj P.", phone: "+91 98800 41122", lastPing: "Completed", gps: "Done" },
    vendor: { hub: "Indiranagar Hub", acceptedAt: "1 min", pickedAt: "9 min" },
    placedAt: "1h 12m ago",
  },
  {
    id: "HZY-48221",
    customer: "Priya Sharma",
    company: "Crescent Developers",
    site: "Whitefield Plot 22",
    area: "Whitefield",
    status: "New",
    slaMinutesLeft: 58,
    amount: 9870,
    items: sampleItems.slice(3, 5),
    driver: { name: "—", phone: "—", lastPing: "—", gps: "—" },
    vendor: { hub: "—", acceptedAt: "—", pickedAt: "—" },
    placedAt: "2 min ago",
  },
  {
    id: "HZY-48222",
    customer: "Naveen Rao",
    company: "Heritage Constructions",
    site: "E-City Phase 2",
    area: "Electronic City",
    status: "Packed",
    slaMinutesLeft: 22,
    amount: 33240,
    items: sampleItems.slice(0, 4),
    driver: { name: "Rakesh M.", phone: "+91 99020 78812", lastPing: "45s ago", gps: "Live" },
    vendor: { hub: "E-City Hub", acceptedAt: "2 min", pickedAt: "14 min" },
    placedAt: "26 min ago",
  },
  {
    id: "HZY-48223",
    customer: "Deepak Joshi",
    company: "Solid Foundations Pvt Ltd",
    site: "Koramangala Site-7",
    area: "Koramangala",
    status: "Cancelled",
    slaMinutesLeft: 0,
    amount: 0,
    items: sampleItems.slice(0, 1),
    driver: { name: "—", phone: "—", lastPing: "—", gps: "—" },
    vendor: { hub: "Koramangala Hub", acceptedAt: "—", pickedAt: "—" },
    placedAt: "44 min ago",
  },
];

export const INCIDENTS: Incident[] = [
  {
    id: "INC-9012",
    priority: "P1",
    title: "Order stuck in Picking >15 min",
    orderId: "HZY-48218",
    elapsedMin: 17,
    detail: "Vendor has not packed. SLA breach in 11 min.",
  },
  {
    id: "INC-9013",
    priority: "P1",
    title: "SLA breach imminent",
    orderId: "HZY-48217",
    elapsedMin: 46,
    detail: "Driver 4.2 km from drop. ETA 14 min.",
  },
  {
    id: "INC-9014",
    priority: "P2",
    title: "Driver offline 9 min",
    orderId: "HZY-48222",
    elapsedMin: 9,
    detail: "Last ping near Bommanahalli Junction.",
  },
  {
    id: "INC-9015",
    priority: "P2",
    title: "Vendor acceptance delay",
    orderId: "HZY-48221",
    elapsedMin: 6,
    detail: "Whitefield Hub has not accepted in 6 min.",
  },
  {
    id: "INC-9016",
    priority: "P3",
    title: "Low stock: TMT Steel Bar 12mm",
    orderId: "—",
    elapsedMin: 38,
    detail: "HSR Hub at 8 units. Reorder threshold 25.",
  },
  {
    id: "INC-9017",
    priority: "P3",
    title: "Hub rating dropped to 4.2",
    orderId: "—",
    elapsedMin: 120,
    detail: "Electronic City Hub — 3 ratings in last hour.",
  },
];

export const RESOLVED_TODAY = 12;

export const ACTIVITY: ActivityEvent[] = [
  { id: "A1", type: "order", text: "New order HZY-48221 — ₹9,870 — Whitefield", time: "2m" },
  { id: "A2", type: "driver", text: "Driver Suresh K. assigned to HZY-48217", time: "5m" },
  { id: "A3", type: "sla", text: "SLA breach warning on HZY-48218", time: "7m" },
  { id: "A4", type: "vendor", text: "Koramangala Hub accepted HZY-48219", time: "9m" },
  { id: "A5", type: "order", text: "HZY-48220 delivered — ₹56,400", time: "14m" },
  { id: "A6", type: "system", text: "Surge pricing recommendation: East zone", time: "18m" },
  { id: "A7", type: "driver", text: "Rakesh M. picked up HZY-48222", time: "22m" },
  { id: "A8", type: "vendor", text: "E-City Hub paused for 5 min — overload", time: "28m" },
  { id: "A9", type: "order", text: "HZY-48216 delivered — ₹1,12,400", time: "34m" },
  { id: "A10", type: "sla", text: "On-time delivery for HZY-48215", time: "41m" },
];

export const KYC_VENDORS: VendorKYC[] = [
  {
    id: "VEN-301",
    name: "Sai Cement Traders",
    businessType: "Wholesale Distributor",
    submitted: "Today, 09:14",
    docsCount: 5,
    gstin: "29AABCS1234A1Z5",
    pan: "AABCS1234A",
    address: "No 42, Whitefield Main Rd, Bengaluru — 560066",
    status: "pending",
  },
  {
    id: "VEN-302",
    name: "Lakshmi Steel Mart",
    businessType: "Manufacturer + Distributor",
    submitted: "Yesterday, 17:42",
    docsCount: 6,
    gstin: "29AAACL9876B1Z3",
    pan: "AAACL9876B",
    address: "Plot 18, Peenya Industrial Area, Bengaluru — 560058",
    status: "pending",
  },
  {
    id: "VEN-303",
    name: "Bangalore Brick Works",
    businessType: "Manufacturer",
    submitted: "2 days ago",
    docsCount: 4,
    gstin: "29AAACB5544C1Z7",
    pan: "AAACB5544C",
    address: "Kanakapura Rd, Bengaluru — 560062",
    status: "pending",
  },
  {
    id: "VEN-201",
    name: "Premier Aggregate Co.",
    businessType: "Wholesale",
    submitted: "Active since Mar 2025",
    docsCount: 6,
    gstin: "29AAACP3322D1Z9",
    pan: "AAACP3322D",
    address: "HSR Layout Sector 7, Bengaluru — 560102",
    status: "active",
  },
  {
    id: "VEN-202",
    name: "Skyline Hardware Pvt Ltd",
    businessType: "Distributor",
    submitted: "Active since Jan 2025",
    docsCount: 6,
    gstin: "29AAACS7711E1Z2",
    pan: "AAACS7711E",
    address: "Indiranagar 100ft Rd, Bengaluru — 560038",
    status: "active",
  },
];

export const HERO_METRICS = [
  { label: "Orders / Hour", value: "147", delta: "+12%", tone: "success" as const },
  { label: "SLA Hit Rate", value: "94.2%", delta: "+1.8%", tone: "success" as const },
  { label: "Active Drivers", value: "62", delta: "8 idle", tone: "cyan" as const },
  { label: "Revenue Today", value: "₹18.4L", delta: "+₹2.1L", tone: "success" as const },
  { label: "Open Incidents", value: "6", delta: "2 P1", tone: "alert" as const },
];

export const DEMAND_ZONES = [
  { zone: "East", intensity: 0.92 },
  { zone: "Central", intensity: 0.61 },
  { zone: "South", intensity: 0.78 },
  { zone: "North", intensity: 0.24 },
  { zone: "West", intensity: 0.45 },
  { zone: "SE", intensity: 0.88 },
];
