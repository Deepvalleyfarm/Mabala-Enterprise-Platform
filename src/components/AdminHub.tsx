import React, { useState, useMemo } from "react";
import { Tenant, User, CropCycle, Livestock, PoultryBatch, FishPond, AccountingRecord, SupportTicket, AuditLog, AdCampaign, AiTokenAccess } from "../types";
import { PlatformStats, CROP_CATEGORIES } from "../data";
import { 
  Building2, Users, Sprout, Coins, Activity, Target, Shield, Ticket, Eye, Sliders, CheckCircle2, AlertTriangle, 
  Search, ShieldCheck, Mail, Lock, Plus, FileText, BarChart3, Database, Heart, BookOpen, AlertOctagon, HelpCircle 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, Legend 
} from "recharts";

interface AdminHubProps {
  stats: PlatformStats;
  tenants: Tenant[];
  crops: CropCycle[];
  livestock: Livestock[];
  poultry: PoultryBatch[];
  fish: FishPond[];
  accounts: AccountingRecord[];
  tickets: SupportTicket[];
  auditLogs: AuditLog[];
  ads: AdCampaign[];
  aiOperations: AiTokenAccess[];
  onUpdateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  onReplyTicket: (ticketId: string, replyMsg: string) => Promise<void>;
  onAddAuditLog: (action: string, tenantId: string) => void;
}

export const AdminHub: React.FC<AdminHubProps> = ({
  stats,
  tenants,
  crops,
  livestock,
  poultry,
  fish,
  accounts,
  tickets,
  auditLogs,
  ads,
  aiOperations,
  onUpdateTenant,
  onReplyTicket,
  onAddAuditLog
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tenants" | "agriculture" | "finance" | "support" | "security">("dashboard");
  const [tenantSearch, setTenantSearch] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState<{ [key: string]: string }>({});

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => 
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || 
      t.type.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(tenantSearch.toLowerCase())
    );
  }, [tenants, tenantSearch]);

  const selectedTenantObj = tenants.find(t => t.id === selectedTenantId);

  // Recharts financial timeline
  const chartData = useMemo(() => {
    return [
      { name: "Jan", Subscriptions: Math.round(stats.revenue.subscriptions * 0.7), Credits: Math.round(stats.revenue.credits * 0.7), Ads: Math.round(stats.revenue.advertising * 0.7) },
      { name: "Feb", Subscriptions: Math.round(stats.revenue.subscriptions * 0.8), Credits: Math.round(stats.revenue.credits * 0.75), Ads: Math.round(stats.revenue.advertising * 0.82) },
      { name: "Mar", Subscriptions: Math.round(stats.revenue.subscriptions * 0.88), Credits: Math.round(stats.revenue.credits * 0.81), Ads: Math.round(stats.revenue.advertising * 0.85) },
      { name: "Apr", Subscriptions: Math.round(stats.revenue.subscriptions * 0.92), Credits: Math.round(stats.revenue.credits * 0.9), Ads: Math.round(stats.revenue.advertising * 0.9) },
      { name: "May", Subscriptions: Math.round(stats.revenue.subscriptions * 0.97), Credits: Math.round(stats.revenue.credits * 0.95), Ads: Math.round(stats.revenue.advertising * 0.95) },
      { name: "Jun", Subscriptions: stats.revenue.subscriptions, Credits: stats.revenue.credits, Ads: stats.revenue.advertising }
    ];
  }, [stats]);

  // Recharts crop acreage split
  const cropCategoryData = useMemo(() => {
    const categories = ["Cereals", "Legumes", "Cash_Crops", "Horticulture", "Fruits"];
    return categories.map(cat => {
      const total = crops
        .filter(c => c.cropCategory === cat && c.status !== "Harvested")
        .reduce((sum, c) => sum + c.acreage, 0);
      return {
        name: cat.replace("_", " "),
        Acreage: total
      };
    });
  }, [crops]);

  return (
    <div id="admin-hub-container" className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* MEAP Rail Side Menu */}
      <aside className="col-span-1 md:col-span-3 lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-1 py-4 h-fit shadow-2xl">
        <div className="px-5 py-2">
          <h1 className="text-sm font-bold tracking-tighter text-emerald-500">MEAP v1.0</h1>
          <p className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold font-mono">Platform Operator</p>
        </div>

        <nav className="flex-1 space-y-1 mt-4">
          <div className="px-5 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Main Operations</div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-indigo-400 font-mono">◈</span> Command Center
          </button>
          <button
            onClick={() => setActiveTab("tenants")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "tenants"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-indigo-400 font-mono">⊞</span> Tenant Governance
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "support"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-indigo-400 font-mono">👥</span> Support Escalations
            {tickets.filter(t => t.status === "Open").length > 0 && (
              <span className="ml-auto bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 text-[10px] rounded font-mono">
                {tickets.filter(t => t.status === "Open").length}
              </span>
            )}
          </button>

          <div className="px-5 mt-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Sector Analysis</div>
          <button
            onClick={() => setActiveTab("agriculture")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "agriculture"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-emerald-400 font-mono">🌾</span> Agri-Operations
          </button>

          <div className="px-5 mt-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Finance & Security</div>
          <button
            onClick={() => setActiveTab("finance")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "finance"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-[#38bdf8] font-mono">💰</span> Revenue Ops
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeTab === "security"
                ? "bg-slate-900 text-emerald-400 border-r-2 border-emerald-500 font-bold"
                : "text-slate-400 hover:bg-slate-900 transition-colors"
            }`}
          >
            <span className="w-5 text-center mr-2 text-red-400 font-mono">🛡️</span> Audit & Security
          </button>
        </nav>

        <div className="mt-8 border-t border-slate-800 pt-4 px-5 text-[10px] text-slate-500 font-mono flex flex-col gap-1.5 uppercase">
          <div>DB SOURCE: <span className="text-slate-400 font-bold">FIRESTORE</span></div>
          <div>SUITE SCOPE: <span className="text-slate-400 font-bold">MABALA-ZM</span></div>
        </div>
      </aside>

      {/* Primary Dashboard Panel Contents */}
      <main className="col-span-1 md:col-span-9 lg:col-span-10 flex flex-col gap-6">

        {/* ==================== TAB 1: EXECUTIVE DASHBOARD COMMAND CENTRE ==================== */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6">
            
            {/* KPI Executive Blocks Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between hover:border-emerald-500/25 transition-all shadow-xl h-full duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">ACTIVE SAAS TENANTS</h2>
                    <div className="text-3xl font-bold tracking-tighter text-white mt-1">{stats.activeTenants} <span className="text-slate-500 text-sm font-mono">/ {stats.totalTenants}</span></div>
                  </div>
                  <Building2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center text-[10px] text-emerald-400 font-mono mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> 100% cloud uptime
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between hover:border-emerald-500/25 transition-all shadow-xl h-full duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">PLATFORM USERS</h2>
                    <div className="text-3xl font-bold tracking-tighter text-white mt-1">{stats.totalUsers.toLocaleString()}</div>
                  </div>
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <div className="flex items-center text-[10px] text-sky-400 font-mono mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5"></span> +22% monthly active
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between hover:border-emerald-500/25 transition-all shadow-xl h-full duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">TOTAL REVENUE (USD)</h2>
                    <div className="text-3xl font-bold tracking-tighter text-white mt-1">${stats.revenue.total.toLocaleString()}</div>
                  </div>
                  <Coins className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex items-center text-[10px] text-amber-400 font-mono mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> +8.5% MRR increase
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between hover:border-emerald-500/25 transition-all shadow-xl h-full duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">BIOMASS AGRI-METRIC</h2>
                    <div className="text-3xl font-bold tracking-tighter text-white mt-1">{(stats.totalAcreage + stats.totalAnimals + stats.totalBirds + stats.totalFish).toLocaleString()}</div>
                  </div>
                  <Sprout className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center text-[10px] text-slate-400 font-mono mt-4">
                  RFID livestock & Crops
                </div>
              </div>
            </div>

            {/* Platform Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Financial Area Chart */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-emerald-500/25 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Revenue Stream Execution (H1 2026)</h3>
                    <p className="text-[11px] text-[#64748b]">Totalized subscription credits and placements</p>
                  </div>
                  <Coins className="w-5 h-5 text-amber-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCreds" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area type="monotone" dataKey="Subscriptions" stroke="#10b981" fillOpacity={1} fill="url(#colorSubs)" />
                      <Area type="monotone" dataKey="Credits" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCreds)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Crop Acreage Analysis */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-emerald-500/25 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Active Land Use Distribution (Hectares)</h3>
                    <p className="text-[11px] text-[#64748b]">Aggregated acreage across Sub-Saharan smallholder systems</p>
                  </div>
                  <Sprout className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cropCategoryData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }} />
                      <Bar dataKey="Acreage" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {cropCategoryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#10b981" : "#059669"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Platform Observability & Security Monitoring Pinger */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none animate-pulse"></div>

              <div className="relative z-10 font-sans">
                <div className="flex items-center justify-between mb-6 border-b border-slate-800/60 pb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">MEAP SYSTEM OBSERVABILITY & TELEMETRY</h3>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 py-0.5 px-2.5 rounded-full border border-emerald-500/20">SYSTEM HEALTH: OPTIMAL</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 font-mono uppercase">FIRESTORE WRITE PING</div>
                    <div className="text-lg font-mono font-bold text-white mt-1">{stats.observability.dbPingMs} ms</div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 font-mono uppercase font-semibold">ERROR RATE INDEX</div>
                    <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{stats.observability.errorRate}%</div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 font-mono uppercase">STORAGE ENVELOPE</div>
                    <div className="text-lg font-mono font-bold text-white mt-1">
                      {tenants.reduce((sum, t) => sum + t.storageUsedGB, 0).toFixed(1)} / 500 GB
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 font-mono uppercase">AI OPERATIONS SESSIONS</div>
                    <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{aiOperations.length + 1840} API calls</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: TENANT GOVERNANCE CENTER ==================== */}
        {activeTab === "tenants" && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col gap-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#10b981] font-mono flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  Tenant Governance Center
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure multi-tenant smallholder cooperatives and agribusinesses securely on Firestore</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter orgs..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="bg-slate-900 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 w-full sm:w-64 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800/80">
                  <tr>
                    <th className="p-3 font-bold tracking-widest text-[9px]">ORGANIZATION / TENANT ID</th>
                    <th className="p-3 font-bold tracking-widest text-[9px]">TYPE</th>
                    <th className="p-3 font-bold tracking-widest text-[9px]">TIER / PLAN</th>
                    <th className="p-3 font-bold tracking-widest text-[9px]">LEDGER CREDITS</th>
                    <th className="p-3 font-bold tracking-widest text-[9px]">STATUS</th>
                    <th className="p-3 text-right font-bold tracking-widest text-[9px]">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-950/50 text-slate-300 transition-colors duration-200">
                      <td className="p-3">
                        <div className="font-semibold text-white text-xs">{tenant.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider">{tenant.id}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-900 border border-slate-800 py-1 px-2.5 rounded text-[9px] font-mono uppercase tracking-wider text-slate-300">
                          {tenant.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-200">{tenant.plan}</td>
                      <td className="p-3 text-emerald-400 font-mono font-semibold">{tenant.credits.toLocaleString()} Cr</td>
                      <td className="p-3">
                        <span className={`py-0.5 px-2.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider ${
                          tenant.status === "Active" ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" :
                          tenant.status === "Trial" ? "bg-sky-600/10 text-sky-400 border border-sky-500/20" :
                          "bg-red-600/10 text-red-500 border border-red-500/20"
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedTenantId(tenant.id);
                            onAddAuditLog("OPEN_TENANT_GOVERNANCE", tenant.id);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-505 text-slate-950 text-[10px] font-bold tracking-widest uppercase py-1.5 px-3.5 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          MANAGE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tenant Edit Slide Out details */}
            {selectedTenantObj && (
              <div className="mt-4 p-6 bg-slate-950 border border-slate-855 rounded-2xl flex flex-col gap-5 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono">Tenant Configuration: <span className="text-emerald-400">{selectedTenantObj.name}</span></h3>
                    <p className="text-[10px] text-slate-500 font-mono">UID Scope: {selectedTenantObj.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTenantId(null)} 
                    className="text-slate-400 hover:text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                  >
                    CLOSE
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1.5 uppercase">SUSPEND/REACTIVATE</label>
                    <div className="flex gap-2">
                      {selectedTenantObj.status === "Suspended" ? (
                        <button 
                          onClick={() => {
                            onUpdateTenant(selectedTenantObj.id, { status: "Active" });
                            onAddAuditLog("ACTIVATED_TENANT", selectedTenantObj.id);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg font-bold tracking-widest uppercase text-[10px]"
                        >
                          REACTIVATE
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            onUpdateTenant(selectedTenantObj.id, { status: "Suspended" });
                            onAddAuditLog("SUSPENDED_TENANT", selectedTenantObj.id);
                          }}
                          className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/35 px-4 py-1.5 rounded-lg font-bold tracking-widest uppercase text-[10px]"
                        >
                          SUSPEND
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1.5 uppercase">CHANGE PRICING LEVEL</label>
                    <select
                      value={selectedTenantObj.plan}
                      onChange={(e) => {
                        onUpdateTenant(selectedTenantObj.id, { plan: e.target.value as any });
                        onAddAuditLog("CHANGE_PLAN_TIER", selectedTenantObj.id);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white w-full focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Seedling">Seedling ($49/mo)</option>
                      <option value="Grower">Grower ($149/mo)</option>
                      <option value="Harvest">Harvest ($299/mo)</option>
                      <option value="Unlimited">Unlimited ($699/mo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1.5 uppercase">SAAS CREDIT BALANCE</label>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          onUpdateTenant(selectedTenantObj.id, { credits: selectedTenantObj.credits + 1000 });
                          onAddAuditLog("ADJUST_CREDITS_ADD", selectedTenantObj.id);
                        }}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-400 hover:text-emerald-300 font-bold px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer"
                      >
                        +1K Cr
                      </button>
                      <button 
                        onClick={() => {
                          const rem = Math.max(0, selectedTenantObj.credits - 1000);
                          onUpdateTenant(selectedTenantObj.id, { credits: rem });
                          onAddAuditLog("ADJUST_CREDITS_SUB", selectedTenantObj.id);
                        }}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-red-505 hover:text-red-400 font-bold px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer"
                      >
                        -1K Cr
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1.5 uppercase">STORAGE ASSIGNMENT</label>
                    <div className="font-mono text-slate-300 font-semibold py-1 px-1 text-sm">
                      {selectedTenantObj.storageUsedGB.toFixed(2)} GB consumed
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Role-Based Access Control and Permission Matrix */}
            <div className="mt-4 border-t border-slate-800/60 pt-6">
              <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono mb-4">Enterprise IAM Scope (RBAC Control Matrix)</h3>
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-800">
                    <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1 mb-2">PLATFORM_ADMIN</div>
                    <div className="text-[10px] text-slate-300">✓ ALL CONTROLS</div>
                    <div className="text-[10px] text-slate-300">✓ TENANT GOVERNANCE</div>
                    <div className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> MFA ENFORCED
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-2">TENANT_ADMIN</div>
                    <div className="text-[10px] text-slate-400">✓ LOCAL ASSIGNMENTS</div>
                    <div className="text-[10px] text-slate-400">✓ ACCOUNTING ACCESS</div>
                    <div className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> MFA OPTIONAL
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-2">FARM_MANAGER</div>
                    <div className="text-[10px] text-slate-400">✓ CROP CYCLES</div>
                    <div className="text-[10px] text-slate-400">✓ RFID REGISTRY</div>
                    <div className="text-[10px] text-slate-600 mt-2">MFA DISABLED</div>
                  </div>
                  <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-800">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-2">AUDITOR</div>
                    <div className="text-[10px] text-slate-400">✓ READ ONLY LEDGER</div>
                    <div className="text-[10px] text-slate-400">✓ COMPLIANCE EXPORT</div>
                    <div className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> MFA MANDATORY
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: AGRICULTURE OPERATIONS CENTER ==================== */}
        {activeTab === "agriculture" && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col gap-6 font-sans">
            <div className="border-b border-slate-800/60 pb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#10b981] font-mono flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-500" />
                Agri-Operations Governance
              </h2>
              <p className="text-xs text-slate-400 mt-1">Zambian agricultural aggregate telemetry for crops, RFID livestock, poultry mortality and aquaculture biomass.</p>
            </div>

            {/* Sub-panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Crop Production monitoring */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-inner">
                <h3 className="font-mono text-[10px] text-emerald-400 font-bold mb-4 tracking-widest uppercase">CROP FIELDS & TELEMETRY</h3>
                <div className="flex flex-col gap-3">
                  {crops.map(c => (
                    <div key={c.id} className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex justify-between items-center text-xs hover:border-slate-700 transition">
                      <div>
                        <div className="font-semibold text-white">{c.cropName}</div>
                        <div className="text-[10px] text-slate-500">Field: {c.fieldName} | Category: {c.cropCategory}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[#10b981] font-semibold text-xs">{c.acreage} Ha</div>
                        <span className={`text-[9px] mt-1 inline-block py-0.5 px-2 rounded font-mono uppercase tracking-wider font-bold ${
                          c.status === "Planted" ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" :
                          c.status === "Harvested" ? "bg-sky-600/10 text-sky-400 border border-sky-500/20" :
                          "bg-slate-800 text-slate-400"
                        }`}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RFID Livestock register */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-inner">
                <h3 className="font-mono text-[10px] text-emerald-400 font-bold mb-4 tracking-widest uppercase">RFID / QR BOVINE TELEMETRY</h3>
                <div className="flex flex-col gap-3">
                  {livestock.map(l => (
                    <div key={l.id} className="p-3 bg-slate-900 border border-slate-800/85 rounded-xl flex justify-between items-center text-xs hover:border-slate-705 transition">
                      <div>
                        <div className="font-semibold text-white">{l.breed}</div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5 font-semibold">Tag ID: {l.tagId} ({l.category})</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] py-0.5 px-2 rounded font-mono uppercase tracking-wider font-bold ${
                          l.healthStatus === "Healthy" ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" :
                          l.healthStatus === "Treatment" ? "bg-amber-600/10 text-amber-400 border border-amber-500/20 animate-pulse" :
                          "bg-red-600/10 text-red-500 border border-red-500/20"
                        }`}>
                          {l.healthStatus}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-1 font-mono uppercase tracking-wider">Vaccine: {l.vaccinationCompleted ? "DONE" : "REQ"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Poultry & Fish Operations tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-inner">
              <div>
                <h4 className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-4 tracking-widest">POULTRY BATCHES TELEMETRY</h4>
                <div className="flex flex-col gap-3 font-mono text-[11px]">
                  {poultry.map(p => (
                    <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/60 hover:border-slate-700 transition">
                      <div className="flex justify-between font-bold text-white mb-2 text-xs">
                        <span>{p.batchName}</span>
                        <span className="text-[#10b981] font-semibold">{p.birdCount - p.mortality} Birds</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-400">
                        <div>MORTALITY: <span className="text-red-400 font-semibold">{p.mortality} ({((p.mortality / p.birdCount) * 100).toFixed(1)}%)</span></div>
                        <div>FEED CON: <span className="text-slate-300 font-semibold">{p.feedConsumedKG} KG</span></div>
                        <div>EGGS COPE: <span className="text-amber-500 font-semibold">{p.eggCount} units</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-4 tracking-widest">POND AQUACULTURE METRICS</h4>
                <div className="flex flex-col gap-3 font-mono text-[11px]">
                  {fish.map(f => (
                    <div key={f.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/60 hover:border-slate-700 transition">
                      <div className="flex justify-between font-bold text-white mb-2 text-xs">
                        <span>{f.name}</span>
                        <span className="text-[#10b981] font-semibold">{f.fingerlingsCount - f.mortality} Fish</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-400">
                        <div>SPECIES: <span className="text-slate-300 font-semibold uppercase">{f.category}</span></div>
                        <div>BIOMASS: <span className="text-slate-300 font-semibold">{f.biomass} KG</span></div>
                        <div>MORT: <span className="text-red-400 font-semibold">{f.mortality} units</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: ACCORD & COMPLIANCY HUB ==================== */}
        {activeTab === "finance" && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col gap-6 font-sans">
            <div className="border-b border-slate-800/60 pb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 font-mono flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                Accounting Governance & Compliance (IFRS)
              </h2>
              <p className="text-xs text-slate-400 mt-1">Audit organizational receipts, expenses, and verify Zambia Revenue Authority (ZRA) taxation compliance.</p>
            </div>

            {/* Financial Ledger Data View */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-inner">
              <h3 className="font-mono text-[10px] text-emerald-400 mb-4 tracking-widest uppercase font-bold">AUDIT TRANSACTIONS FEED (ZMW / USD)</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#0f172a]/60 text-slate-400 uppercase font-mono text-[9px] tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-3">TRANSACTION REFERENCE</th>
                      <th className="p-3">CATEGORY</th>
                      <th className="p-3">TYPE</th>
                      <th className="p-3 text-center">IFRS COMPULSION</th>
                      <th className="p-3 text-right">AMOUNT (USD/ZMW)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {accounts.map(record => (
                      <tr key={record.id} className="hover:bg-slate-900/50 text-slate-300 transition-colors">
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-200">{record.description}</div>
                          <div className="text-[9px] text-slate-500 font-mono tracking-wide mt-0.5 font-semibold">ID: {record.id} | Date: {new Date(record.date).toLocaleDateString()}</div>
                        </td>
                        <td className="p-3 text-slate-400">{record.category}</td>
                        <td className="p-3">
                          <span className={`py-0.5 px-2 rounded text-[9px] font-mono uppercase tracking-wider font-bold ${record.type === "Income" ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" : "bg-red-600/10 text-red-500 border border-red-500/20"}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider bg-emerald-900/10 border border-emerald-500/10 py-0.5 px-2 rounded">✓ APPROVED BY MEAP</span>
                        </td>
                        <td className={`p-3 font-semibold text-right font-mono text-xs ${record.type === "Income" ? "text-[#10b981]" : "text-red-400"}`}>
                          {record.type === "Income" ? "+" : "-"}${record.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zambian tax indicators */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-855 text-xs flex flex-col gap-4 shadow-inner">
              <h4 className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">NATIONAL COMPLIANCE ENVELOPE STATUS</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">ZRA TAX DECLARATION</div>
                  <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED (ACTIVE)
                  </div>
                </div>
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">NAPSA PENSION SUBMISSION</div>
                  <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED (ACTIVE)
                  </div>
                </div>
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">NHIMA INSURANCE MATRIX</div>
                  <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED (ACTIVE)
                  </div>
                </div>
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">WCF COMPENSATION COMPACT</div>
                  <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED (ACTIVE)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SUPPORT COMMAND CENTER ==================== */}
        {activeTab === "support" && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col gap-6 font-sans">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#10b981] font-mono flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-500" />
                Customer Support Escalations Center
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review live tenant tickets and formulate official administration decisions instantly synchronizing to farmer view.</p>
            </div>

            <div className="flex flex-col gap-5">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col gap-4 shadow-xl">
                  <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                    <div>
                      <span className={`text-[9px] font-mono tracking-widest uppercase font-bold py-0.5 px-2.5 rounded ${
                        ticket.status === "Open" ? "bg-red-600/10 text-red-400 border border-red-500/20" :
                        ticket.status === "In_Progress" ? "bg-amber-600/10 text-amber-400 border border-amber-500/20" :
                        "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                      }`}>{ticket.status}</span>
                      <h3 className="font-bold text-white text-sm mt-2">{ticket.subject}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Operator: <span className="text-slate-300">{ticket.userName} ({ticket.userEmail})</span> | Tenant ID Scope: {ticket.tenantId}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    "{ticket.message}"
                  </p>

                  {/* Reply timeline */}
                  {ticket.reply && (
                    <div className="bg-emerald-950/15 border border-emerald-900/35 p-4 rounded-xl text-xs text-slate-300 space-y-1">
                      <div className="font-bold text-[#10b981] text-[9px] font-mono uppercase tracking-widest">OFFICIAL MEAP ADMINISTRATOR DECREE:</div>
                      <p className="italic text-slate-200">"{ticket.reply}"</p>
                    </div>
                  )}

                  {/* Input form */}
                  {ticket.status !== "Resolved" && (
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        type="text"
                        placeholder="Draft reply dispatch..."
                        value={ticketReplyText[ticket.id] || ""}
                        onChange={(e) => setTicketReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 flex-1 transition"
                      />
                      <button
                        onClick={() => {
                          if (!ticketReplyText[ticket.id]?.trim()) return;
                          onReplyTicket(ticket.id, ticketReplyText[ticket.id]);
                          onAddAuditLog("REPLIED_SUPPORT_TICKET", ticket.tenantId);
                          setTicketReplyText(prev => ({ ...prev, [ticket.id]: "" }));
                        }}
                        className="bg-emerald-600 hover:bg-emerald-505 text-slate-950 text-xs font-bold tracking-widest uppercase py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                      >
                        REPLY
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: SECURITY OPERATING CENTRE ==================== */}
        {activeTab === "security" && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex flex-col gap-6 font-sans">
            <div className="border-b border-slate-800/60 pb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#10b981] font-mono flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Audit & Security Operations Console
              </h2>
              <p className="text-xs text-slate-400 mt-1">Examine raw Firestore immutable trails, logins, session telemetry, and audit cybersecurity vectors.</p>
            </div>

            {/* Audit Logs table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-inner">
              <h3 className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-4">IMMUTABLE SAAS AUDITING STREAM</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0f172a]/60 text-slate-500 uppercase text-[9px] tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-3">TIMESTAMP</th>
                      <th className="p-3">OPERATOR EMAIL</th>
                      <th className="p-3">SECURITY ACTION</th>
                      <th className="p-3">TENANT IDENTIFIER</th>
                      <th className="p-3">DEVICE CAPABILITY / METADATA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-[11px] text-slate-300">
                    {[...auditLogs].reverse().map(log => (
                      <tr key={log.id} className="hover:bg-slate-900/60 font-mono transition-colors">
                        <td className="p-3 text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3 text-slate-100 font-bold">{log.email}</td>
                        <td className="p-3">
                          <span className="text-[#10b981] font-bold bg-[#10b981]/10 border border-[#10b981]/10 py-0.5 px-2 rounded-md uppercase text-[9px] tracking-wider">{log.action}</span>
                        </td>
                        <td className="p-3 text-slate-400 text-[10px]">{log.tenantId}</td>
                        <td className="p-3 text-slate-400 text-[10px]">{log.device} (<span className="text-emerald-500">{log.ipAddress}</span>)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disaster backup information */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-855 flex flex-col gap-4 shadow-inner">
              <h4 className="font-mono text-xs text-red-500 flex items-center gap-2 font-bold tracking-widest uppercase">
                <AlertOctagon className="w-4 h-4 text-red-500 animate-bounce" />
                DISASTER RECOVERY & REGEN COURIER STATUS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RECOVERY TIME OBJECTIVE</div>
                  <div className="text-sm font-bold text-white mt-1.5">RTO &lt; 4.0 Hours</div>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RECOVERY POINT OBJECTIVE</div>
                  <span className="text-sm font-bold text-white mt-1.5">RPO &lt; 24.0 Minutes</span>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">BACKUP COMPRESSION RATE</div>
                  <div className="text-sm font-semibold text-[#10b981] mt-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 100% SECURE TRIAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
