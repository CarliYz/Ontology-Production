import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  SearchCode, 
  Terminal, 
  Clock, 
  Database, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Code2,
  GitBranch,
  Settings2
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface QueryEvent {
  id: string;
  occurred_at: string;
  query_type: string;
  source_app: string;
  duration_ms: number;
  status: string;
  result_count: number;
}

interface QueryExplain {
  summary: string;
  path: any[];
  filters: any[];
  riskHints: string[];
}

export default function QueryExplorer() {
  const [events, setEvents] = useState<QueryEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<QueryExplain | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/query-events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) setSelectedEventId(data[0].id);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      setExplanation(null);
      fetch(`/api/query-events/${selectedEventId}/explain`)
        .then(res => res.json())
        .then(setExplanation);
    }
  }, [selectedEventId]);

  return (
    <div className="flex h-full overflow-hidden bg-white" id="query-explorer">
      {/* Event List Sidebar */}
      <div className="w-80 border-r border-tech flex flex-col bg-gray-50/20 shrink-0">
        <header className="p-4 border-b border-tech bg-white/50 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">实时查询流</h2>
            <div className="flex gap-2">
               <button className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400">
                  <Filter size={14} />
               </button>
               <button className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400">
                  <Settings2 size={14} />
               </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索应用或 ID..." 
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-tech rounded text-xs focus:ring-1 focus:ring-[#106ba3] outline-none" 
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {events.map(ev => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all group relative overflow-hidden",
                selectedEventId === ev.id 
                  ? "border-[#106ba3] bg-[#e1f0f9]/30 shadow-sm" 
                  : "border-transparent hover:border-tech bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-1.5">
                    {ev.status === 'success' ? (
                      <CheckCircle2 size={12} className="text-green-500" />
                    ) : (
                      <XCircle size={12} className="text-red-500" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight text-gray-500">{ev.query_type}</span>
                 </div>
                 <span className="text-[9px] font-mono text-gray-400">{new Date(ev.occurred_at).toLocaleTimeString([], { hour12: false })}</span>
              </div>
              <p className="text-xs font-bold text-gray-800 truncate mb-1">{ev.source_app}</p>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-tech/50">
                 <span className="text-[9px] font-bold text-[#106ba3] hover:underline flex items-center gap-1 group/btn">
                    Details <ChevronRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                 </span>
                 <div className="flex gap-1">
                    <Link to="../objects" className="w-1.5 h-1.5 rounded-full bg-green-500/20 hover:bg-green-500 transition-colors" title="View in Studio" />
                    <Link to="../history" className="w-1.5 h-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500 transition-colors" title="View History" />
                 </div>
              </div>
              {selectedEventId === ev.id && (
                <div className="absolute right-0 top-0 h-full w-1 bg-[#106ba3]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Query Detail / Explain Plan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedEventId ? (
          <>
            <header className="p-8 border-b border-tech bg-white shrink-0">
               <div className="flex items-center gap-3 mb-2">
                 <SearchCode size={24} className="text-[#106ba3]" />
                 <h1 className="text-xl font-bold">Query Execution Analysis</h1>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-9">
                  UUID: {selectedEventId} <span className="text-gray-200">|</span> Client: Palantir Workshop
               </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 tech-grid">
               <div className="max-w-4xl mx-auto space-y-8">
                  {/* Summary & Risk Metrics */}
                  <div className="grid grid-cols-2 gap-6">
                     <section className="bg-white p-6 border border-tech rounded-xl shadow-sm space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Terminal size={14} className="text-[#106ba3]" />
                          执行摘要
                        </h3>
                        {explanation ? (
                           <p className="text-sm text-gray-700 leading-relaxed font-medium">
                             {explanation.summary}
                           </p>
                        ) : (
                           <div className="animate-pulse h-12 bg-gray-100 rounded" />
                        )}
                     </section>

                     <section className="bg-white p-6 border border-tech rounded-xl shadow-sm space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" />
                          潜在性能风险
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {explanation?.riskHints.map((hint, idx) => (
                             <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-tight">
                               {hint}
                             </span>
                           )) || <div className="animate-pulse h-6 w-full bg-gray-100 rounded" />}
                        </div>
                     </section>
                  </div>

                  {/* Visual Plan */}
                  <section className="bg-white border border-tech rounded-xl shadow-sm overflow-hidden flex flex-col">
                     <div className="px-6 py-4 border-b border-tech bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">查询执行路径 (Explain Plan)</h3>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <div className="w-2 h-2 rounded-full bg-blue-400" /> Start
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <div className="w-2 h-2 rounded-full bg-purple-400" /> Hop
                           </div>
                        </div>
                     </div>
                     <div className="p-10 flex flex-col gap-10 items-center">
                        {explanation ? (
                          <div className="flex flex-col items-center gap-12 w-full">
                            <div className="flex items-center gap-6">
                              {explanation.path.map((step, idx) => (
                                 <div key={idx} className="flex items-center gap-6">
                                  <div className="flex flex-col items-center gap-3 group relative">
                                     <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-110",
                                        idx === 0 ? "bg-blue-500 ring-4 ring-blue-100" : "bg-purple-500"
                                     )}>
                                        <Database size={20} />
                                     </div>
                                     <Link to="../objects" className="text-xs font-bold text-gray-700 hover:text-[#106ba3] hover:underline">{step.from}</Link>
                                     <div className="absolute -top-6 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Scan: {idx === 0 ? "Full Index" : "Relational Lookup"}
                                     </div>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                     <div className="w-32 h-px bg-gray-300 relative group">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-tech rounded-full text-[9px] font-mono whitespace-nowrap text-[#106ba3] group-hover:bg-[#106ba3] group-hover:text-white transition-all shadow-sm">
                                           {step.link}
                                        </div>
                                        <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                     </div>
                                     <span className="text-[8px] text-gray-400 font-mono tracking-tighter uppercase">ManyToOne</span>
                                  </div>
                                  {idx === explanation.path.length - 1 && (
                                     <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-100">
                                           <Database size={20} />
                                        </div>
                                        <Link to="../objects" className="text-xs font-bold text-gray-700 hover:text-[#106ba3] hover:underline">{step.to}</Link>
                                     </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-8 border-t border-tech pt-8 w-full justify-center">
                               <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-gray-400" />
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">IO Time: 12ms</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Database size={14} className="text-gray-400" />
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Rows Scanned: 4.2k</span>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-12">
                             {[1,2,3].map(i => <div key={i} className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse" />)}
                          </div>
                        )}
                     </div>
                  </section>

                  {/* Logic Code / Filters */}
                  <div className="grid grid-cols-2 gap-6">
                     <section className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-white/5">
                        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                           </div>
                           <span className="text-[10px] text-slate-500 font-mono">logical_plan.json</span>
                        </div>
                        <div className="p-4 font-mono text-[11px] text-cyan-400 overflow-x-auto whitespace-pre">
{`{
  "operation": "join",
  "left": "Customer[APAC]",
  "right": "Order",
  "on": "Customer.id = Order.customerId",
  "optimization": {
    "pushdown_filter": false,
    "scan_type": "INDEX_SCAN"
  }
}`}
                        </div>
                     </section>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">应用过滤条件</h4>
                        <div className="space-y-2">
                           {explanation?.filters.map((f, i) => (
                             <div key={i} className="p-3 bg-white border border-tech rounded-lg flex items-center gap-3">
                                <Code2 size={16} className="text-blue-500" />
                                <div className="text-xs">
                                   <span className="font-bold text-gray-700">{f.field}</span>
                                   <span className="mx-2 text-gray-400">{f.operator}</span>
                                   <span className="px-1.5 py-0.5 bg-gray-50 border border-tech rounded text-gray-600 font-mono">{f.value}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                           <GitBranch className="text-indigo-600 shrink-0" size={16} />
                           <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                             AI 智能建议：建议将 <b>{explanation?.filters[0]?.field}</b> 的过滤条件下推至数据源层级，可减少约 1.8k 条数据的无效 IO 开销。
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <SearchCode className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-500">点击左侧事件查看详细执行计划 (Explain Plan)</p>
          </div>
        )}
      </div>
    </div>
  );
}
