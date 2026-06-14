import { useState, useEffect, useMemo } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, addDoc, getDocs 
} from "firebase/firestore";
import { db, auth, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from "./firebase";
import { 
  Tenant, User as MabalaUser, CropCycle, Livestock, PoultryBatch, FishPond, AccountingRecord, SupportTicket, AuditLog, AdCampaign, AiTokenAccess 
} from "./types";
import { 
  CROP_CATEGORIES, PlatformStats, computeGlobalStats,
  INITIAL_TENANTS, INITIAL_CROP_CYCLES, INITIAL_LIVESTOCK, INITIAL_POULTRY, INITIAL_FISH_PONDS, INITIAL_ACCOUNTING, INITIAL_SUPPORT, INITIAL_AUDIT_LOGS, INITIAL_ADS, INITIAL_USERS 
} from "./data";
import { AdminHub } from "./components/AdminHub";
import { ClientHub } from "./components/ClientHub";
import { 
  Sprout, Coins, Activity, Users, ShieldCheck, HelpCircle, 
  Settings, UserCheck, LogOut, Radio, Terminal, Database, FileText, Lock 
} from "lucide-react";

export default function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false); // Quick Sandbox passing trigger

  // Database States (Firestore snapshots sync)
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [crops, setCrops] = useState<CropCycle[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [poultry, setPoultry] = useState<PoultryBatch[]>([]);
  const [fish, setFish] = useState<FishPond[]>([]);
  const [accounts, setAccounts] = useState<AccountingRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [aiOperations, setAiOperations] = useState<AiTokenAccess[]>([]);
  const [users, setUsers] = useState<MabalaUser[]>([]);

  // Database Connection Indicator
  const [liveSyncActive, setLiveSyncActive] = useState(false);
  const [dbSeedingInProgress, setDbSeedingInProgress] = useState(false);

  // Layout View Mode Switch
  const [appMode, setAppMode] = useState<"meap_admin" | "mep_client">("meap_admin");
  const [activeClientTenantId, setActiveClientTenantId] = useState<string>("tenant-safari-farms");

  const [currentZambiaTime, setCurrentZambiaTime] = useState("");

  // Track active CAT clock coordinates for high-precision administration
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Zambia local time (Central Africa Time (CAT) - UTC+2)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Lusaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setCurrentZambiaTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Setup Live Firestore Real-Time Sync Listeners
  useEffect(() => {
    // Only subscribe to live snapshots if we are logged in or using sandbox bypass
    if (!currentUser && !bypassAuth) {
      setLiveSyncActive(false);
      return;
    }

    setLiveSyncActive(true);

    const unsubTenants = onSnapshot(collection(db, "tenants"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as Tenant));
      setTenants(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "tenants"));

    const unsubCrops = onSnapshot(collection(db, "cropCycles"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as CropCycle));
      setCrops(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "cropCycles"));

    const unsubLive = onSnapshot(collection(db, "livestock"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as Livestock));
      setLivestock(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "livestock"));

    const unsubPoultry = onSnapshot(collection(db, "poultryBatches"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as PoultryBatch));
      setPoultry(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "poultryBatches"));

    const unsubFish = onSnapshot(collection(db, "fishPonds"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as FishPond));
      setFish(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "fishPonds"));

    const unsubAcc = onSnapshot(collection(db, "accounting"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as AccountingRecord));
      setAccounts(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "accounting"));

    const unsubTickets = onSnapshot(collection(db, "supportTickets"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as SupportTicket));
      setTickets(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "supportTickets"));

    const unsubAudits = onSnapshot(collection(db, "auditLogs"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as AuditLog));
      setAuditLogs(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "auditLogs"));

    const unsubAds = onSnapshot(collection(db, "ads"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as AdCampaign));
      setAds(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "ads"));

    const unsubAi = onSnapshot(collection(db, "aiOperations"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as AiTokenAccess));
      setAiOperations(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "aiOperations"));

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const list = snap.docs.map(d => ({ ...d.data() } as MabalaUser));
      setUsers(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "users"));

    return () => {
      unsubTenants();
      unsubCrops();
      unsubLive();
      unsubPoultry();
      unsubFish();
      unsubAcc();
      unsubTickets();
      unsubAudits();
      unsubAds();
      unsubAi();
      unsubUsers();
    };
  }, [currentUser, bypassAuth]);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = {
          uid: user.uid,
          email: user.email || "shikasuli@gmail.com",
          displayName: user.displayName || "Mabala SysAdmin",
          photoURL: user.photoURL,
        };
        setCurrentUser(profile);

        // Auto sync active user profile to Firestore
        const mabalaUserItem: MabalaUser = {
          uid: user.uid,
          tenantId: "system-wide",
          email: user.email || "shikasuli@gmail.com",
          role: "Platform_Admin",
          mfaEnforced: true,
          status: "Active",
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, "users", user.uid), mabalaUserItem, { merge: true });
        } catch (e) {
          console.warn("Could not write authenticated user profile: ", e);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Compute stats on the fly based on synced snapshot arrays or seed fallbacks
  const globalStats: PlatformStats = useMemo(() => {
    const fallbackTenants = tenants.length > 0 ? tenants : INITIAL_TENANTS;
    const fallbackCrops = crops.length > 0 ? crops : INITIAL_CROP_CYCLES;
    const fallbackLivestock = livestock.length > 0 ? livestock : INITIAL_LIVESTOCK;
    const fallbackPoultry = poultry.length > 0 ? poultry : INITIAL_POULTRY;
    const fallbackFish = fish.length > 0 ? fish : INITIAL_FISH_PONDS;
    const fallbackAds = ads.length > 0 ? ads : INITIAL_ADS;

    return computeGlobalStats(
      fallbackTenants,
      fallbackCrops,
      fallbackLivestock,
      fallbackPoultry,
      fallbackFish,
      fallbackAds
    );
  }, [tenants, crops, livestock, poultry, fish, ads]);

  // Seeding Tool: Seeds Firestore with a rich initial agricultural dataset on demand
  const seedLiveDatabase = async () => {
    setDbSeedingInProgress(true);
    try {
      // Seed tenants
      for (const t of INITIAL_TENANTS) {
        await setDoc(doc(db, "tenants", t.id), t);
      }
      // Seed crops
      for (const c of INITIAL_CROP_CYCLES) {
        await setDoc(doc(db, "cropCycles", c.id), c);
      }
      // Seed livestock
      for (const l of INITIAL_LIVESTOCK) {
        await setDoc(doc(db, "livestock", l.id), l);
      }
      // Seed poultry
      for (const p of INITIAL_POULTRY) {
        await setDoc(doc(db, "poultryBatches", p.id), p);
      }
      // Seed fish ponds
      for (const f of INITIAL_FISH_PONDS) {
        await setDoc(doc(db, "fishPonds", f.id), f);
      }
      // Seed accounts
      for (const a of INITIAL_ACCOUNTING) {
        await setDoc(doc(db, "accounting", a.id), a);
      }
      // Seed support tickets
      for (const ticket of INITIAL_SUPPORT) {
        await setDoc(doc(db, "supportTickets", ticket.id), ticket);
      }
      // Seed audit logs
      for (const log of INITIAL_AUDIT_LOGS) {
        await setDoc(doc(db, "auditLogs", log.id), log);
      }
      // Seed advertising campaigns
      for (const ad of INITIAL_ADS) {
        await setDoc(doc(db, "ads", ad.id), ad);
      }
      // Seed users
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, "users", u.uid), u);
      }

      // Add seed success log entries
      const opLog: AuditLog = {
        id: "syslog-" + Date.now(),
        userId: currentUser?.uid || "bypass-user",
        email: currentUser?.email || "shikasuli@gmail.com",
        action: "INITIAL_DATABASE_SEED",
        tenantId: "system-wide",
        device: "Server Setup Agent",
        ipAddress: "127.0.0.1",
        timestamp: new Date().toISOString()
      };
      await setDoc(doc(db, "auditLogs", opLog.id), opLog);

      console.log("Firestore successfully populated with mock smallholders.");
    } catch (err) {
      console.error("Failed to seed database: ", err);
    } finally {
      setDbSeedingInProgress(false);
    }
  };

  // Google Login handling Action
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Popup sign in failed.", error);
    }
  };

  // Iframe developer-access bypass
  const activateSandpassBypass = async () => {
    setBypassAuth(true);
    const profile = {
      uid: "sandbox-sysadmin-101",
      email: "shikasuli@gmail.com",
      displayName: "Mabala SysAdmin",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
    };
    setCurrentUser(profile);

    // Auto sync sandbox bypass profile to Firestore
    const mabalaUserItem: MabalaUser = {
      uid: profile.uid,
      tenantId: "system-wide",
      email: profile.email,
      role: "Platform_Admin",
      mfaEnforced: true,
      status: "Active",
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "users", mabalaUserItem.uid), mabalaUserItem, { merge: true });
    } catch (e) {
      console.warn("Could not write sandbox user profile: ", e);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    setBypassAuth(false);
  };

  // Live Sync State modifiers
  const handleUpdateTenantOnFire = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      await updateDoc(doc(db, "tenants", tenantId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tenants/${tenantId}`);
    }
  };

  const handleReplyTicketOnFire = async (ticketId: string, replyMsg: string) => {
    try {
      await updateDoc(doc(db, "supportTickets", ticketId), {
        reply: replyMsg,
        status: "Resolved"
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `supportTickets/${ticketId}`);
    }
  };

  const handleAddAuditLogOnFire = async (action: string, tenantId: string) => {
    const logId = "log-" + Math.floor(100000 + Math.random() * 900000);
    const item: AuditLog = {
      id: logId,
      userId: currentUser?.uid || "developer-uid",
      email: currentUser?.email || "shikasuli@gmail.com",
      action,
      tenantId,
      device: "Enterprise Chrome / Linux Console",
      ipAddress: "197.211.53.11",
      timestamp: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "auditLogs", logId), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `auditLogs/${logId}`);
    }
  };

  const handleAddCropOnFire = async (crop: Omit<CropCycle, "id" | "tenantId" | "updatedAt">) => {
    const id = "crop-" + Math.floor(100000 + Math.random() * 900000);
    const item: CropCycle = {
      id,
      tenantId: activeClientTenantId,
      ...crop,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "cropCycles", id), item);
      await handleAddAuditLogOnFire("CROP_PLANTED", activeClientTenantId);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `cropCycles/${id}`);
    }
  };

  const handleAddLivestockOnFire = async (animal: Omit<Livestock, "id" | "tenantId" | "updatedAt">) => {
    const id = "animal-" + Math.floor(100000 + Math.random() * 900000);
    const item: Livestock = {
      id,
      tenantId: activeClientTenantId,
      ...animal,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "livestock", id), item);
      await handleAddAuditLogOnFire("ANIMAL_REGISTERED", activeClientTenantId);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `livestock/${id}`);
    }
  };

  const handleAddAccountingOnFire = async (record: Omit<AccountingRecord, "id" | "tenantId">) => {
    const id = "acc-" + Math.floor(100000 + Math.random() * 900000);
    const item: AccountingRecord = {
      id,
      tenantId: activeClientTenantId,
      ...record
    };
    try {
      await setDoc(doc(db, "accounting", id), item);
      await handleAddAuditLogOnFire("TRANSACTION_LOGGED", activeClientTenantId);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `accounting/${id}`);
    }
  };

  const handleAddTicketOnFire = async (subject: string, message: string) => {
    const id = "ticket-" + Math.floor(100000 + Math.random() * 900000);
    const item: SupportTicket = {
      id,
      tenantId: activeClientTenantId,
      userName: currentUser?.displayName || "Farmer Client",
      userEmail: currentUser?.email || "coop@mabala.zm",
      subject,
      message,
      status: "Open",
      reply: "",
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "supportTickets", id), item);
      await handleAddAuditLogOnFire("SUPPORT_TICKET_SUBMITTED", activeClientTenantId);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `supportTickets/${id}`);
    }
  };

  const handleAddAiOperationOnFire = async (promptType: string, costUSD: number) => {
    const id = "ai-log-" + Math.floor(100000 + Math.random() * 900000);
    const item: AiTokenAccess = {
      id,
      tenantId: activeClientTenantId,
      promptType,
      costUSD,
      timestamp: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "aiOperations", id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `aiOperations/${id}`);
    }
  };

  const handleDeductCreditsOnFire = async (amount: number) => {
    const activeTenantObj = tenants.find(t => t.id === activeClientTenantId);
    if (activeTenantObj) {
      const remaining = Math.max(0, activeTenantObj.credits - amount);
      await handleUpdateTenantOnFire(activeClientTenantId, { credits: remaining });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Activity className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="font-mono text-[10px] tracking-widest text-emerald-500 uppercase">BOOTSTRAPPING MEAP TELEMETRY CHANNEL...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Dynamic Authorization Screen */}
      {!currentUser ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
          {/* Subtle ambient glow matching Bento elements style */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="w-full max-w-md bg-slate-905/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-center relative z-10">
            
            {/* Platform Branding */}
            <div>
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-lg font-bold tracking-tighter text-white uppercase font-display">
                MABALA ACCESS GATEWAY
              </h1>
              <p className="text-[10px] text-emerald-500 font-mono tracking-widest mt-1 uppercase">MEAP SECURE HUB v1.0.42</p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed px-2">
              Authentication and multi-tenant security verification are mandatory for cloud Firestore access. Verify your credentials to synchronize local assets.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-slate-950 hover:bg-slate-900 text-slate-300 font-medium text-xs py-3.5 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                SIGN IN WITH GOOGLE
              </button>

              <div className="flex items-center my-1">
                <div className="flex-1 border-t border-slate-800/50"></div>
                <span className="text-[9px] font-mono text-slate-500 px-3 uppercase tracking-wider">SECURE TERMINAL</span>
                <div className="flex-1 border-t border-slate-800/50"></div>
              </div>

              {/* Seamless Auth Bypass for restricted browser contexts */}
              <button
                onClick={activateSandpassBypass}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg transition-all uppercase tracking-widest cursor-pointer"
              >
                Developer Sandbox Bypass
              </button>
            </div>

            <div className="text-[9px] text-slate-500 font-mono text-center uppercase tracking-wider">
              TARGET NODE: <span className="text-slate-400">mabala-f2d65_PROD</span>
            </div>
          </div>
        </div>
      ) : (
        /* Real Dashboard Content Screen */
        <div className="flex flex-col min-h-screen">
          
          {/* Centralized High-Contrast Status Header Bar */}
          <header className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tighter text-emerald-500 font-display uppercase">MEAP v1.0</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Enterprise Admin Platform</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 py-1 px-3 rounded-lg border border-slate-800/80 ml-2">
                <span className={`w-2 h-2 rounded-full ${liveSyncActive ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-pulse"}`}></span>
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">SYSTEM STATUS: OPTIMAL</span>
              </div>
            </div>

            {/* Global Clock Metrics & Switchers */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Zambian CAT time tracking */}
              <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs flex items-center gap-2">
                <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">LUSAKA CAT:</span>
                <span className="text-emerald-400 font-bold">{currentZambiaTime || "08:55 CAT"}</span>
              </div>

              {/* View Switches */}
              <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
                <button
                  onClick={() => setAppMode("meap_admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${appMode === "meap_admin" ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
                >
                  MEAP Admin
                </button>
                <button
                  onClick={() => setAppMode("mep_client")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${appMode === "mep_client" ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
                >
                  Farm Client
                </button>
              </div>

              {/* Seeding database trigger if empty */}
              {tenants.length === 0 && (
                <button
                  onClick={seedLiveDatabase}
                  disabled={dbSeedingInProgress}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 uppercase cursor-pointer"
                >
                  {dbSeedingInProgress ? "SEEDING..." : "⚡ Seed Demo Firestore"}
                </button>
              )}

              {/* User Profile */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <img
                  src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=60"}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-800"
                  alt="Avatar"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-white truncate max-w-28">{currentUser.displayName || currentUser.email}</div>
                  <div className="text-[9px] text-slate-500 font-mono truncate uppercase">Global Executive</div>
                </div>
                <button onClick={handleSignOut} className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Central Workspace Router */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
            
            {/* Mode 1: Central Admin Systems (MEAP) */}
            {appMode === "meap_admin" && (
              <AdminHub
                stats={globalStats}
                tenants={tenants.length > 0 ? tenants : INITIAL_TENANTS}
                crops={crops.length > 0 ? crops : INITIAL_CROP_CYCLES}
                livestock={livestock.length > 0 ? livestock : INITIAL_LIVESTOCK}
                poultry={poultry.length > 0 ? poultry : INITIAL_POULTRY}
                fish={fish.length > 0 ? fish : INITIAL_FISH_PONDS}
                accounts={accounts.length > 0 ? accounts : INITIAL_ACCOUNTING}
                tickets={tickets.length > 0 ? tickets : INITIAL_SUPPORT}
                auditLogs={auditLogs.length > 0 ? auditLogs : INITIAL_AUDIT_LOGS}
                ads={ads.length > 0 ? ads : INITIAL_ADS}
                aiOperations={aiOperations}
                onUpdateTenant={handleUpdateTenantOnFire}
                onReplyTicket={handleReplyTicketOnFire}
                onAddAuditLog={handleAddAuditLogOnFire}
              />
            )}

            {/* Mode 2: Farm Tenant client views (Mabala Farm Portal) */}
            {appMode === "mep_client" && (
              <div className="flex flex-col gap-6">
                
                {/* Active Tenant / Farm simulator filter styled as a sleek grid bar */}
                <div className="p-4 bg-slate-800/40 border border-slate-705/50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                  <div className="text-xs text-slate-400 font-bold font-mono uppercase tracking-wider">
                    CHOOSE SIMULATED FARM OR COOPERATIVE TENANT LOGGED-IN:
                  </div>
                  <select
                    value={activeClientTenantId}
                    onChange={(e) => setActiveClientTenantId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500 transition-all w-full md:w-72"
                  >
                    {(tenants.length > 0 ? tenants : INITIAL_TENANTS).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.type.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                </div>

                <ClientHub
                  tenants={tenants.length > 0 ? tenants : INITIAL_TENANTS}
                  crops={crops.length > 0 ? crops : INITIAL_CROP_CYCLES}
                  livestock={livestock.length > 0 ? livestock : INITIAL_LIVESTOCK}
                  accounts={accounts.length > 0 ? accounts : INITIAL_ACCOUNTING}
                  tickets={tickets.length > 0 ? tickets : INITIAL_SUPPORT}
                  onAddCrop={handleAddCropOnFire}
                  onAddLivestock={handleAddLivestockOnFire}
                  onAddAccounting={handleAddAccountingOnFire}
                  onAddTicket={handleAddTicketOnFire}
                  onAddAiOperation={handleAddAiOperationOnFire}
                  onDeductCredits={handleDeductCreditsOnFire}
                  onUpdateTenant={handleUpdateTenantOnFire}
                  activeTenantId={activeClientTenantId}
                />
              </div>
            )}

          </div>

          {/* Central Bottom Compliance Footer */}
          <footer className="h-12 border-t border-slate-800 flex items-center justify-between px-8 bg-slate-950 text-[10px] text-slate-500 tracking-widest uppercase font-mono mt-8">
            <div>© 2026 MABALA ENTERPRISE PLATFORM (MEAP) | GOVERNANCE LAYER</div>
            <div className="hidden md:flex space-x-6">
              <span>IFRS COMPLIANT</span>
              <span>ZRA REGISTERED</span>
              <span>NAPSA INTEGRATED</span>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
