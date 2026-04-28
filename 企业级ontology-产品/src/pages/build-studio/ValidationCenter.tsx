import { useState, useEffect } from "react";
import { 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  ChevronRight,
  Filter,
  PlayCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  Lock,
  Eye,
  ShieldAlert,
  Zap,
  Terminal,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function ValidationCenter() {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRedTeamMode, setIsRedTeamMode] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [rules, setRules] = useState([
    { id: 'rule-1', title: 'Unique Index Constraint', entity: 'User', severity: 'error', status: 'Passed', description: 'Ensures that all primary keys are unique across the dataset.' },
    { id: 'rule-2', title: 'Circular Link Detection', entity: 'Topology', severity: 'warning', status: 'Warning', description: 'Checks for bidirectional links that might cause infinite recursion in queries.' },
    { id: 'rule-3', title: 'Property Type Consistency', entity: 'Order', severity: 'error', status: 'Passed', description: 'Verifies that property types match the underlying datasource types.' },
  ]);

  const runValidation = () => {
    setIsValidating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const runRedTeamScan = () => {
    setIsRedTeamMode(true);
    setScanLogs(["Initializing Red Team Attack Simulation...", "Target: Default Ontology v1.2.0"]);
    
    const steps = [
      "Attempting Identity Spoofing on User Profile...",
      "Injection Test: Shadow fields in Order object...",
      "Accessing restricted PII without proper scopes...",
      "Testing State Machine bypass for 'Finished' Orders...",
      "Penetration complete. Vulnerabilities: 0 Found."
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
      }, (i + 1) * 1200);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Red Team Overlay */}
      <AnimatePresence>
        {isRedTeamMode && (
          <div className="absolute inset-0 z-50 bg-slate-900 flex items-center justify-center p-12">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-3xl h-full bg-black rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
             >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                   <div className="flex items-center gap-3">
                      <ShieldAlert size={20} className="text-red-500 animate-pulse" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Red Team Audit Console</h3>
                   </div>
                   <button onClick={() => setIsRedTeamMode(false)} className="text-slate-500 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>
                <div className="flex-1 p-8 font-mono text-xs text-green-500 overflow-y-auto space-y-3 custom-scrollbar">
                   {scanLogs.map((log, i) => (
                     <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className={cn("flex gap-4", log.includes("Vulnerabilities: 0") ? "text-emerald-400 font-bold" : "text-emerald-500/80")}
                     >
                        <span className="text-slate-700 shrink-0">[{String(i+1).padStart(2, '0')}]</span>
                        <p>{log}</p>
                     </motion.div>
                   ))}
                   {scanLogs.length < 7 && (
                     <div className="flex items-center gap-2 text-slate-500 italic">
                        <RefreshCw size={12} className="animate-spin" /> 正在执行多维度渗透测试...
                     </div>
                   )}
                </div>
                <div className="p-8 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Security Score</span>
                         <span className="text-xl font-black text-white font-mono">98/100</span>
                      </div>
                      <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full w-[98%]" />
                      </div>
                   </div>
                   <button onClick={() => setIsRedTeamMode(false)} className="px-6 h-11 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                      生成审计报告
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="p-8 border-b border-tech bg-white flex justify-between items-end shrink-0">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">质量与安全校验</h1>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.3em] font-bold font-mono">Rule Engine & Compliance</p>
               </div>
            </div>
         </div>
         <div className="flex gap-3">
           <button 
             onClick={runRedTeamScan}
             className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
           >
              <Lock size={14} /> 蓝军渗透模拟
           </button>
           <button 
             onClick={runValidation}
             disabled={isValidating}
             className="btn-primary py-2 px-6 flex items-center gap-2"
           >
              {isValidating ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />} 
              {isValidating ? `Validating... ${progress}%` : "运行全量校验"}
           </button>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/20 tech-grid border-l border-tech">
         <div className="max-w-5xl w-full mx-auto space-y-8 pb-20">
            {isValidating && (
              <div className="bg-white border border-[#106ba3]/30 rounded-xl p-6 shadow-lg animate-pulse">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-[#106ba3] uppercase tracking-widest">Running Global Health Check...</span>
                    <span className="text-xs font-mono font-bold text-[#106ba3]">{progress}%</span>
                 </div>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#106ba3] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                 </div>
              </div>
            )}

            <div className="flex items-center justify-between">
               <div className="flex gap-4">
                  <Stat label="Total Rules" value="42" color="bg-gray-100" />
                  <Stat label="Passed" value="38" color="bg-green-100 text-green-700" />
                  <Stat label="Failed" value="2" color="bg-red-100 text-red-700" />
               </div>
               <div className="flex gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="pl-9 pr-4 py-2 border border-tech rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#106ba3]" placeholder="Filter rules..." />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {rules.map(rule => (
                 <div key={rule.id} className="bg-white border border-tech rounded-xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            rule.status === 'Passed' ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
                          )}>
                             {rule.status === 'Passed' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <h3 className="text-sm font-bold text-gray-900">{rule.title}</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Target: {rule.entity}</span>
                             </div>
                             <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">{rule.description}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-3">
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                            rule.severity === 'error' ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                             {rule.severity}
                          </div>
                          {rule.status !== 'Passed' && (
                             <Link to="./objects" className="flex items-center gap-1.5 text-[10px] font-bold text-[#106ba3] hover:underline uppercase tracking-widest">
                                Go to target <ArrowRight size={10} />
                             </Link>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <section className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 text-indigo-300">
                     <RefreshCw size={16} />
                     <h4 className="text-xs font-bold uppercase tracking-widest">Continuous Compliance</h4>
                  </div>
                  <h3 className="text-xl font-bold">Automatic Impact Assessment</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    每次对本体结构的修改都将自动触发 12 个关键路径的影子测试，确保对下游应用的影响降至最低。
                  </p>
                  <Link to="/analysis/impact" className="inline-flex items-center gap-2 px-6 py-2 bg-white text-indigo-900 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                    运行影响分析报告
                  </Link>
               </div>
               <ShieldCheck size={160} className="absolute -right-10 -bottom-10 opacity-10 -rotate-12" />
            </section>
         </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: any) {
  return (
     <div className={cn("px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px]", color)}>
        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{label}</span>
        <span className="text-xl font-black">{value}</span>
     </div>
  );
}
