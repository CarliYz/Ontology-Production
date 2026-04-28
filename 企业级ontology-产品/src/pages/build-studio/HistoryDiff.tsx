import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  GitCommit, 
  History, 
  ArrowRight, 
  FileDiff, 
  Clock, 
  User,
  Plus,
  Minus
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Version {
  id: string;
  version: string;
  status: string;
  changelog: string;
  created_at: string;
}

export default function HistoryDiff() {
  const { ontologyId } = useParams();
  const [history, setHistory] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ontologies/${ontologyId}/versions`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        if (data.length > 0) setSelectedVersion(data[0]);
        setLoading(false);
      });
  }, [ontologyId]);

  return (
    <div className="flex h-full overflow-hidden bg-white" id="history-diff">
      {/* Version Sidebar */}
      <div className="w-80 border-r border-tech flex flex-col bg-gray-50/20">
        <header className="p-4 border-b border-tech bg-white/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">版本历史</h2>
          <History size={14} className="text-gray-400" />
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Current Draft Pseudo-version */}
          <button 
             className={cn(
               "w-full p-4 rounded-lg border-2 text-left transition-all relative overflow-hidden",
               !selectedVersion ? "border-[#106ba3] bg-[#e1f0f9]/30" : "border-transparent bg-white hover:border-gray-200"
             )}
             onClick={() => setSelectedVersion(null)}
          >
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded uppercase">Current Draft</span>
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             </div>
             <p className="text-sm font-bold text-gray-800 truncate mb-1">未发布的变更</p>
             <p className="text-[11px] text-gray-500 italic">正在编辑中...</p>
          </button>

          <div className="h-px bg-tech mx-4 my-2" />

          {history.map(ver => (
            <button
              key={ver.id}
              onClick={() => setSelectedVersion(ver)}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all group",
                selectedVersion?.id === ver.id ? "border-[#106ba3] bg-[#e1f0f9]/30" : "border-transparent bg-white hover:border-gray-200 shadow-sm"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-[#106ba3]">{ver.version}</span>
                <span className="text-[10px] text-gray-400 font-mono">{new Date(ver.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3 leading-tight">{ver.changelog}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={10} /> admin
                </div>
                {ver.status === 'published' && (
                  <div className="flex items-center gap-1 text-green-600">
                    <History size={10} /> Published
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Diff Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-6 border-b border-tech bg-white shrink-0">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded text-gray-400">
                <FileDiff size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">结构差异对比</h1>
                <p className="text-sm text-gray-500">
                  {selectedVersion ? `对比 ${selectedVersion.version} 版本的定义。` : '对比当前工作区与最新发布版本的差异。'}
                </p>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#fbfbfc] tech-grid">
           <div className="max-w-5xl mx-auto space-y-8">
              {/* Mock Diff Content */}
              <div className="bg-white border border-tech rounded-xl shadow-sm divide-y divide-tech overflow-hidden">
                 <div className="p-4 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Changes in Object Types</span>
                    <span className="text-[10px] font-mono text-gray-400">2 Modifications</span>
                 </div>
                 
                 <div className="p-6 space-y-6">
                    {/* Item 1 */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-2">
                          <Plus size={16} className="text-green-500" />
                          <span className="text-sm font-bold text-gray-800">New Object Type: Warehouse</span>
                       </div>
                       <div className="ml-6 pl-4 border-l border-tech space-y-2">
                          <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                            + api_name: Warehouse <br />
                            + display_name: 仓库 <br />
                            + primary_key: warehouseId
                          </p>
                       </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-2">
                          <GitCommit size={16} className="text-blue-500" />
                          <span className="text-sm font-bold text-gray-800">Modified Object Type: User</span>
                       </div>
                       <div className="ml-6 pl-4 border-l border-tech space-y-2">
                          <div className="flex items-start gap-4">
                             <div className="flex-1 bg-red-50 p-2 rounded border border-red-100">
                                <span className="text-[9px] uppercase font-bold text-red-400 block mb-1">Before</span>
                                <p className="text-xs text-red-600 font-mono line-through truncate">display_name: 系统用户</p>
                             </div>
                             <ArrowRight className="mt-6 text-gray-300" size={16} />
                             <div className="flex-1 bg-green-50 p-2 rounded border border-green-100">
                                <span className="text-[9px] uppercase font-bold text-green-400 block mb-1">After</span>
                                <p className="text-xs text-green-600 font-mono">display_name: 用户</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
