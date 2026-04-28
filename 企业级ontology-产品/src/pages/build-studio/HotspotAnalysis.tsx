import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  Zap, 
  Clock, 
  Database,
  ArrowUpRight,
  Filter,
  Download,
  AlertTriangle,
  History
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface Hotspot {
  entity_type: string;
  entity_ref: string;
  frequency: number;
  avg_cost: number;
}

export default function HotspotAnalysis() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analysis/hotspots")
      .then(res => res.json())
      .then(data => {
        setHotspots(data);
        setLoading(false);
      });
  }, []);

  const chartData = hotspots.map(h => ({
    name: h.entity_ref,
    freq: h.frequency,
    cost: h.avg_cost
  }));

  return (
    <div className="flex flex-col h-full bg-white" id="hotspot-analysis">
      <header className="p-8 border-b border-tech bg-white shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-[#106ba3]" />
            <h1 className="text-xl font-bold">热点分析 (Hotspot Analysis)</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary py-1.5 px-3 flex items-center gap-2 text-xs">
              <Download size={14} /> 导出报表
            </button>
            <button className="btn-secondary py-1.5 px-3 flex items-center gap-2 text-xs">
              <History size={14} /> 历史趋势
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex-1 max-w-sm relative">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
             <input type="text" placeholder="过滤对象或链接..." className="input-base w-full pl-8 h-9 text-xs" />
           </div>
           <div className="flex gap-4">
              <button className="px-3 py-1.5 bg-[#e1f0f9] text-[#106ba3] rounded-full text-[10px] font-bold uppercase border border-[#106ba3]/20">按访问频率</button>
              <button className="px-3 py-1.5 bg-white text-gray-500 rounded-full text-[10px] font-bold uppercase border border-tech hover:border-gray-300">按响应延时</button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 tech-grid">
         <div className="max-w-6xl mx-auto space-y-10">
            {/* Chart Area */}
            <section className="bg-white border border-tech rounded-2xl p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">24小时访问强度分布</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <div className="w-2.5 h-2.5 rounded bg-[#106ba3]" /> 访问频次
                     </div>
                  </div>
               </div>
               
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                        cursor={{ fill: 'rgba(16, 107, 163, 0.05)' }} 
                      />
                      <Bar dataKey="freq" fill="#106ba3" radius={[4, 4, 0, 0]} barSize={40}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </section>

            <div className="grid grid-cols-3 gap-8">
               <div className="col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">最高频访问实体</h3>
                  <div className="bg-white border border-tech rounded-xl overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-tech">
                           <tr>
                              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">实体</th>
                              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">类型</th>
                              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">访问频次</th>
                              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Cost</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-tech">
                           {hotspots.map((h, i) => (
                             <tr key={h.entity_ref} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <Database size={14} className="text-blue-500" />
                                      <span className="text-sm font-bold text-gray-700">{h.entity_ref}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className="text-[10px] text-gray-400 font-mono uppercase">{h.entity_type}</span>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-mono font-bold text-gray-800">{h.frequency}</span>
                                      <ArrowUpRight size={12} className="text-green-500" />
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className="text-xs text-gray-500 font-mono">{h.avg_cost}s</span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">性能洞察</h3>
                  <div className="space-y-4">
                     <section className="p-5 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-700">
                           <AlertTriangle size={18} />
                           <h4 className="text-xs font-bold uppercase tracking-wider">高负荷警告</h4>
                        </div>
                        <p className="text-[11px] text-amber-600 leading-relaxed font-medium">
                          实体 <b>User</b> 的访问频率在过去 1 小时内激增了 45%，建议检查源应用 <b>Warehouse Mobile</b> 是否存在过度轮询行为。
                        </p>
                        <button className="text-[10px] font-bold text-amber-700 uppercase border-b border-amber-400/30 pb-0.5 hover:border-amber-400 transition-all">
                           查看应用监控报告
                        </button>
                     </section>

                     <section className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-indigo-700">
                           <Zap size={18} />
                           <h4 className="text-xs font-bold uppercase tracking-wider">自动扩缩容建议</h4>
                        </div>
                        <p className="text-[11px] text-indigo-600 leading-relaxed font-medium">
                          基于热点分析，建议为 <b>Order</b> 对象所在的数据分片增加 50% 的缓存资源，预计可降低平均耗时约 40ms。
                        </p>
                        <button className="btn-primary py-1.5 px-4 text-[10px] uppercase font-bold tracking-widest bg-indigo-600 hover:bg-indigo-700">
                           实施建议
                        </button>
                     </section>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
