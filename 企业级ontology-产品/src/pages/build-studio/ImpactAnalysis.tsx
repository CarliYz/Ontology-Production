import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  GitPullRequest, 
  Search, 
  ArrowRight, 
  AlertCircle,
  FileCode,
  Layout,
  PlayCircle,
  ChevronRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ImpactItem {
  source_ref: string;
  target_type: "query" | "page" | "action";
  target_ref: string;
  impact_level: "direct" | "indirect" | "potential";
}

export default function ImpactAnalysis() {
  const [searchParams] = useSearchParams();
  const [searchRef, setSearchRef] = useState(searchParams.get("ref") || "");
  const [results, setResults] = useState<ImpactItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("ref")) {
      runAnalysis();
    }
  }, [searchParams]);

  const runAnalysis = () => {
    const term = searchRef || searchParams.get("ref");
    if (!term) return;
    setLoading(true);
    fetch("/api/analysis/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceRef: term })
    })
    .then(res => res.json())
    .then(data => {
      setResults(data);
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white" id="impact-analysis">
      <header className="p-8 border-b border-tech bg-white shrink-0">
         <div className="flex items-center gap-3 mb-6">
           <GitPullRequest size={24} className="text-indigo-500" />
           <h1 className="text-xl font-bold">影响分析 (Impact Analysis)</h1>
         </div>
         
         <div className="flex items-end gap-4 max-w-2xl">
            <div className="flex-1 space-y-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">变更对象 (API Name)</label>
               <div className="relative">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input 
                   type="text" 
                   value={searchRef}
                   onChange={(e) => setSearchRef(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                   placeholder="例如: User.email, Order.cardId..." 
                   className="input-base w-full pl-8 h-10 text-sm font-mono" 
                 />
               </div>
            </div>
            <button 
               onClick={runAnalysis}
               className="btn-primary py-2 px-6 h-10"
            >
               执行分析
            </button>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 tech-grid">
         {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 italic">
               <PlayCircle className="animate-spin mb-4" size={32} />
               正在解析依赖关系树...
            </div>
         ) : results.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-start gap-4">
                  <Info className="text-indigo-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 mb-1">分析摘要</h3>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                      变更 <b>{searchRef}</b> 将影响 {results.length} 个下游组件。发现 1 个直接引用和 2 个潜在影响。建议在发布变更前联系相关应用的所有者进行兼容性确认。
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">影响映射</h4>
                  {results.map((res, i) => (
                    <div key={i} className="bg-white border border-tech rounded-xl p-5 flex items-center gap-6 group hover:border-gray-400 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                       <div className="flex flex-col items-center gap-2 min-w-[80px]">
                          <span className={cn(
                             "text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded border",
                             res.impact_level === 'direct' ? "bg-red-50 text-red-600 border-red-100" :
                             res.impact_level === 'indirect' ? "bg-amber-50 text-amber-600 border-amber-100" :
                             "bg-gray-50 text-gray-400 border-gray-100"
                          )}>
                             {res.impact_level}
                          </span>
                       </div>

                       <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                             {res.target_type === 'query' ? <FileCode size={18} /> : 
                              res.target_type === 'page' ? <Layout size={18} /> : <PlayCircle size={18} />}
                          </div>
                          <div>
                             <h5 className="text-sm font-bold text-gray-800">{res.target_ref}</h5>
                             <p className="text-[10px] text-gray-400 uppercase font-mono">{res.target_type}</p>
                          </div>
                       </div>

                       <ChevronRight className="text-gray-200 group-hover:text-gray-400" size={16} />
                    </div>
                  ))}
               </div>

               <div className="mt-8 flex justify-center">
                  <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
                     导出影响报告 <ShieldAlert size={14} />
                  </button>
               </div>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center p-20 opacity-40">
               <GitPullRequest className="w-16 h-16 text-gray-300 mb-4" />
               <p className="text-sm font-medium text-gray-500">输入 API 名称并运行分析，以显示其在整个组织中的依赖关系。</p>
            </div>
         )}
      </div>
    </div>
  );
}
