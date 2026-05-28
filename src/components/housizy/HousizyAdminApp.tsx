import { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, Bell, Box, Check, ChevronLeft, ChevronRight, CircleDot,
  Clock, CreditCard, FileText, Filter, Flame, Gauge, Headphones, LayoutGrid, Lock,
  LogOut, MapPin, Package, Phone, Radio, RefreshCw, Search, Settings, Shield,
  ShieldCheck, Truck, User, X, Zap, Building2, ChevronDown, BadgeCheck, Eye,
  Power, Wrench, Plus
} from "lucide-react";
import {
  HUBS, ORDERS, INCIDENTS, ACTIVITY, KYC_VENDORS, HERO_METRICS, RESOLVED_TODAY,
  type Order, type Incident, type OrderStatus, type Priority, type VendorKYC
} from "@/lib/housizy-data";
import driverPhoto from "@/assets/driver-rakesh.jpg";
import profilePhoto from "@/assets/profile-ananya.jpg";

type TabKey = "ops" | "incidents" | "orders" | "settings";
type Screen =
  | { name: "tabs" }
  | { name: "order"; orderId: string }
  | { name: "kyc" };

interface Sheet {
  title: string;
  desc: string;
  confirmLabel: string;
  tone?: "alert" | "primary" | "amber";
  onConfirm: () => void;
}

export function HousizyAdminApp() {
  const [tab, setTab] = useState<TabKey>("ops");
  const [stack, setStack] = useState<Screen[]>([{ name: "tabs" }]);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const push = (s: Screen) => setStack((p) => [...p, s]);
  const pop = () => setStack((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  };

  const handleLogout = () => {
    setLoggedOut(true);
    setSheet(null);
    setStack([{ name: "tabs" }]);
    setTab("ops");
  };

  const handleLogin = () => {
    setLoggedOut(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  const top = stack[stack.length - 1];

  if (loggedOut) {
    return (
      <LoginScreen onLogin={handleLogin} />
    );
  }

  return (
    <div className="iphone-screen flex flex-col text-[color:var(--text)]">

      {/* Status bar */}
      <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[12px] font-medium font-mono">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="opacity-80">5G</span>
          <span className="inline-block w-6 h-3 border border-black/60 rounded-[3px] relative">
            <span className="absolute inset-[2px] bg-black/70 rounded-[1px]" />
          </span>
        </span>
      </div>

      {/* Main */}
      <div className="flex-1 relative overflow-hidden">
        {top.name === "tabs" && (
          <TabShell
            tab={tab}
            setTab={setTab}
            loading={loading}
            onOrderTap={(id) => push({ name: "order", orderId: id })}
            onOpenKYC={() => push({ name: "kyc" })}
            onSheet={setSheet}
            onToast={showToast}
            onLogout={handleLogout}
          />
        )}
        {top.name === "order" && (
          <OrderDetailScreen
            orderId={top.orderId}
            onBack={pop}
            onSheet={setSheet}
            onToast={showToast}
          />
        )}
        {top.name === "kyc" && (
          <KYCScreen onBack={pop} onSheet={setSheet} onToast={showToast} />
        )}
      </div>

      {/* Bottom Nav — only on tabs */}
      {top.name === "tabs" && <BottomNav tab={tab} setTab={setTab} />}

      {/* Bottom sheet */}
      {sheet && (
        <BottomSheet
          sheet={sheet}
          onClose={() => setSheet(null)}
          onDone={(msg) => {
            setSheet(null);
            showToast(msg);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 z-[60] glass px-4 py-2.5 text-sm font-medium glass-active screen-enter">
          <span className="text-[color:var(--cyan)] mr-2">●</span>{toast}
        </div>
      )}
    </div>
  );
}

/* ---------- Tab Shell ---------- */
function TabShell({
  tab, setTab, loading, onOrderTap, onOpenKYC, onSheet, onToast, onLogout,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  loading: boolean;
  onOrderTap: (id: string) => void;
  onOpenKYC: () => void;
  onSheet: (s: Sheet) => void;
  onToast: (m: string) => void;
  onLogout: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div key={tab} className="flex-1 overflow-y-auto no-scrollbar pb-28 tab-enter">
        {tab === "ops" && <LiveOps loading={loading} onSheet={onSheet} />}
        {tab === "incidents" && (
          <IncidentFeed loading={loading} onOpenOrder={onOrderTap} onToast={onToast} />
        )}
        {tab === "orders" && <MissionControl loading={loading} onOrderTap={onOrderTap} />}
        {tab === "settings" && (
          <SettingsScreen onOpenKYC={onOpenKYC} onSheet={onSheet} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
}

/* ---------- Top Bar ---------- */
function TopBar() {
  return (
    <div className="px-5 pt-2 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[color:var(--cyan)] to-[color:var(--cyan)]/30 grid place-items-center shadow-[0_0_20px_var(--cyan-glow)]">
          <span className="font-mono font-bold text-[color:var(--primary-foreground)] text-sm">HZ</span>
        </div>
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">HOUSIZY · Admin</div>
          <button className="flex items-center gap-1 text-sm font-semibold tap-bounce">
            Bengaluru · All Hubs <ChevronDown size={14} className="text-[color:var(--text-dim)]" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="glass px-2.5 py-1.5 flex items-center gap-1.5 text-[11px]">
          <Lock size={12} className="text-[color:var(--success)]" />
          <span className="font-mono">2FA</span>
        </div>
        <div className="glass w-9 h-9 grid place-items-center relative tap-bounce">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[color:var(--alert)] text-[9px] grid place-items-center font-bold">6</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Live Ops ---------- */
function LiveOps({ loading, onSheet }: { loading: boolean; onSheet: (s: Sheet) => void }) {
  const [toggles, setToggles] = useState({ sla: true, surge: false, testFail: false });

  if (loading) return <LiveOpsSkeleton />;

  const confirmToggle = (key: keyof typeof toggles, label: string) =>
    onSheet({
      title: `Confirm: ${label}`,
      desc: `This will ${toggles[key] ? "disable" : "enable"} ${label.toLowerCase()} across all hubs in Bengaluru.`,
      confirmLabel: toggles[key] ? "Disable" : "Enable",
      tone: key === "testFail" ? "alert" : "primary",
      onConfirm: () => setToggles((p) => ({ ...p, [key]: !p[key] })),
    });

  // Mini bar-spark data per metric (deterministic, hand-tuned for feel)
  const sparks: Record<string, number[]> = {
    "Orders / Hour": [0.4, 0.55, 0.48, 0.7, 0.62, 0.85, 0.92],
    "SLA Hit Rate": [0.78, 0.82, 0.74, 0.86, 0.9, 0.88, 0.94],
    "Active Drivers": [0.5, 0.62, 0.58, 0.7, 0.66, 0.72, 0.74],
    "Revenue Today": [0.2, 0.32, 0.45, 0.6, 0.72, 0.84, 0.95],
    "Open Incidents": [0.3, 0.5, 0.4, 0.7, 0.55, 0.65, 0.6],
  };
  const iconFor: Record<string, React.ReactNode> = {
    "Orders / Hour": <Package size={12} />,
    "SLA Hit Rate": <Gauge size={12} />,
    "Active Drivers": <Truck size={12} />,
    "Revenue Today": <CreditCard size={12} />,
    "Open Incidents": <AlertTriangle size={12} />,
  };

  return (
    <div className="px-5 space-y-5">
      {/* Greeting + pulse */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] font-semibold">
            Wed · 9:41 IST
          </div>
          <h1 className="text-[26px] font-bold tracking-tight leading-[1.1] mt-1">
            Evening, Arjun.
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--text-dim)] mt-1">
            <span className="pulse-dot" /> All systems nominal · sync 2s
          </div>
        </div>
        <button className="glass w-10 h-10 grid place-items-center tap-bounce">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Signature Hero — bold orange command card */}
      <div
        className="relative overflow-hidden rounded-[22px] p-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.66 0.21 42) 0%, oklch(0.74 0.19 55) 55%, oklch(0.78 0.16 70) 100%)",
          boxShadow:
            "0 18px 40px -18px color-mix(in oklab, var(--cyan) 70%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        {/* decorative orbits */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full border border-white/15" />
        <div className="absolute -right-2 -bottom-14 w-52 h-52 rounded-full border border-white/10" />
        <div className="absolute right-8 top-6 w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_12px_2px_rgba(255,255,255,0.5)]" />

        <div className="relative flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] font-semibold opacity-85">
            Today's Pulse
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </div>
        </div>

        <div className="relative mt-4 flex items-end gap-4">
          <div>
            <div className="text-[11px] opacity-85 mb-1">Revenue · Today</div>
            <div className="font-mono text-[40px] leading-none font-extrabold tabular-nums">
              ₹18.4<span className="text-[22px] opacity-80">L</span>
            </div>
            <div className="text-[11px] mt-2 opacity-90 flex items-center gap-1.5">
              <span className="font-mono font-bold">▲ ₹2.1L</span>
              <span className="opacity-80">vs. yesterday</span>
            </div>
          </div>
          {/* mini bar chart */}
          <div className="ml-auto flex items-end gap-[3px] h-14">
            {[0.25, 0.38, 0.5, 0.42, 0.6, 0.72, 0.88, 0.78, 0.95].map((v, i) => (
              <div
                key={i}
                className="w-[6px] rounded-sm bg-white/85"
                style={{ height: `${v * 100}%`, opacity: 0.45 + v * 0.55 }}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-2">
          <HeroStat label="SLA Hit" value="94.2%" />
          <HeroStat label="Orders/h" value="147" />
          <HeroStat label="Drivers" value="62" />
        </div>
      </div>

      {/* KPI rail — horizontal scroll, signature look */}
      <div>
        <div className="flex items-end justify-between mb-2.5">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Key Signals</h2>
            <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-muted)]">
              5 metrics · last 7 ticks
            </div>
          </div>
          <button className="text-[11px] font-semibold text-[color:var(--cyan)] tap-bounce">
            View all →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {HERO_METRICS.map((m) => {
            const color =
              m.tone === "alert" ? "var(--alert)" : m.tone === "cyan" ? "var(--cyan)" : "var(--success)";
            const spark = sparks[m.label] ?? [0.4, 0.5, 0.6, 0.55, 0.7, 0.65, 0.8];
            return (
              <div
                key={m.label}
                className="glass shrink-0 w-[150px] p-3.5 flex flex-col gap-2 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: color }}
                />
                <div className="flex items-center justify-between mt-1">
                  <div
                    className="w-7 h-7 rounded-lg grid place-items-center"
                    style={{
                      background: `color-mix(in oklab, ${color} 16%, transparent)`,
                      color,
                    }}
                  >
                    {iconFor[m.label]}
                  </div>
                  <div className="flex items-end gap-[2px] h-6">
                    {spark.map((v, i) => (
                      <div
                        key={i}
                        className="w-[3px] rounded-sm"
                        style={{
                          height: `${Math.max(v * 100, 12)}%`,
                          background: color,
                          opacity: 0.35 + v * 0.55,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] font-semibold truncate">
                  {m.label}
                </div>
                <div
                  className="font-mono text-[22px] leading-none font-extrabold tabular-nums"
                  style={{
                    color: m.tone === "alert" ? "var(--alert)" : "var(--text)",
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="text-[10px] font-medium truncate"
                  style={{ color }}
                >
                  {m.delta}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hub heat map — Bengaluru ops grid */}
      <Section
        title="Hub Heat Map"
        subtitle="Bengaluru · live load by hub"
        action={
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-semibold text-[color:var(--text-muted)]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" />Low</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[color:var(--amber)]" />Med</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[color:var(--alert)]" />High</span>
          </div>
        }
      >
        {(() => {
          const maxOrders = Math.max(...HUBS.map((h) => h.activeOrders));
          const sorted = [...HUBS].sort((a, b) => b.activeOrders - a.activeOrders);
          return (
            <div className="grid grid-cols-2 gap-2.5">
              {sorted.map((h) => {
                const color =
                  h.load === "high"
                    ? "var(--alert)"
                    : h.load === "medium"
                    ? "var(--amber)"
                    : "var(--success)";
                const pct = Math.round((h.activeOrders / maxOrders) * 100);
                const circ = 2 * Math.PI * 18;
                const dash = (pct / 100) * circ;
                return (
                  <button
                    key={h.name}
                    className="glass p-3 text-left tap-bounce relative overflow-hidden"
                    style={{
                      borderColor: `color-mix(in oklab, ${color} 40%, var(--ops-border))`,
                    }}
                  >
                    {/* subtle corner glow */}
                    <div
                      className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-30 blur-2xl"
                      style={{ background: color }}
                    />
                    <div className="relative flex items-center gap-3">
                      {/* radial gauge */}
                      <div className="relative w-12 h-12 shrink-0">
                        <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="color-mix(in oklab, var(--text) 8%, transparent)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke={color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circ}`}
                          />
                        </svg>
                        <div
                          className="absolute inset-0 grid place-items-center font-mono text-[15px] font-bold leading-none"
                          style={{ color }}
                        >
                          {h.activeOrders}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-[color:var(--text-muted)]" />
                          <div className="text-[13px] font-semibold leading-none truncate">
                            {h.name}
                          </div>
                        </div>
                        <div className="text-[10px] text-[color:var(--text-muted)] mt-1">
                          {h.area} zone · {pct}% cap
                        </div>
                        <div
                          className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            background: `color-mix(in oklab, ${color} 16%, transparent)`,
                            color,
                          }}
                        >
                          <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                          {h.load}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </Section>

      {/* Business controls */}
      <Section title="Business Controls" subtitle="Platform-wide switches">
        <div className="space-y-2.5">
          <ControlRow
            icon={<Zap size={16} />}
            label="SLA Mode"
            value={toggles.sla ? "Express (60 min)" : "Standard"}
            on={toggles.sla}
            onTap={() => confirmToggle("sla", "SLA Mode")}
          />
          <ControlRow
            icon={<Flame size={16} />}
            label="Surge Pricing"
            value={toggles.surge ? "ON · East zone" : "OFF"}
            on={toggles.surge}
            tone="amber"
            onTap={() => confirmToggle("surge", "Surge Pricing")}
          />
          <ControlRow
            icon={<AlertTriangle size={16} />}
            label="Test Failure Mode"
            value={toggles.testFail ? "INJECTED" : "OFF"}
            on={toggles.testFail}
            tone="alert"
            onTap={() => confirmToggle("testFail", "Test Failure Mode")}
          />
        </div>
      </Section>

      {/* Activity */}
      <Section title="Recent Activity" subtitle="Last 10 events">
        <div className="glass p-1">
          {ACTIVITY.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-start gap-3 p-3 ${
                i < ACTIVITY.length - 1 ? "border-b border-[color:var(--ops-border)]" : ""
              }`}
            >
              <ActivityIcon type={a.type} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] leading-tight">{a.text}</div>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-muted)]">{a.time}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-white">
      <div className="text-[9.5px] uppercase tracking-[0.16em] opacity-80 font-semibold">
        {label}
      </div>
      <div className="font-mono text-[16px] font-bold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, { i: React.ReactNode; c: string }> = {
    order: { i: <Package size={12} />, c: "var(--cyan)" },
    driver: { i: <Truck size={12} />, c: "var(--success)" },
    sla: { i: <AlertTriangle size={12} />, c: "var(--alert)" },
    vendor: { i: <Building2 size={12} />, c: "var(--amber)" },
    system: { i: <Activity size={12} />, c: "var(--text-dim)" },
  };
  const m = map[type] ?? map.system;
  return (
    <div
      className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
      style={{ background: `color-mix(in oklab, ${m.c} 18%, transparent)`, color: m.c }}
    >
      {m.i}
    </div>
  );
}

function ControlRow({
  icon, label, value, on, onTap, tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  on: boolean;
  onTap: () => void;
  tone?: "primary" | "alert" | "amber";
}) {
  const color =
    tone === "alert" ? "var(--alert)" : tone === "amber" ? "var(--amber)" : "var(--cyan)";
  return (
    <button
      onClick={onTap}
      className={`glass w-full p-3.5 flex items-center gap-3 tap-bounce ${on ? "glass-active" : ""}`}
      style={on ? { boxShadow: `0 0 0 1px ${color}, 0 0 24px -6px ${color}` } : undefined}
    >
      <div
        className="w-9 h-9 rounded-xl grid place-items-center"
        style={{ background: `color-mix(in oklab, ${color} 22%, transparent)`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
      <div
        className="w-11 h-6 rounded-full p-0.5 transition-colors"
        style={{ background: on ? color : "color-mix(in oklab, white 12%, transparent)" }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white transition-transform"
          style={{ transform: on ? "translateX(20px)" : undefined }}
        />
      </div>
    </button>
  );
}

function Section({
  title, subtitle, children, action,
}: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2.5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-muted)]">{subtitle}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ---------- Incident Feed ---------- */
function IncidentFeed({
  loading, onOpenOrder, onToast,
}: { loading: boolean; onOpenOrder: (id: string) => void; onToast: (m: string) => void }) {
  const [filter, setFilter] = useState<"All" | Priority>("All");
  const [resolvedOpen, setResolvedOpen] = useState(false);

  if (loading) return <ListSkeleton />;

  const filtered = INCIDENTS.filter((i) => filter === "All" || i.priority === filter);

  return (
    <div className="px-5 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incident Feed</h1>
        <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
          {INCIDENTS.length} open · {RESOLVED_TODAY} resolved today
        </div>
      </div>

      <div className="glass p-1.5 grid grid-cols-4 gap-1.5">
        {(["All", "P1", "P2", "P3"] as const).map((f) => {
          const meta: Record<typeof f, { grad: string; solid: string; count: number; ring: string }> = {
            All: {
              grad: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              solid: "#1a1a1a",
              count: INCIDENTS.length,
              ring: "rgba(0,0,0,0.25)",
            },
            P1: {
              grad: "linear-gradient(135deg, #ff3b30 0%, #c41e3a 100%)",
              solid: "#ff3b30",
              count: INCIDENTS.filter((i) => i.priority === "P1").length,
              ring: "rgba(255,59,48,0.35)",
            },
            P2: {
              grad: "linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%)",
              solid: "#ff8a00",
              count: INCIDENTS.filter((i) => i.priority === "P2").length,
              ring: "rgba(255,138,0,0.35)",
            },
            P3: {
              grad: "linear-gradient(135deg, #ffc83d 0%, #ffa500 100%)",
              solid: "#ffa500",
              count: INCIDENTS.filter((i) => i.priority === "P3").length,
              ring: "rgba(255,165,0,0.3)",
            },
          } as const;
          const m = meta[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="relative py-2.5 rounded-xl text-xs font-bold tap-bounce overflow-hidden transition-all"
              style={{
                background: active ? m.grad : `color-mix(in oklab, ${m.solid} 10%, transparent)`,
                color: active ? "#fff" : m.solid,
                boxShadow: active
                  ? `0 6px 18px -6px ${m.ring}, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : `inset 0 0 0 1px color-mix(in oklab, ${m.solid} 22%, transparent)`,
                transform: active ? "translateY(-1px)" : undefined,
              }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="tracking-wide">{f}</span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full leading-none"
                  style={{
                    background: active ? "rgba(255,255,255,0.22)" : `color-mix(in oklab, ${m.solid} 18%, transparent)`,
                    color: active ? "#fff" : m.solid,
                  }}
                >
                  {m.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5">
        {filtered.map((inc) => (
          <IncidentCard key={inc.id} inc={inc} onOpen={() => onOpenOrder(inc.orderId)} onToast={onToast} />
        ))}
      </div>

      <button
        onClick={() => setResolvedOpen((o) => !o)}
        className="w-full glass p-3.5 flex items-center justify-between tap-bounce"
      >
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[color:var(--success)]" />
          <span className="text-sm font-medium">Resolved Today ({RESOLVED_TODAY})</span>
        </div>
        <ChevronDown
          size={16}
          className="text-[color:var(--text-muted)] transition-transform"
          style={{ transform: resolvedOpen ? "rotate(180deg)" : undefined }}
        />
      </button>
      {resolvedOpen && (
        <div className="space-y-1.5 screen-enter">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass p-3 flex items-center justify-between opacity-60">
              <div>
                <div className="text-xs font-medium">Stuck driver — HZY-481{`0${i}`}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">Resolved by Ananya · {i + 1}h ago</div>
              </div>
              <BadgeCheck size={14} className="text-[color:var(--success)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IncidentCard({
  inc, onOpen, onToast,
}: { inc: Incident; onOpen: () => void; onToast: (m: string) => void }) {
  const palette: Record<Priority, { from: string; to: string; solid: string; chip: string; label: string }> = {
    P1: { from: "#ff3b30", to: "#c41e3a", solid: "#ff3b30", chip: "#ffe5e3", label: "Critical" },
    P2: { from: "#ff8a00", to: "#ff5e00", solid: "#ff7a1a", chip: "#fff0dc", label: "High" },
    P3: { from: "#ffc83d", to: "#ffa500", solid: "#f59e0b", chip: "#fff4d6", label: "Watch" },
  };
  const p = palette[inc.priority];

  return (
    <div
      className="relative overflow-hidden rounded-2xl tap-bounce"
      style={{
        background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
        boxShadow: `0 10px 30px -12px color-mix(in oklab, ${p.solid} 55%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      {/* decorative orbs */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: "rgba(255,255,255,0.6)" }}
      />
      <div
        className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: "#000" }}
      />

      <div className="relative p-3.5">
        <div className="flex items-start gap-2.5 mb-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 4px 12px -4px rgba(0,0,0,0.25)",
            }}
          >
            {inc.priority === "P1" ? (
              <span className="pulse-dot alert" />
            ) : inc.priority === "P2" ? (
              <AlertTriangle size={16} style={{ color: p.solid }} />
            ) : (
              <CircleDot size={14} style={{ color: p.solid }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded tracking-wider"
                style={{ background: "rgba(0,0,0,0.85)", color: "#fff" }}
              >
                {inc.priority} · {p.label.toUpperCase()}
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.85)", color: "#1a1a1a" }}
              >
                {inc.id}
              </span>
            </div>
            <div className="text-[14px] font-bold mt-1.5 leading-tight text-white drop-shadow-sm">
              {inc.title}
            </div>
            <div className="text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>
              {inc.detail}
            </div>
            <div className="flex items-center gap-2.5 mt-2 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,0,0,0.22)" }}
              >
                <Package size={10} /> {inc.orderId}
              </span>
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,0,0,0.22)" }}
              >
                <Clock size={10} /> {inc.elapsedMin}m
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onToast(`Snoozed ${inc.id} for 15 min`)}
            className="text-[11px] py-2 rounded-lg font-semibold tap-bounce"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff", backdropFilter: "blur(6px)" }}
          >
            Snooze
          </button>
          <button
            onClick={onOpen}
            className="text-[11px] py-2 rounded-lg font-bold tap-bounce"
            style={{ background: "#fff", color: p.solid, boxShadow: "0 4px 10px -4px rgba(0,0,0,0.3)" }}
          >
            Open
          </button>
          <button
            onClick={() => onToast(`${inc.id} marked resolved`)}
            className="text-[11px] py-2 rounded-lg font-bold tap-bounce"
            style={{ background: "rgba(0,0,0,0.85)", color: "#fff" }}
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mission Control (mobile-first pipeline) ---------- */
const STAGE_META: Record<OrderStatus, { from: string; to: string; solid: string; label: string; emoji: string }> = {
  New:        { from: "#3b82f6", to: "#1e40af", solid: "#2563eb", label: "New",        emoji: "✨" },
  Accepted:   { from: "#8b5cf6", to: "#6d28d9", solid: "#7c3aed", label: "Accepted",   emoji: "✓" },
  Picking:    { from: "#ffc83d", to: "#ff8a00", solid: "#f59e0b", label: "Picking",    emoji: "◐" },
  Packed:     { from: "#ff8a00", to: "#ff5e00", solid: "#ff7a1a", label: "Packed",     emoji: "▣" },
  Dispatched: { from: "#06b6d4", to: "#0e7490", solid: "#0891b2", label: "Dispatched", emoji: "→" },
  Delivered:  { from: "#10b981", to: "#047857", solid: "#059669", label: "Delivered",  emoji: "★" },
  Cancelled:  { from: "#6b7280", to: "#374151", solid: "#4b5563", label: "Cancelled",  emoji: "×" },
};

function MissionControl({
  loading, onOrderTap,
}: { loading: boolean; onOrderTap: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [hub, setHub] = useState("All Hubs");
  const [activeStage, setActiveStage] = useState<OrderStatus | "All">("All");

  if (loading) return <ListSkeleton />;

  const stages: OrderStatus[] = ["New", "Accepted", "Picking", "Packed", "Dispatched", "Delivered", "Cancelled"];
  const hubMatch = (area: string) =>
    hub === "All Hubs" ||
    area.toLowerCase().includes(hub.toLowerCase()) ||
    (hub === "E-City" && area.includes("Electronic")) ||
    (hub === "HSR" && area.includes("HSR"));
  const visible = ORDERS.filter(
    (o) =>
      hubMatch(o.area) &&
      (query.trim() === "" ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.site.toLowerCase().includes(query.toLowerCase())),
  );
  const counts = stages.reduce<Record<OrderStatus, number>>((acc, s) => {
    acc[s] = visible.filter((o) => o.status === s).length;
    return acc;
  }, { New: 0, Accepted: 0, Picking: 0, Packed: 0, Dispatched: 0, Delivered: 0, Cancelled: 0 });
  const totalForBar = Math.max(1, stages.reduce((a, s) => a + counts[s], 0));
  const list = activeStage === "All" ? visible : visible.filter((o) => o.status === activeStage);
  const sortedList = [...list].sort((a, b) => {
    // open orders first by SLA urgency, closed at bottom
    const aClosed = a.status === "Delivered" || a.status === "Cancelled";
    const bClosed = b.status === "Delivered" || b.status === "Cancelled";
    if (aClosed !== bClosed) return aClosed ? 1 : -1;
    return a.slaMinutesLeft - b.slaMinutesLeft;
  });

  return (
    <div className="space-y-4">
      <div className="px-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
              {visible.length} of {ORDERS.length} orders · live pipeline
            </div>
          </div>
          <div
            className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
            style={{ background: "linear-gradient(135deg,#10b981,#047857)", color: "#fff" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </div>
        </div>

        <div className="glass flex items-center gap-2 px-3 py-2.5">
          <Search size={14} className="text-[color:var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID, customer, site…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--text-muted)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {["All Hubs", "Whitefield", "Koramangala", "HSR", "Indiranagar", "E-City"].map((h) => (
            <button
              key={h}
              onClick={() => setHub(h)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold tap-bounce transition-all ${
                hub === h
                  ? "text-white"
                  : "glass text-[color:var(--text-dim)]"
              }`}
              style={hub === h ? {
                background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)",
                boxShadow: "0 6px 14px -6px rgba(0,0,0,0.4)",
              } : undefined}
            >
              {h}
            </button>
          ))}
        </div>

        {/* PIPELINE FLOW — segmented proportional bar */}
        <div
          className="relative overflow-hidden rounded-2xl p-3.5"
          style={{
            background: "linear-gradient(135deg,#0f0f10 0%,#1a1a1f 100%)",
            boxShadow: "0 10px 26px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/70">
              Pipeline Flow
            </div>
            <div className="text-[10px] font-mono text-white/50">{visible.length} active</div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            {stages.map((s) => {
              const w = (counts[s] / totalForBar) * 100;
              if (w === 0) return null;
              const m = STAGE_META[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveStage(s)}
                  className="h-full transition-all hover:opacity-90"
                  style={{
                    width: `${w}%`,
                    background: `linear-gradient(90deg, ${m.from}, ${m.to})`,
                  }}
                  title={`${s}: ${counts[s]}`}
                />
              );
            })}
          </div>
          <div className="flex gap-1.5 mt-2.5 text-[9px] font-mono text-white/55 overflow-x-auto no-scrollbar">
            {stages.filter((s) => counts[s] > 0).map((s) => {
              const m = STAGE_META[s];
              return (
                <div key={s} className="flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.solid }} />
                  <span>{s} {counts[s]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE CHIPS — fully colored selector */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-5 px-5">
          {(["All", ...stages] as const).map((s) => {
            const active = activeStage === s;
            const m = s === "All" ? null : STAGE_META[s];
            const count = s === "All" ? visible.length : counts[s];
            return (
              <button
                key={s}
                onClick={() => setActiveStage(s)}
                className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold tap-bounce transition-all flex items-center gap-1.5"
                style={{
                  background: active
                    ? (m ? `linear-gradient(135deg, ${m.from}, ${m.to})` : "linear-gradient(135deg,#1a1a1a,#2d2d2d)")
                    : (m ? `color-mix(in oklab, ${m.solid} 10%, transparent)` : "rgba(0,0,0,0.04)"),
                  color: active ? "#fff" : (m ? m.solid : "#1a1a1a"),
                  boxShadow: active
                    ? `0 6px 16px -6px ${m ? m.solid : "#000"}55, inset 0 1px 0 rgba(255,255,255,0.18)`
                    : `inset 0 0 0 1px color-mix(in oklab, ${m ? m.solid : "#000"} 18%, transparent)`,
                  transform: active ? "translateY(-1px)" : undefined,
                }}
              >
                <span>{s}</span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full leading-none"
                  style={{
                    background: active ? "rgba(255,255,255,0.22)" : `color-mix(in oklab, ${m ? m.solid : "#000"} 16%, transparent)`,
                    color: active ? "#fff" : (m ? m.solid : "#1a1a1a"),
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ORDER LIST — fully colored cards, urgency-sorted */}
      <div className="px-5 space-y-2.5">
        {sortedList.length === 0 && (
          <div className="glass p-6 text-center text-[12px] text-[color:var(--text-muted)]">
            No orders in this stage
          </div>
        )}
        {sortedList.map((o) => (
          <BigOrderCard key={o.id} order={o} onTap={() => onOrderTap(o.id)} />
        ))}
      </div>
    </div>
  );
}

function BigOrderCard({ order, onTap }: { order: Order; onTap: () => void }) {
  const stage = STAGE_META[order.status];
  const closed = order.status === "Delivered" || order.status === "Cancelled";

  // SLA ring
  const slaTotal = 60;
  const slaLeft = Math.max(0, order.slaMinutesLeft);
  const pct = Math.min(1, slaLeft / slaTotal);
  const urgent = !closed && slaLeft > 0 && slaLeft < 15;
  const slaColor = closed
    ? "#9ca3af"
    : slaLeft <= 0
    ? "#ff3b30"
    : slaLeft < 15
    ? "#ff3b30"
    : slaLeft < 30
    ? "#ff8a00"
    : "#10b981";

  // Card uses stage gradient for open orders; muted for closed
  const cardBg = closed
    ? "linear-gradient(135deg, #f5f5f5 0%, #ececec 100%)"
    : `linear-gradient(135deg, ${stage.from} 0%, ${stage.to} 100%)`;
  const fg = closed ? "#1a1a1a" : "#fff";

  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <button
      onClick={onTap}
      className="relative overflow-hidden rounded-2xl w-full text-left tap-bounce"
      style={{
        background: cardBg,
        boxShadow: closed
          ? "0 4px 14px -6px rgba(0,0,0,0.15)"
          : `0 12px 28px -14px color-mix(in oklab, ${stage.solid} 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      {!closed && (
        <>
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none"
            style={{ background: "#fff" }}
          />
          <div
            className="absolute -bottom-14 -left-10 w-28 h-28 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ background: "#000" }}
          />
        </>
      )}

      <div className="relative p-3.5 flex items-center gap-3">
        {/* SLA RING */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg width="48" height="48" className="-rotate-90">
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke={closed ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.25)"}
              strokeWidth="3.5"
            />
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke={closed ? "#9ca3af" : "#fff"}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              style={{ transition: "stroke-dasharray 0.4s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[12px] font-extrabold leading-none" style={{ color: fg }}>
              {closed ? "—" : slaLeft > 0 ? slaLeft : "!"}
            </div>
            <div className="text-[7px] uppercase tracking-wider opacity-80 leading-none mt-0.5" style={{ color: fg }}>
              {closed ? "done" : "min"}
            </div>
          </div>
          {urgent && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: "#ff3b30", border: "1.5px solid #fff" }}
            />
          )}
        </div>

        {/* MAIN */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded tracking-wider"
              style={{
                background: closed ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.78)",
                color: closed ? "#4b5563" : "#fff",
              }}
            >
              {order.id}
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{
                background: closed ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.92)",
                color: closed ? "#6b7280" : stage.solid,
              }}
            >
              {stage.label}
            </span>
          </div>
          <div className="text-[14px] font-bold mt-1 leading-tight truncate" style={{ color: fg }}>
            {order.customer}
          </div>
          <div className="text-[11px] truncate mt-0.5" style={{ color: closed ? "#6b7280" : "rgba(255,255,255,0.85)" }}>
            <MapPin size={9} className="inline mr-1 -mt-0.5" />
            {order.area}
          </div>
        </div>

        {/* AMOUNT */}
        <div className="flex-shrink-0 text-right">
          <div
            className="text-[15px] font-extrabold tracking-tight leading-none"
            style={{ color: fg }}
          >
            ₹{(order.amount / 1000).toFixed(1)}k
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider mt-1 opacity-80" style={{ color: fg }}>
            {order.placedAt}
          </div>
          {!closed && (
            <div
              className="inline-flex items-center gap-0.5 mt-1.5 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider"
              style={{
                background: slaColor === "#10b981" ? "rgba(255,255,255,0.95)" : slaColor,
                color: slaColor === "#10b981" ? "#10b981" : "#fff",
              }}
            >
              {slaLeft <= 0 ? "Breached" : slaLeft < 15 ? "At Risk" : slaLeft < 30 ? "Tight" : "On Time"}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ---------- Order Detail ---------- */
function OrderDetailScreen({
  orderId, onBack, onSheet, onToast,
}: {
  orderId: string;
  onBack: () => void;
  onSheet: (s: Sheet) => void;
  onToast: (m: string) => void;
}) {
  const order = ORDERS.find((o) => o.id === orderId) ?? ORDERS[0];
  const steps: OrderStatus[] = ["Accepted", "Picking", "Packed", "Dispatched", "Delivered"];
  const currentIdx = steps.findIndex((s) => s === order.status);
  const progress = order.status === "New" ? 0.05 : (currentIdx + 1) / steps.length;

  return (
    <div className="h-full flex flex-col screen-enter">
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="glass w-9 h-9 grid place-items-center tap-bounce">
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-muted)]">
            Order Detail
          </div>
          <div className="font-mono font-bold text-sm">{order.id}</div>
        </div>
        <button className="glass w-9 h-9 grid place-items-center tap-bounce">
          <Headphones size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 space-y-4">
        {/* Header */}
        <div className="glass p-4 glass-active">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-semibold">{order.customer}</div>
              <div className="text-[11px] text-[color:var(--text-dim)]">{order.company}</div>
              <div className="flex items-center gap-1 text-[11px] text-[color:var(--text-muted)] mt-1.5">
                <MapPin size={11} /> {order.site}
              </div>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                background: "color-mix(in oklab, var(--cyan) 20%, transparent)",
                color: "var(--cyan)",
              }}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, var(--cyan), color-mix(in oklab, var(--cyan) 30%, white))",
                boxShadow: "0 0 12px var(--cyan-glow)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-[color:var(--text-muted)]">
            <span>Placed {order.placedAt}</span>
            <span>
              SLA {order.slaMinutesLeft > 0 ? `${order.slaMinutesLeft}m left` : "Closed"}
            </span>
          </div>
        </div>

        {/* Timeline — bold gradient */}
        <Section title="Live Tracking" subtitle="6-step timeline">
          <div
            className="relative overflow-hidden rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, #0f0f10 0%, #1c1c1f 60%, #2a1a0a 100%)",
              boxShadow: "0 12px 32px -14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-40 blur-3xl pointer-events-none"
              style={{ background: "#ff7a1a" }}
            />
            <div
              className="absolute -bottom-20 -left-10 w-44 h-44 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ background: "#ffc83d" }}
            />
            <div className="relative space-y-3">
              {steps.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-full grid place-items-center transition-all"
                        style={{
                          background: done
                            ? "linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%)"
                            : "rgba(255,255,255,0.06)",
                          color: done ? "#fff" : "rgba(255,255,255,0.45)",
                          boxShadow: active
                            ? "0 0 0 4px rgba(255,138,0,0.25), 0 6px 16px -4px rgba(255,94,0,0.6)"
                            : done
                            ? "0 4px 12px -4px rgba(255,94,0,0.45)"
                            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                        }}
                      >
                        {done ? <Check size={15} strokeWidth={3} /> : <span className="text-[11px] font-mono">{i + 1}</span>}
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className="absolute left-1/2 top-8 w-0.5 h-4 -translate-x-1/2 rounded-full"
                          style={{
                            background: done
                              ? "linear-gradient(180deg, #ff5e00, rgba(255,94,0,0.2))"
                              : "rgba(255,255,255,0.08)",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${active ? "font-bold text-white" : done ? "font-semibold text-white/90" : "font-medium text-white/50"}`}>
                        {s}
                      </div>
                      <div className="text-[10px] font-mono text-white/45 mt-0.5">
                        {done ? `Done · ${10 + i * 4}:${20 + i * 3} AM` : "Pending"}
                      </div>
                    </div>
                    {active && (
                      <span
                        className="text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider"
                        style={{
                          background: "linear-gradient(135deg, #ff8a00, #ff5e00)",
                          color: "#fff",
                          boxShadow: "0 4px 12px -4px rgba(255,94,0,0.6)",
                        }}
                      >
                        ● Live
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Driver & Vendor — bold colored cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* DRIVER CARD */}
          <div
            className="relative overflow-hidden rounded-2xl p-3.5"
            style={{
              background: "linear-gradient(140deg, #ff8a00 0%, #ff5e00 60%, #c41e3a 100%)",
              boxShadow: "0 14px 32px -14px rgba(255,94,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-35 blur-2xl pointer-events-none"
              style={{ background: "#fff" }}
            />
            <div
              className="absolute -bottom-12 -left-8 w-24 h-24 rounded-full opacity-25 blur-2xl pointer-events-none"
              style={{ background: "#000" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-extrabold tracking-[0.18em] px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.85)", color: "#fff" }}
                >
                  DRIVER
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: "rgba(255,255,255,0.95)", color: "#16a34a" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-2.5">
                <img
                  src={driverPhoto}
                  alt={order.driver.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  style={{
                    border: "2.5px solid #fff",
                    boxShadow: "0 6px 14px -4px rgba(0,0,0,0.35)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[14px] text-white leading-tight truncate drop-shadow-sm">
                    {order.driver.name}
                  </div>
                  <div className="font-mono text-[10px] text-white/90 truncate">{order.driver.phone}</div>
                </div>
              </div>

              <div
                className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg"
                style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.95)" }}
              >
                <MapPin size={10} />
                <span className="truncate">{order.driver.gps}</span>
                <span className="opacity-70">· {order.driver.lastPing}</span>
              </div>

              <button
                onClick={() => onToast(`Calling ${order.driver.name}…`)}
                className="mt-2.5 w-full text-[12px] py-2 rounded-xl flex items-center justify-center gap-1.5 tap-bounce font-bold"
                style={{
                  background: "#fff",
                  color: "#ff5e00",
                  boxShadow: "0 6px 14px -4px rgba(0,0,0,0.3)",
                }}
              >
                <Phone size={12} strokeWidth={2.5} /> Call Driver
              </button>
            </div>
          </div>

          {/* VENDOR CARD */}
          <div
            className="relative overflow-hidden rounded-2xl p-3.5"
            style={{
              background: "linear-gradient(140deg, #1a1a1a 0%, #2d2d2d 55%, #3d2a14 100%)",
              boxShadow: "0 14px 32px -14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: "#ffa500" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-extrabold tracking-[0.18em] px-1.5 py-0.5 rounded"
                  style={{ background: "linear-gradient(135deg, #ffc83d, #ffa500)", color: "#1a1a1a" }}
                >
                  VENDOR
                </span>
                <Building2 size={12} className="text-white/70" />
              </div>

              <div className="mt-2.5 flex items-center gap-2.5">
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center flex-shrink-0 font-extrabold text-[16px]"
                  style={{
                    background: "linear-gradient(135deg, #ffc83d, #ff8a00)",
                    color: "#1a1a1a",
                    boxShadow: "0 6px 14px -4px rgba(255,138,0,0.5)",
                  }}
                >
                  {order.vendor.hub.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[14px] text-white leading-tight truncate">
                    {order.vendor.hub}
                  </div>
                  <div className="text-[10px] text-white/60 mt-0.5">Fulfillment Hub</div>
                </div>
              </div>

              <div className="mt-2.5 space-y-1">
                <div
                  className="flex justify-between items-center text-[10px] px-2 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)" }}
                >
                  <span className="uppercase tracking-wider font-semibold text-white/60">Accepted</span>
                  <span className="font-mono font-bold" style={{ color: "#ffc83d" }}>{order.vendor.acceptedAt}</span>
                </div>
                <div
                  className="flex justify-between items-center text-[10px] px-2 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)" }}
                >
                  <span className="uppercase tracking-wider font-semibold text-white/60">Picked</span>
                  <span className="font-mono font-bold" style={{ color: "#ffc83d" }}>{order.vendor.pickedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <Section title="Items" subtitle={`${order.items.length} line items`}>
          <div className="glass p-1">
            {order.items.map((it, i) => (
              <div
                key={it.name}
                className={`flex items-center justify-between p-3 ${
                  i < order.items.length - 1 ? "border-b border-[color:var(--ops-border)]" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{it.name}</div>
                  <div className="text-[10px] font-mono text-[color:var(--text-muted)]">
                    {it.qty} × ₹{it.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold">
                  ₹{(it.qty * it.price).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
            <div className="p-3 border-t border-[color:var(--ops-border)] flex justify-between items-center">
              <div>
                <div className="text-[10px] text-[color:var(--text-muted)] uppercase">Total · incl. 18% GST</div>
                <div className="font-mono text-lg font-bold text-[color:var(--cyan)] glow-cyan">
                  ₹{order.amount.toLocaleString("en-IN")}
                </div>
              </div>
              <FileText size={18} className="text-[color:var(--text-muted)]" />
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[color:var(--ops-bg)] via-[color:var(--ops-bg)]/95 to-transparent">
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn
            icon={<Truck size={13} />}
            label="Reassign Driver"
            onClick={() =>
              onSheet({
                title: "Reassign Driver",
                desc: `Reassign HZY-${order.id.split("-")[1]} to the nearest available driver in ${order.area}.`,
                confirmLabel: "Reassign",
                onConfirm: () => onToast("Driver reassigned · Manoj P."),
              })
            }
          />
          <ActionBtn
            icon={<CreditCard size={13} />}
            label="Issue Refund"
            tone="alert"
            onClick={() =>
              onSheet({
                title: "Issue Refund",
                desc: `Refund ₹${order.amount.toLocaleString("en-IN")} to ${order.company}? This cannot be undone.`,
                confirmLabel: "Refund",
                tone: "alert",
                onConfirm: () => onToast("Refund initiated"),
              })
            }
          />
          <ActionBtn
            icon={<Plus size={13} />}
            label="Apply Credit"
            onClick={() =>
              onSheet({
                title: "Apply Credit",
                desc: `Add ₹2,500 goodwill credit to ${order.company}'s account.`,
                confirmLabel: "Apply",
                onConfirm: () => onToast("₹2,500 credit applied"),
              })
            }
          />
          <ActionBtn
            icon={<Radio size={13} />}
            label="Escalate"
            tone="amber"
            onClick={() =>
              onSheet({
                title: "Escalate to L2",
                desc: "Escalate this order to the L2 Operations team for immediate intervention.",
                confirmLabel: "Escalate",
                tone: "amber",
                onConfirm: () => onToast("Escalated to L2 Ops"),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon, label, onClick, tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "primary" | "alert" | "amber";
}) {
  const color =
    tone === "alert" ? "var(--alert)" : tone === "amber" ? "var(--amber)" : "var(--cyan)";
  return (
    <button
      onClick={onClick}
      className="glass py-2.5 px-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold tap-bounce"
      style={{
        background: `color-mix(in oklab, ${color} 16%, var(--ops-surface))`,
        color,
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------- KYC ---------- */
function KYCScreen({
  onBack, onSheet, onToast,
}: { onBack: () => void; onSheet: (s: Sheet) => void; onToast: (m: string) => void }) {
  const [tab, setTab] = useState<"pending" | "active">("pending");
  const [open, setOpen] = useState<string | null>(null);
  const list = KYC_VENDORS.filter((v) => v.status === tab);

  return (
    <div className="h-full flex flex-col screen-enter">
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="glass w-9 h-9 grid place-items-center tap-bounce">
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-muted)]">Vendor</div>
          <div className="font-bold text-sm">KYC Approvals</div>
        </div>
        <ShieldCheck size={16} className="text-[color:var(--success)]" />
      </div>
      <div className="px-5">
        <div className="glass p-1 grid grid-cols-2 gap-1">
          {(["pending", "active"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 rounded-xl text-xs font-semibold capitalize ${
                tab === t
                  ? "bg-[color:var(--cyan)] text-[color:var(--primary-foreground)]"
                  : "text-[color:var(--text-dim)]"
              }`}
            >
              {t} ({KYC_VENDORS.filter((v) => v.status === t).length})
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-10 space-y-2.5">
        {list.map((v) => (
          <KYCRow
            key={v.id}
            v={v}
            open={open === v.id}
            onToggle={() => setOpen(open === v.id ? null : v.id)}
            onApprove={() =>
              onSheet({
                title: "Approve Vendor",
                desc: `Approve ${v.name} for onboarding? They will receive credentials via SMS.`,
                confirmLabel: "Approve",
                onConfirm: () => onToast(`${v.name} approved`),
              })
            }
            onReject={() =>
              onSheet({
                title: "Reject Vendor",
                desc: `Reject ${v.name}? Pick a reason: Documents unclear / GSTIN mismatch / Outside service area.`,
                confirmLabel: "Reject",
                tone: "alert",
                onConfirm: () => onToast(`${v.name} rejected`),
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function KYCRow({
  v, open, onToggle, onApprove, onReject,
}: {
  v: VendorKYC;
  open: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="glass">
      <button onClick={onToggle} className="w-full p-3.5 flex items-center gap-3 text-left tap-bounce">
        <div className="w-10 h-10 rounded-xl bg-black/[0.04] grid place-items-center">
          <Building2 size={16} className="text-[color:var(--cyan)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{v.name}</div>
          <div className="text-[11px] text-[color:var(--text-muted)] truncate">{v.businessType}</div>
          <div className="text-[10px] font-mono text-[color:var(--text-dim)] mt-0.5">
            {v.submitted} · {v.docsCount} docs
          </div>
        </div>
        {v.status === "active" ? (
          <BadgeCheck size={16} className="text-[color:var(--success)]" />
        ) : (
          <ChevronDown
            size={14}
            className="transition-transform"
            style={{ transform: open ? "rotate(180deg)" : undefined }}
          />
        )}
      </button>
      {open && v.status === "pending" && (
        <div className="px-3.5 pb-3.5 space-y-3 screen-enter border-t border-[color:var(--ops-border)] pt-3">
          <Detail label="GSTIN" value={v.gstin} />
          <Detail label="PAN" value={v.pan} />
          <Detail label="Warehouse" value={v.address} />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)] mb-1.5">
              Documents
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {["GST", "PAN", "Lease", "Photo", "Bank"].map((d) => (
                <div
                  key={d}
                  className="aspect-square rounded-lg bg-black/[0.04] grid place-items-center flex-col gap-1"
                >
                  <Eye size={12} className="text-[color:var(--text-muted)]" />
                  <span className="text-[9px] font-mono text-[color:var(--text-dim)]">{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onReject}
              className="py-2 rounded-lg text-xs font-semibold tap-bounce"
              style={{
                background: "color-mix(in oklab, var(--alert) 18%, transparent)",
                color: "var(--alert)",
              }}
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="py-2 rounded-lg text-xs font-semibold tap-bounce"
              style={{
                background: "color-mix(in oklab, var(--success) 22%, transparent)",
                color: "var(--success)",
              }}
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)] pt-0.5">{label}</div>
      <div className="font-mono text-[11px] text-right text-[color:var(--text-dim)]">{value}</div>
    </div>
  );
}

/* ---------- Profile & Settings ---------- */
function SettingsScreen({
  onOpenKYC, onSheet, onLogout,
}: { onOpenKYC: () => void; onSheet: (s: Sheet) => void; onLogout: () => void }) {
  const [t, setT] = useState({ maint: false, onboard: true, express: true });
  return (
    <div className="px-5 space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      {/* HERO PROFILE CARD — bold gradient */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(140deg, #1a1a1a 0%, #2d2d2d 50%, #3d2010 100%)",
          boxShadow: "0 18px 40px -16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ background: "#ff7a1a" }}
        />
        <div
          className="absolute -bottom-20 -left-12 w-44 h-44 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "#ffc83d" }}
        />

        <div className="relative p-5">
          {/* avatar + name */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={profilePhoto}
                alt="Ananya Krishnan"
                width={68}
                height={68}
                loading="lazy"
                className="w-[68px] h-[68px] rounded-2xl object-cover"
                style={{
                  border: "3px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 10px 24px -8px rgba(0,0,0,0.5)",
                }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full grid place-items-center"
                style={{
                  background: "linear-gradient(135deg, #10b981, #047857)",
                  border: "2.5px solid #1a1a1a",
                }}
              >
                <ShieldCheck size={11} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[18px] font-bold text-white leading-tight">Ananya Krishnan</div>
              <div className="text-[11px] text-white/70 mt-0.5">Operations Lead</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                  style={{ background: "linear-gradient(135deg,#ffc83d,#ff8a00)", color: "#1a1a1a" }}
                >
                  Admin
                </span>
                <span className="text-[10px] font-mono text-white/60 flex items-center gap-1">
                  <MapPin size={9} /> Bengaluru
                </span>
              </div>
            </div>
          </div>

          {/* stat row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Shifts", value: "248", accent: "#ffc83d" },
              { label: "Resolved", value: "1.2k", accent: "#10b981" },
              { label: "Uptime", value: "99.4%", accent: "#06b6d4" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
              >
                <div className="text-[16px] font-extrabold tracking-tight" style={{ color: s.accent }}>
                  {s.value}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-white/55 font-semibold mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* security */}
          <div
            className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <div className="flex items-center gap-2">
              <Lock size={12} className="text-[#10b981]" />
              <span className="text-[11px] font-semibold text-white">2FA Enabled</span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#10b981] font-bold">
              Secure
            </span>
          </div>
        </div>
      </div>

      {/* PLATFORM TOGGLES — color-coded cards */}
      <div className="space-y-2.5">
        <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-[color:var(--text-muted)] px-1">
          Platform Toggles
        </div>
        <ToggleCard
          icon={<Wrench size={16} />}
          label="Maintenance Mode"
          desc="Pause all new orders"
          on={t.maint}
          gradient="linear-gradient(135deg, #ff3b30 0%, #c41e3a 100%)"
          solid="#ff3b30"
          onTap={() =>
            onSheet({
              title: "Toggle Maintenance Mode",
              desc: "This will pause all new orders across Bengaluru.",
              confirmLabel: t.maint ? "Disable" : "Enable",
              tone: "alert",
              onConfirm: () => setT((p) => ({ ...p, maint: !p.maint })),
            })
          }
        />
        <ToggleCard
          icon={<Building2 size={16} />}
          label="Vendor Onboarding"
          desc={t.onboard ? "Accepting new KYC" : "Paused"}
          on={t.onboard}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
          solid="#7c3aed"
          onTap={() =>
            onSheet({
              title: "Toggle Onboarding",
              desc: "Allow new vendors to submit KYC applications.",
              confirmLabel: t.onboard ? "Pause" : "Open",
              onConfirm: () => setT((p) => ({ ...p, onboard: !p.onboard })),
            })
          }
        />
        <ToggleCard
          icon={<Zap size={16} />}
          label="Express Delivery"
          desc={t.express ? "Active · all 6 hubs" : "Disabled"}
          on={t.express}
          gradient="linear-gradient(135deg, #ff8a00 0%, #ff5e00 100%)"
          solid="#ff7a1a"
          onTap={() =>
            onSheet({
              title: "Toggle Express Zone",
              desc: "Express 60-min delivery promise across all active hubs.",
              confirmLabel: t.express ? "Disable" : "Enable",
              onConfirm: () => setT((p) => ({ ...p, express: !p.express })),
            })
          }
        />
      </div>

      {/* OPERATIONS — clean grouped list */}
      <div className="space-y-2.5">
        <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-[color:var(--text-muted)] px-1">
          Operations
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 6px 18px -10px rgba(0,0,0,0.15), inset 0 0 0 1px var(--ops-border)",
          }}
        >
          <SettingsRow
            icon={<Shield size={14} />}
            iconBg="linear-gradient(135deg,#ffc83d,#ff8a00)"
            iconColor="#fff"
            label="Vendor KYC Approvals"
            badge="3 pending"
            badgeColor="#ff7a1a"
            onTap={onOpenKYC}
          />
          <SettingsRow
            icon={<Gauge size={14} />}
            iconBg="linear-gradient(135deg,#06b6d4,#0e7490)"
            iconColor="#fff"
            label="Audit Logs"
            sub="Last 30 days"
            onTap={() =>
              onSheet({
                title: "Open Audit Logs",
                desc: "View the last 30 days of admin actions, toggles, and overrides.",
                confirmLabel: "Open",
                onConfirm: () => {},
              })
            }
          />
          <SettingsRow
            icon={<Power size={14} />}
            iconBg="linear-gradient(135deg,#1a1a1a,#3d3d3d)"
            iconColor="#fff"
            label="API Keys & Webhooks"
            sub="Rotate · revoke · generate"
            onTap={() =>
              onSheet({
                title: "Manage API Keys",
                desc: "Rotate, revoke, or generate new API keys and webhook secrets.",
                confirmLabel: "Manage",
                onConfirm: () => {},
              })
            }
          />
        </div>
      </div>

      {/* LOG OUT — full red gradient */}
      <button
        onClick={() =>
          onSheet({
            title: "Log out",
            desc: "You will be signed out from this device. 2FA will be required on next login.",
            confirmLabel: "Log out",
            tone: "alert",
            onConfirm: onLogout,
          })
        }
        className="w-full relative overflow-hidden rounded-2xl p-3.5 flex items-center justify-center gap-2 tap-bounce"
        style={{
          background: "linear-gradient(135deg, #ff3b30 0%, #c41e3a 100%)",
          boxShadow: "0 12px 28px -12px rgba(255,59,48,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
          color: "#fff",
        }}
      >
        <LogOut size={15} strokeWidth={2.5} />
        <span className="text-sm font-bold tracking-wide">Log out</span>
      </button>

      <div className="text-center text-[10px] font-mono text-[color:var(--text-muted)] pt-1 pb-2">
        HOUSIZY Admin · v4.2.1 · build 20260527
      </div>
    </div>
  );
}

/* ---------- Login Screen ---------- */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"email" | "pin">("email");
  const [email, setEmail] = useState("admin@housizy.com");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);

  const DEMO_PW = "housizy2024";
  const DEMO_PIN = "2024";

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleEmailSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    setError(null);
    const emailOk = /.+@.+\..+/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid email address");
      triggerShake();
      return;
    }
    if (password.length < 4) {
      setError("Password is too short");
      triggerShake();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      if (password === DEMO_PW) {
        onLogin();
      } else {
        setError("Incorrect password. Try housizy2024");
        setSubmitting(false);
        triggerShake();
      }
    }, 600);
  };

  const handleDigit = (d: string) => {
    if (pin.length < 4) {
      const next = pin + d;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === DEMO_PIN) {
            onLogin();
          } else {
            triggerShake();
            setPin("");
            setError("Wrong PIN. Hint: 2024");
            setTimeout(() => setError(null), 1800);
          }
        }, 150);
      }
    }
  };
  const handleBack = () => setPin((p) => p.slice(0, -1));

  const handleBiometric = () => {
    setSubmitting(true);
    setError(null);
    setTimeout(() => onLogin(), 700);
  };

  return (
    <div className="iphone-screen flex flex-col text-white relative overflow-hidden" style={{ background: "#0a0a0a" }}>
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, #ff8a00 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-40 -right-24 w-80 h-80 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, #e8482c 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 left-10 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.45) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* Status bar */}
      <div className="relative flex items-center justify-between px-7 pt-4 pb-2 text-[12px] font-medium font-mono text-white/70">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="opacity-80">5G</span>
          <span className="inline-block w-6 h-3 border border-white/40 rounded-[3px] relative">
            <span className="absolute inset-[2px] bg-white/60 rounded-[1px]" />
          </span>
        </span>
      </div>

      <div className="relative flex-1 flex flex-col px-6 pt-6 pb-4 overflow-y-auto no-scrollbar">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.66 0.21 42) 0%, oklch(0.74 0.19 55) 55%, oklch(0.78 0.16 70) 100%)",
              boxShadow: "0 12px 30px -10px rgba(255,138,0,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <span className="font-mono font-bold text-white text-[15px]">HZ</span>
          </div>
          <div>
            <div className="text-white text-[15px] font-bold tracking-tight">HOUSIZY</div>
            <div className="text-white/45 text-[10.5px] uppercase tracking-[0.18em]">Admin Console</div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-white text-[26px] font-bold tracking-tight leading-[1.1]">
          Welcome back,<br />
          <span style={{
            background: "linear-gradient(90deg, #ff8a00, #ffb24a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Operator.
          </span>
        </h1>
        <p className="text-white/55 text-[12.5px] mt-2 leading-snug">
          Sign in to access live ops, incidents and dispatch.
        </p>

        {/* Mode toggle */}
        <div
          className="mt-6 flex gap-1 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {(["email", "pin"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className="flex-1 py-2 rounded-xl text-[12.5px] font-semibold transition-all tap-bounce"
              style={{
                background: mode === m ? "linear-gradient(135deg, #ff8a00, #e8482c)" : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: mode === m ? "0 8px 20px -8px rgba(255,138,0,0.55)" : undefined,
              }}
            >
              {m === "email" ? "Email & Password" : "Quick PIN"}
            </button>
          ))}
        </div>

        {mode === "email" ? (
          <form onSubmit={handleEmailSubmit} className={`mt-5 space-y-3 ${shake ? "animate-shake" : ""}`}>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <User size={16} className="text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@housizy.com"
                className="flex-1 bg-transparent outline-none text-white text-[14px] placeholder:text-white/30"
                autoComplete="email"
              />
            </div>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Lock size={16} className="text-white/50" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 bg-transparent outline-none text-white text-[14px] placeholder:text-white/30"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-white/45 hover:text-white/80 tap-bounce"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <Eye size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="flex items-center gap-2 text-[12px] text-white/70 tap-bounce"
              >
                <span
                  className="w-4 h-4 rounded-md grid place-items-center transition-all"
                  style={{
                    background: remember ? "linear-gradient(135deg, #ff8a00, #e8482c)" : "rgba(255,255,255,0.08)",
                    border: remember ? "none" : "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {remember && <Check size={11} className="text-white" strokeWidth={3} />}
                </span>
                Remember me
              </button>
              <button type="button" className="text-[12px] text-white/70 hover:text-white tap-bounce">
                Forgot?
              </button>
            </div>

            {error && (
              <div
                className="rounded-xl px-3 py-2 text-[12px] flex items-center gap-2"
                style={{ background: "rgba(255,59,48,0.12)", color: "#ff8a82", border: "1px solid rgba(255,59,48,0.25)" }}
              >
                <AlertTriangle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-2xl text-white text-[14px] font-bold tap-bounce relative overflow-hidden mt-1 disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #ff8a00 0%, #e8482c 100%)",
                boxShadow: "0 14px 30px -10px rgba(255,138,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={16} />
                  Sign in securely
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10.5px] text-white/35 uppercase tracking-[0.18em]">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleBiometric}
              className="w-full h-12 rounded-2xl text-white text-[13px] font-semibold tap-bounce flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Shield size={15} className="text-[#7dd3fc]" />
              Continue with Face ID
            </button>

            <p className="text-center text-[11px] text-white/35 pt-1 font-mono">
              demo · admin@housizy.com / housizy2024
            </p>
          </form>
        ) : (
          <div className="mt-7 flex flex-col items-center">
            <p className="text-white/55 text-[12.5px]">Enter your 4-digit PIN</p>
            <div className={`flex gap-3 mt-5 mb-6 ${shake ? "animate-shake" : ""}`}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full transition-all duration-200"
                  style={{
                    background: i < pin.length ? "#ff8a00" : "rgba(255,255,255,0.15)",
                    boxShadow: i < pin.length ? "0 0 12px rgba(255,138,0,0.6)" : undefined,
                  }}
                />
              ))}
            </div>
            {error && (
              <div className="text-[11.5px] text-[#ff8a82] mb-3">{error}</div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="w-[64px] h-[64px] rounded-2xl grid place-items-center text-white text-[20px] font-semibold tap-bounce"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  {d}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleDigit("0")}
                className="w-[64px] h-[64px] rounded-2xl grid place-items-center text-white text-[20px] font-semibold tap-bounce"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                0
              </button>
              <button
                onClick={handleBack}
                className="w-[64px] h-[64px] rounded-2xl grid place-items-center text-white/60 tap-bounce"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <p className="text-white/30 text-[11px] mt-5 font-mono">Hint: 2024</p>
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center justify-center gap-2 text-[10.5px] text-white/35">
          <Lock size={11} />
          Encrypted session · v4.2.0
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  icon, label, desc, on, gradient, solid, onTap,
}: {
  icon: React.ReactNode; label: string; desc: string;
  on: boolean; gradient: string; solid: string; onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="relative overflow-hidden rounded-2xl w-full text-left tap-bounce p-3.5 flex items-center gap-3"
      style={{
        background: on ? gradient : "#fff",
        boxShadow: on
          ? `0 12px 26px -12px color-mix(in oklab, ${solid} 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)`
          : "0 6px 16px -10px rgba(0,0,0,0.12), inset 0 0 0 1px var(--ops-border)",
      }}
    >
      {on && (
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-30 blur-2xl pointer-events-none"
          style={{ background: "#fff" }}
        />
      )}
      <div
        className="relative w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
        style={{
          background: on ? "rgba(255,255,255,0.95)" : `color-mix(in oklab, ${solid} 14%, transparent)`,
          color: on ? solid : solid,
          boxShadow: on ? "0 4px 10px -3px rgba(0,0,0,0.25)" : undefined,
        }}
      >
        {icon}
      </div>
      <div className="relative flex-1 min-w-0">
        <div className="text-[13.5px] font-bold leading-tight" style={{ color: on ? "#fff" : "#1a1a1a" }}>
          {label}
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: on ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}
        >
          {desc}
        </div>
      </div>
      <div
        className="relative w-11 h-6 rounded-full flex items-center transition-all flex-shrink-0"
        style={{
          background: on ? "rgba(0,0,0,0.78)" : "#e5e7eb",
          padding: "2px",
          justifyContent: on ? "flex-end" : "flex-start",
        }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: on ? "#fff" : "#fff",
            boxShadow: "0 2px 6px -1px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </button>
  );
}

function SettingsRow({
  icon, iconBg, iconColor, label, sub, badge, badgeColor, onTap,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  label: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 p-3.5 tap-bounce border-b border-[color:var(--ops-border)] last:border-b-0"
    >
      <div
        className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
        style={{
          background: iconBg ?? "rgba(0,0,0,0.05)",
          color: iconColor ?? "#1a1a1a",
          boxShadow: iconBg ? "0 4px 10px -4px rgba(0,0,0,0.2)" : undefined,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-semibold text-[#1a1a1a] leading-tight">{label}</div>
        {sub && <div className="text-[10.5px] text-[color:var(--text-muted)] mt-0.5">{sub}</div>}
      </div>
      {badge && (
        <span
          className="text-[10px] font-extrabold font-mono px-2 py-1 rounded-full"
          style={{
            background: `color-mix(in oklab, ${badgeColor ?? "var(--amber)"} 16%, transparent)`,
            color: badgeColor ?? "var(--amber)",
          }}
        >
          {badge}
        </span>
      )}
      <ChevronRight size={14} className="text-[color:var(--text-muted)]" />
    </button>
  );
}

/* ---------- Bottom Nav ---------- */
function BottomNav({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const [open, setOpen] = useState(false);
  const items: { k: TabKey; i: React.ReactNode; l: string; badge?: number }[] = [
    { k: "ops", i: <Gauge size={18} />, l: "Live Ops" },
    { k: "incidents", i: <Bell size={18} />, l: "Incidents", badge: 6 },
    { k: "orders", i: <LayoutGrid size={18} />, l: "Orders" },
    { k: "settings", i: <Settings size={18} />, l: "Profile" },
  ];
  const totalBadge = items.reduce((s, it) => s + (it.badge ?? 0), 0);

  // Fan-out arc: 4 items spread across a quarter-circle to the upper-left of the H ball.
  // Angles in degrees measured from straight-up (0°) going counter-clockwise.
  const radius = 168;
  const angles = [6, 32, 58, 84];


  return (
    <>
      {/* Backdrop when open */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute inset-0 z-[55] bg-black/35 backdrop-blur-[3px] animate-in fade-in duration-200"
        />
      )}

      <div className="absolute bottom-5 right-5 z-[60]">
        {/* Fan items */}
        {items.map((it, idx) => {
          const active = tab === it.k;
          const rad = (angles[idx] * Math.PI) / 180;
          // 0° = up (negative y), increasing counter-clockwise = negative x
          const x = open ? -Math.sin(rad) * radius : 0;
          const y = open ? -Math.cos(rad) * radius : 0;
          return (
            <button
              key={it.k}
              onClick={() => {
                setTab(it.k);
                setOpen(false);
              }}
              aria-label={it.l}
              tabIndex={open ? 0 : -1}
              className="absolute bottom-0 right-0 w-14 h-14 rounded-full glass grid place-items-center tap-bounce"
              style={{
                transform: `translate(${x}px, ${y}px) scale(${open ? 1 : 0.2})`,
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transition: `transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 45}ms, opacity 0.25s ease ${idx * 45}ms`,
                color: active ? "var(--cyan)" : "var(--text-dim)",
                boxShadow: active
                  ? "0 0 0 1px var(--cyan), 0 0 22px -4px var(--cyan-glow)"
                  : "0 8px 24px -8px rgba(0,0,0,0.6)",
              }}
            >
              <div className="relative flex flex-col items-center">
                {it.i}
                <span className="text-[8px] font-bold mt-0.5 tracking-wide uppercase">{it.l}</span>
                {it.badge && (
                  <span className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-[color:var(--alert)] text-white text-[9px] grid place-items-center font-bold">
                    {it.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* H ball */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="relative w-16 h-16 rounded-full grid place-items-center tap-bounce"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--cyan) 70%, white), var(--cyan) 55%, color-mix(in oklab, var(--cyan) 40%, var(--ops-bg)))",
            boxShadow:
              "0 0 0 1px color-mix(in oklab, var(--cyan) 70%, transparent), 0 0 32px -4px var(--cyan-glow), 0 14px 32px -10px rgba(0,0,0,0.7), inset 0 -6px 12px rgba(0,0,0,0.25)",
            transform: open ? "rotate(135deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <span
            className="font-mono font-extrabold text-2xl text-[color:var(--primary-foreground)]"
            style={{
              transition: "opacity 0.2s ease",
              opacity: open ? 0 : 1,
            }}
          >
            H
          </span>
          <X
            size={22}
            className="absolute text-[color:var(--primary-foreground)]"
            style={{
              transition: "opacity 0.2s ease",
              opacity: open ? 1 : 0,
            }}
          />
          {/* unread badge on closed ball */}
          {!open && totalBadge > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[color:var(--alert)] text-white text-[10px] grid place-items-center font-bold border-2 border-[color:var(--ops-bg)]">
              {totalBadge}
            </span>
          )}
          {/* pulse ring */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: "0 0 0 0 var(--cyan-glow)",
              animation: open ? "none" : "fab-pulse 2.4s ease-out infinite",
            }}
          />
        </button>
      </div>
    </>
  );
}

/* ---------- Bottom Sheet ---------- */
function BottomSheet({
  sheet, onClose, onDone,
}: { sheet: Sheet; onClose: () => void; onDone: (m: string) => void }) {
  const color =
    sheet.tone === "alert" ? "var(--alert)" : sheet.tone === "amber" ? "var(--amber)" : "var(--cyan)";
  return (
    <div className="absolute inset-0 z-[70] flex items-end">
      <button onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full bg-[color:var(--ops-surface)] border-t border-[color:var(--ops-border)] rounded-t-3xl p-5 pb-8 sheet-enter">
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl grid place-items-center"
            style={{ background: `color-mix(in oklab, ${color} 22%, transparent)`, color }}
          >
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold">{sheet.title}</div>
            <div className="text-[13px] text-[color:var(--text-dim)] mt-1">{sheet.desc}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={onClose} className="py-3 rounded-xl bg-black/[0.04] text-sm font-semibold tap-bounce">
            Cancel
          </button>
          <button
            onClick={() => {
              sheet.onConfirm();
              onDone(`${sheet.confirmLabel} confirmed`);
            }}
            className="py-3 rounded-xl text-sm font-bold tap-bounce"
            style={{ background: color, color: sheet.tone === "amber" ? "#1a1a1a" : "white" }}
          >
            {sheet.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeletons ---------- */
function LiveOpsSkeleton() {
  return (
    <div className="px-5 space-y-4">
      <div className="skeleton h-7 w-32" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-24 min-w-[150px]" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[1/1.1]" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-14" />
        ))}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="px-5 space-y-3">
      <div className="skeleton h-7 w-40" />
      <div className="skeleton h-10" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-24" />
      ))}
    </div>
  );
}
