import { useState } from "react";
import { 
  GitFork, 
  Search, 
  ArrowRight, 
  Map, 
  Database, 
  DatabaseZap,
  Play,
  RotateCcw
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function PathAnalysis() {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [pathFound, setPathFound] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white" id="path-analysis">
      <header className="p-8 border-b border-tech bg-white shrink-0">
         <div className="flex items-center gap-3 mb-6">
           <GitFork size={24} className="text-emerald-500" />
           <h1 className="text-xl font-bold">图谱路径发现 (Pathfinding)</h1>
         </div>
         
         <div className="flex items-end gap-4 max-w-3xl">
            <div className="flex-1 space-y-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">起始点 (Source Entity)</label>
               <input 
                 type="text" 
                 value={source}
                 onChange={(e) => setSource(e.target.value)}
                 placeholder="例如: User" 
                 className="input-base w-full h-10 text-sm font-mono" 
               />
            </div>
            <div className="pt-8">
               <ArrowRight className="text-gray-300" size={24} />
            </div>
            <div className="flex-1 space-y-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">终点 (Target Entity)</label>
               <input 
                 type="text" 
                 value={target}
                 onChange={(e) => setTarget(e.target.value)}
                 placeholder="例如: Transaction" 
                 className="input-base w-full h-10 text-sm font-mono" 
               />
            </div>
            <button 
               onClick={() => setPathFound(true)}
               className="btn-primary py-2 px-6 h-10 flex items-center gap-2 "
            >
               <Play size={14} /> 搜索路径
            </button>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 tech-grid">
         {pathFound ? (
           <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-start gap-4">
                 <Map className="text-emerald-600 mt-1" size={20} />
                 <div>
                   <h3 className="text-sm font-bold text-emerald-900 mb-1">发现最短路径</h3>
                   <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                     从 <b>{source}</b> 到 <b>{target}</b> 发现 2 跳路径。该路径目前已在 3 个应用中使用。
                   </p>
                 </div>
              </div>

              {/* Visual Path Display */}
              <div className="bg-white border border-tech rounded-2xl p-12 flex flex-col items-center gap-12 shadow-sm relative">
                 <div className="flex items-center gap-8">
                    <PathStep type="Source" label={source} icon={DatabaseZap} />
                    <PathConnector label="userOrders" />
                    <PathStep type="Hop" label="Order" icon={Database} />
                    <PathConnector label="recordedIn" />
                    <PathStep type="Target" label={target} icon={DatabaseZap} />
                 </div>

                 <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setPathFound(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                    >
                      <RotateCcw size={16} />
                    </button>
                 </div>
              </div>

              {/* Path Properties */}
              <div className="grid grid-cols-2 gap-6">
                 <section className="bg-white border border-tech rounded-xl p-6 space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">跳跃详情</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">跳数 (Hops)</span>
                          <span className="font-mono font-bold text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">关系类型</span>
                          <span className="font-mono font-bold text-gray-900">ManyToMany, ManyToOne</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">估算代价</span>
                          <span className="font-mono font-bold text-green-500">LOW</span>
                       </div>
                    </div>
                 </section>

                 <div className="bg-white border border-tech rounded-xl p-6 space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest underline decoration-[#106ba3]/30 decoration-2 underline-offset-4">使用此路径的应用</h4>
                    <div className="space-y-2">
                       {['Global Sales Dash', 'Audit Tool'].map(app => (
                         <div key={app} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded border border-tech">
                            <span className="font-medium text-gray-700">{app}</span>
                            <ArrowRight size={12} className="text-gray-300" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center p-20 opacity-40">
              <GitFork className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-500">输入起始与终点实体名称，系统将自动发现并评估最短逻辑路径。</p>
           </div>
         )}
      </div>
    </div>
  );
}

function PathStep({ type, label, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
       <div className={cn(
         "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl",
         type === 'Hop' ? "bg-purple-500" : "bg-[#106ba3]"
       )}>
          <Icon size={28} />
       </div>
       <div className="text-center">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">{type}</p>
       </div>
    </div>
  );
}

function PathConnector({ label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
       <div className="w-32 h-px bg-gray-300 relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-100 border border-tech rounded-full text-[9px] font-mono whitespace-nowrap text-gray-500 group-hover:bg-[#106ba3] group-hover:text-white transition-all shadow-sm">
             {label}
          </div>
          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
       </div>
    </div>
  );
}
