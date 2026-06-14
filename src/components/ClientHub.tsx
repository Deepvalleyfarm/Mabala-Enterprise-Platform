import React, { useState } from "react";
import { Tenant, CropCycle, Livestock, PoultryBatch, FishPond, AccountingRecord, SupportTicket, AiTokenAccess } from "../types";
import { CROP_CATEGORIES, LIVESTOCK_BREEDS } from "../data";
import { 
  Sprout, Coins, Activity, Ticket, Plus, HelpCircle, Sparkles, Send, ShieldAlert, FileText, CheckCircle2, ArrowRight
} from "lucide-react";

interface ClientHubProps {
  tenants: Tenant[];
  crops: CropCycle[];
  livestock: Livestock[];
  accounts: AccountingRecord[];
  tickets: SupportTicket[];
  onAddCrop: (crop: Omit<CropCycle, "id" | "tenantId" | "updatedAt">) => Promise<void>;
  onAddLivestock: (animal: Omit<Livestock, "id" | "tenantId" | "updatedAt">) => Promise<void>;
  onAddAccounting: (record: Omit<AccountingRecord, "id" | "tenantId">) => Promise<void>;
  onAddTicket: (subject: string, message: string) => Promise<void>;
  onAddAiOperation: (promptType: string, costUSD: number) => Promise<void>;
  onDeductCredits: (amount: number) => Promise<void>;
  onUpdateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  activeTenantId: string;
}

export const ClientHub: React.FC<ClientHubProps> = ({
  tenants,
  crops,
  livestock,
  accounts,
  tickets,
  onAddCrop,
  onAddLivestock,
  onAddAccounting,
  onAddTicket,
  onAddAiOperation,
  onDeductCredits,
  onUpdateTenant,
  activeTenantId
}) => {
  const activeTenant = tenants.find(t => t.id === activeTenantId);

  // Local state forms
  const [cropCategory, setCropCategory] = useState<keyof typeof CROP_CATEGORIES>("Cereals");
  const [cropName, setCropName] = useState("");
  const [cropAcreage, setCropAcreage] = useState(10);
  const [cropField, setCropField] = useState("");
  const [cropInputsCost, setCropInputsCost] = useState(1200);

  const [cattleBreed, setCattleBreed] = useState("Boran");
  const [animalCategory, setAnimalCategory] = useState<"Cattle" | "Sheep" | "Goats" | "Pigs">("Cattle");
  const [animalHealth, setAnimalHealth] = useState<"Healthy" | "Treatment">("Healthy");
  const [animalTagPrefix, setAnimalTagPrefix] = useState("RFID-ZM-");

  const [accType, setAccType] = useState<"Income" | "Expense">("Income");
  const [accCategory, setAccCategory] = useState("Cash Crop Sales");
  const [accAmount, setAccAmount] = useState(250);
  const [accDesc, setAccDesc] = useState("");

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");

  const [aiTopic, setAiTopic] = useState("Crop Rust Strategy");
  const [aiContext, setAiContext] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Filter crops & livestock belonging to this active tenant
  const localCrops = crops.filter(c => c.tenantId === activeTenantId);
  const localLivestock = livestock.filter(l => l.tenantId === activeTenantId);
  const localAccounts = accounts.filter(a => a.tenantId === activeTenantId);
  const localTickets = tickets.filter(t => t.tenantId === activeTenantId);

  // Handle Plant Crop submit
  const handlePlantCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropField || !cropName) return;
    await onAddCrop({
      fieldName: cropField,
      cropCategory,
      cropName,
      acreage: Number(cropAcreage),
      status: "Planted",
      plantingDate: new Date().toISOString(),
      expectedHarvest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      inputCosts: Number(cropInputsCost),
      yieldPerHectare: 0,
      diseaseStatus: "None"
    });
    setCropField("");
    setCropName("");
  };

  // Handle Bovine Scanner submit
  const handleRegisterLivestock = async (e: React.FormEvent) => {
    e.preventDefault();
    const tag = animalTagPrefix + Math.floor(10000 + Math.random() * 90000);
    await onAddLivestock({
      tagId: tag,
      breed: cattleBreed,
      category: animalCategory,
      birthDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      healthStatus: animalHealth,
      vaccinationCompleted: Math.random() > 0.3
    });
  };

  // Handle Accounting Form
  const handleLogFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accDesc) return;
    await onAddAccounting({
      type: accType,
      category: accCategory,
      amount: Number(accAmount),
      description: accDesc,
      complianceSRA: true,
      date: new Date().toISOString()
    });
    setAccDesc("");
  };

  // Handle Help Ticket Form
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    await onAddTicket(ticketSubject, ticketMsg);
    setTicketSubject("");
    setTicketMsg("");
  };

  // Call MEAP-AI advisory server route (calling real Gemini 3.5 Flash)
  const handleQueryAI = async () => {
    if (!aiContext.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    // AI Query Cost structure: Deducts 25 credits from the tenant's ledger
    const costCredits = 25;
    if (activeTenant && activeTenant.credits < costCredits) {
      setAiResult("Warning: Insufficient credits on your agricultural ledger. Please purchase credits first in the Credit Economic Center.");
      setAiLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          context: {
            farmerNotes: aiContext,
            tenantName: activeTenant?.name,
            tenantCredits: activeTenant?.credits,
            category: cropCategory
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResult(data.text);
        // Deduct live credits and audit log the AI access
        await onDeductCredits(costCredits);
        await onAddAiOperation(aiTopic, 0.04); // Estimating $0.04 USD Gemini cost
      } else {
        setAiResult(`AI Operation failed: ${data.error || "Please try again."}`);
      }
    } catch (err: any) {
      setAiResult("Connecting to Gemini recommendation engine failed. Running fallback local simulation.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!activeTenant) return <p className="text-slate-400">Loading active agricultural tenant context...</p>;

  // Check if tenant is suspended (Multi-tenant lock-out simulation)
  if (activeTenant.status === "Suspended") {
    return (
      <div className="bg-red-950/20 border border-red-900/40 p-12 rounded-2xl shadow-xl text-center max-w-xl mx-auto my-12 flex flex-col gap-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">TEANANT PORTAL SUSPENDED</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The organization **"{activeTenant.name}"** has been locked due to a temporary compliance freeze or administrative intervention by the MEAP system governance center.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Please contact shikasuli@gmail.com for clearing ZRA audits and credential reactivation.
        </p>
      </div>
    );
  }

  return (
    <div id="client-hub-container" className="flex flex-col gap-6">
      
      {/* Dynamic Sync Dashboard Header for Tenant Farmer - Styled as Bento Panel */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-705/50 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold tracking-tighter text-white font-display">
            Mabala Farm Portal: <span className="text-emerald-400">{activeTenant.name}</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Two-way cloud-synchronization active. Edits reflect dynamically on MEAP administrative views.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Credits Ledger</div>
              <div className="font-mono text-sm font-bold text-emerald-400">{activeTenant.credits.toLocaleString()} Cr</div>
            </div>
          </div>
          <button
            onClick={() => onAddCreditsManual()}
            className="bg-emerald-600/25 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-600/35 hover:text-emerald-300 font-bold text-[10px] py-2 px-4 rounded-lg tracking-widest uppercase transition-all duration-300 cursor-pointer"
          >
            BUY CREDITS
          </button>
        </div>
      </div>
 
      {/* Main Forms & Advisory grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
 
        {/* Column Left: Actions Form Fields */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Action 1: Planting crops */}
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-4 hover:border-emerald-500/25 transition-all shadow-xl">
            <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400 animate-pulse" />
              Plant New Crop Field
            </h3>
            <form onSubmit={handlePlantCrop} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Field Name / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. East Boundary Plot B"
                  value={cropField}
                  onChange={(e) => setCropField(e.target.value)}
                  className="bg-slate-900 border border-slate-800 p-2.5 rounded text-white w-full focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
 
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={cropCategory}
                    onChange={(e) => setCropCategory(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(CROP_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Crop Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. Soybeans Supreme"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Acreage size</label>
                  <input
                    type="number"
                    value={cropAcreage}
                    onChange={(e) => setCropAcreage(Math.max(1, Number(e.target.value)))}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Estimate Costs</label>
                  <input
                    type="number"
                    value={cropInputsCost}
                    onChange={(e) => setCropInputsCost(Math.max(0, Number(e.target.value)))}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
 
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-lg tracking-widest uppercase transition-all duration-300 cursor-pointer text-[10px]"
              >
                SUBMIT & SYNC FIELD
              </button>
            </form>
          </div>
 
          {/* Action 2: Cattle Bovine Scan */}
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-4 hover:border-emerald-500/25 transition-all shadow-xl">
            <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Bovine RFID Diagnostics
            </h3>
            <form onSubmit={handleRegisterLivestock} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Species</label>
                  <select
                    value={animalCategory}
                    onChange={(e) => setAnimalCategory(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Cattle">Cattle</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Goats">Goats</option>
                    <option value="Pigs">Pigs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Breed Records</label>
                  <input
                    type="text"
                    value={cattleBreed}
                    onChange={(e) => setCattleBreed(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Boran Stud"
                    required
                  />
                </div>
              </div>
 
              <div>
                <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Vet Assessment</label>
                <select
                  value={animalHealth}
                  onChange={(e) => setAnimalHealth(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                >
                  <option value="Healthy">Healthy (No findings)</option>
                  <option value="Treatment">Requires Medicine Trait</option>
                </select>
              </div>
 
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-lg tracking-widest uppercase transition-all duration-300 cursor-pointer text-[10px]"
              >
                LOG DEVICE & EMIT RFID
              </button>
            </form>
          </div>
 
          {/* Action 3: Accounting Record */}
          <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-4 hover:border-emerald-500/25 transition-all shadow-xl">
            <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              IFRS Ledger Receipt Entry
            </h3>
            <form onSubmit={handleLogFinance} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Flow Type</label>
                  <select
                    value={accType}
                    onChange={(e) => {
                      setAccType(e.target.value as any);
                      setAccCategory(e.target.value === "Income" ? "Cash Crop Sales" : "Chemical Application");
                    }}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Income">Income (+)</option>
                    <option value="Expense">Expense (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    value={accAmount}
                    onChange={(e) => setAccAmount(Math.max(1, Number(e.target.value)))}
                    className="bg-slate-900 border border-slate-800 p-2 text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Description Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Paid casual harvest crew"
                  value={accDesc}
                  onChange={(e) => setAccDesc(e.target.value)}
                  className="bg-slate-900 border border-slate-800 p-2.5 rounded text-white w-full focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-lg tracking-widest uppercase transition-all duration-300 cursor-pointer text-[10px]"
              >
                LOG COMPLIANT TRANSACTION
              </button>
            </form>
          </div>

        </div>

        {/* Column Right: AI recommendation & Live tickets */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* AI Advisor Module - Styled with Glowing Emerald Borders */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all duration-300">
            {/* Subtle glow background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none animate-pulse"></div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-emerald-400">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-sans uppercase tracking-widest">MEAP-AI Advisory Hub</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Instant multi-cycle yield diagnostics and veterinary recommendations.</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2.5 rounded-full font-bold">25 Credits / query</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Advisory Topic</label>
                  <select
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="bg-slate-900 text-white text-xs p-2.5 rounded border border-slate-800 w-full focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Crop Rust Disease Strategy">Crop Spots Strategy</option>
                    <option value="Veterinary Treatment Options">Veterinary Study Plan</option>
                    <option value="Pond Hydroponics Calibration">Hydroponics Care</option>
                    <option value="Multi-cycle Profitability Report">Profitability Analysis</option>
                  </select>
                </div>

                <div className="md:col-span-8">
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">State local symptoms or agribusiness details</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Describe symptoms (e.g. Dry Maize, 1.2 tons FCR drop)..."
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded border border-slate-800 flex-1 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleQueryAI}
                      disabled={aiLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold text-slate-950 px-4 py-2.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-all outline-none tracking-widest uppercase disabled:opacity-40 cursor-pointer"
                    >
                      {aiLoading ? "DEDUCING..." : <><Send className="w-3.5 h-3.5" /> QUERY AI</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Advisor Result Panel */}
              {aiResult && (
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 mt-2 text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto">
                  <div className="font-mono text-[9px] text-emerald-400 font-bold mb-2 uppercase tracking-widest">AI RECOMMENDATIONS LOG:</div>
                  <div className="whitespace-pre-line text-slate-200">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Local Tickets and Help Desk Section - Styled like Bento Panel */}
          <div className="bg-slate-800/40 border border-slate-705/50 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/25 transition-all">
            <h3 className="font-bold text-white text-xs tracking-widest uppercase font-mono">Escalations Helpdesk Ticket System</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Submission Form */}
              <form onSubmit={handleSubmitTicket} className="flex flex-col gap-4 text-xs bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">CREATE SUPPORT TICKET</div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Issue Subject</label>
                  <input
                    type="text"
                    placeholder="Issue with hardware or compliance..."
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-2.5 rounded text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold font-mono text-slate-400 block mb-1">Provide explanation details</label>
                  <textarea
                    rows={2}
                    placeholder="Detail error logs or credit problems..."
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    className="bg-slate-900 border border-slate-800 p-2.5 rounded text-white w-full focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold text-slate-950 py-2.5 rounded-lg transition-all text-[10px] tracking-widest uppercase cursor-pointer"
                >
                  TRANSMIT TICKET TO MEAP
                </button>
              </form>

              {/* Snapshot Feed of Tickets */}
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                <div className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest mb-1">SUBMITTED TICKETS STATUS</div>
                {localTickets.length === 0 ? (
                  <p className="text-[11px] text-slate-500 font-mono">No tickets currently submitted. Create one in the form.</p>
                ) : (
                  localTickets.map(t => (
                    <div key={t.id} className="p-4 bg-slate-950 border border-slate-850 rounded-lg text-xs flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 truncate pr-2">{t.subject}</span>
                        <span className={`text-[8px] py-0.5 px-2 rounded font-bold uppercase tracking-widest ${
                          t.status === "Open" ? "bg-red-400/10 text-red-400" : "bg-emerald-400/10 text-emerald-400"
                        }`}>{t.status}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">"{t.message}"</p>
                      {t.reply ? (
                        <div className="border-l-2 border-emerald-500 pl-2 text-[10px] text-emerald-400 bg-emerald-950/20 p-2 rounded mt-1">
                          <span className="font-bold">MEAP Admin:</span> "{t.reply}"
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-500 italic mt-0.5 animate-pulse">Awaiting administrative reply from MEAP...</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );

  // Helper function to buy credits instantly triggers credits field modifications
  function onAddCreditsManual() {
    if (activeTenant) {
      onAddAccounting({
        type: "Income",
        category: "Subscription Billing Credit Addition",
        amount: 250,
        description: "Standard top-up credits purchase via payment terminal",
        complianceSRA: true,
        date: new Date().toISOString()
      });
      onUpdateTenant(activeTenant.id, { credits: activeTenant.credits + 2500 });
      onAddAiOperation("PURCHASED_CREDITS", 0.0);
    }
  }
};
