import { useState } from "react";
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Lock, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Activity, 
  Server, 
  Fingerprint, 
  Settings, 
  Database,
  ArrowUpRight,
  Filter,
  RefreshCcw,
  Zap,
  Clock,
  Box
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const auditData = [
  { user: 'karlee@palantir', action: '修改了 "Order" 对象属性签名', time: '12:45:02', status: 'Approved', type: 'Schema' },
  { user: 'admin_sys', action: '执行了全局缓存清理', time: '11:20:15', status: 'Success', type: 'System' },
  { user: 'dev_user_09', action: '尝试访问 "SecretKey" 属性被拦截', time: '09:15:44', status: 'Denied', type: 'Security' },
  { user: 'manager_lee', action: '创建了新的数据脱敏策略 [PII-Redact]', time: '昨天', status: 'Approved', type: 'Policy' },
];

const perfData = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 900 },
  { time: '12:00', value: 650 },
  { time: '16:00', value: 800 },
  { time: '20:00', value: 500 },
  { time: '23:59', value: 450 },
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'access' | 'policies'>('metrics');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsScanning(false), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden" id="governance-page">
      {/* Header Overlay for Scanning */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 bg-blue-600 text-white px-8 py-3 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
               <RefreshCcw size={18} className="animate-spin" />
               <span className="text-sm font-bold">正在执行全局合规性扫描... {scanProgress}%</span>
            </div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-white" 
                 initial={{ width: 0 }}
                 animate={{ width: `${scanProgress}%` }}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white border-b border-slate-200 px-8 py-6 shrink-0 shadow-sm relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
                 <ShieldCheck size={28} />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">治理与运维</h1>
                  <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.3em] mt-0.5">Governance & Operations</p>
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={startScan} 
              disabled={isScanning}
              className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
             >
                <RefreshCcw size={14} className={cn(isScanning && "animate-spin")} /> 
                {isScanning ? "正在扫描..." : "合规性自检"}
             </button>
             <button className="h-11 px-6 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group">
                <Zap size={14} className="group-hover:fill-current" /> 弹性扩容
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-10">
           {[
             { id: 'metrics', label: '健康指标', icon: Activity },
             { id: 'access', label: '审计日志', icon: Fingerprint },
             { id: 'policies', label: '治理策略', icon: Settings }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative",
                 activeTab === tab.id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
               )}
             >
               <tab.icon size={14} />
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="gov-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]" />
               )}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#fcfcfc]">
         <AnimatePresence mode="wait">
           {activeTab === 'metrics' && (
             <motion.div 
               key="metrics"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-10"
             >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   <StatsCard label="服务可用性" value="99.98%" change="Healthy" icon={Server} color="blue" />
                   <StatsCard label="合规完成度" value="99.2%" change="+0.4%" icon={CheckCircle2} color="green" />
                   <StatsCard label="API 中值延迟" value="124ms" change="Stable" icon={Zap} color="purple" />
                   <StatsCard label="安全警报" value="02" change="-12" icon={AlertCircle} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                   <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                         <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">平台负载趋势</h3>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Real-time throughput metrics</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-blue-500" />
                               <span className="text-[10px] font-bold text-slate-500 uppercase">Requests</span>
                            </div>
                            <button className="p-2 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><Settings size={14} /></button>
                         </div>
                      </div>
                      <div className="h-72 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={perfData}>
                               <defs>
                                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                               <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                               <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                               />
                               <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[300px]">
                         <div>
                            <h3 className="text-2xl font-black mb-1">资源限制</h3>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-10">Usage Quota</p>
                            
                            <div className="space-y-8">
                               <ResourceBar label="数据存储层" used={6.8} total={10} unit="TB" />
                               <ResourceBar label="核心索引内存" used={24} total={64} unit="GB" />
                               <ResourceBar label="计算单元 (CPU)" used={32} total={100} unit="Units" />
                            </div>
                         </div>
                         <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
                            <Activity size={300} />
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'access' && (
             <motion.div 
               key="access"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                   <div className="flex items-center gap-6">
                      <div className="relative">
                         <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           type="text" 
                           placeholder="根据用户、路径或动作搜索..." 
                           className="pl-12 pr-6 h-12 w-80 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-medium outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                         />
                      </div>
                      <button className="flex items-center gap-2 px-5 h-12 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
                         <Filter size={14} /> 进阶筛选
                      </button>
                   </div>
                   <button className="px-6 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-[1.25rem] transition-all flex items-center gap-2">
                     <ArrowUpRight size={14} /> 导出审计日志
                   </button>
                </div>
                <div className="divide-y divide-slate-100">
                   {auditData.map((log, i) => (
                     <div key={i} className="px-10 py-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-8">
                           <div className={cn(
                             "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:rotate-12",
                             log.status === 'Denied' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400"
                           )}>
                              {log.status === 'Denied' ? <Lock size={24} /> : <Eye size={24} />}
                           </div>
                           <div>
                              <div className="flex items-center gap-4 mb-1">
                                 <p className="text-base font-black text-slate-900 tracking-tight">{log.action}</p>
                                 <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-bold uppercase tracking-widest">{log.type}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                                 <span className="flex items-center gap-1.5"><Users size={12} /> {log.user}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                                 <span className="flex items-center gap-1.5"><Clock size={12} /> {log.time}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-12">
                           <span className={cn(
                             "text-[10px] font-black px-4 py-1.5 rounded-full border tracking-widest uppercase",
                             log.status === 'Approved' ? "bg-blue-50 text-blue-600 border-blue-100" :
                             log.status === 'Success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                             "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50"
                           )}>
                             {log.status}
                           </span>
                           <button className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                              <ArrowUpRight size={18} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
           )}

           {activeTab === 'policies' && (
              <motion.div 
                key="policies"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                 <PolicyCard 
                   title="敏感数据动态脱敏" 
                   desc="自动识别并遮蔽符合 PII 特征的字段，如手机号、实名信息等，仅限授权角解密。"
                   active={true}
                   icon={Eye}
                 />
                 <PolicyCard 
                   title="双重身份验证 (2FA)" 
                   desc="核心对象元数据修改与批量动作发布必须通过第二因子身份验证。"
                   active={false}
                   icon={Lock}
                 />
                 <PolicyCard 
                   title="自动归档策略" 
                   desc="超过 12 个月未被任何应用调用的对象实例将自动转入冷存储层以降低成本。"
                   active={true}
                   icon={Database}
                 />
                 <PolicyCard 
                   title="异常流量熔断" 
                   desc="单个用户 API 请求频率超过 100 0/s 时，触发临时 IP 封禁与告警。"
                   active={true}
                   icon={AlertCircle}
                 />
                 <PolicyCard 
                   title="版本回滚保护" 
                   desc="本体 Schema 的破坏性变更至少保留 7 天的版本快照，支持秒级回滚。"
                   active={true}
                   icon={RefreshCcw}
                 />
                 <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-all cursor-pointer">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-500 mb-6 transition-all group-hover:scale-110">
                       <Plus size={40} />
                    </div>
                    <h3 className="font-bold text-slate-900">定义新策略</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium">使用 Governance SDK 自定义规则</p>
                 </div>
              </motion.div>
           )}
         </AnimatePresence>
      </main>
    </div>
  );
}

function StatsCard({ label, value, change, icon: Icon, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-indigo-50 text-indigo-600",
    red: "bg-rose-50 text-rose-600"
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
       <div className="flex items-center gap-4 mb-6">
          <div className={cn("p-3 rounded-2xl", colors[color as keyof typeof colors])}>
             <Icon size={20} />
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
       </div>
       <div className="flex items-end justify-between">
          <span className="text-4xl font-black font-mono text-slate-900 tracking-tighter leading-none">{value}</span>
          <div className={cn(
             "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
             change.startsWith('+') || change === 'Healthy' || change === 'Stable' 
               ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
               : "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50"
          )}>
             {change}
          </div>
       </div>
    </div>
  );
}

function ResourceBar({ label, used, total, unit }: any) {
  const percent = (used / total) * 100;
  return (
    <div className="space-y-3">
       <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.1em]">
          <span className="text-slate-500">{label}</span>
          <span className="text-white">{used} <span className="text-slate-600">/ {total} {unit}</span></span>
       </div>
       <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={cn(
              "h-full rounded-full transition-colors",
              percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-blue-500"
            )}
          />
       </div>
    </div>
  );
}

function PolicyCard({ title, desc, active, icon: Icon }: any) {
  const [isActive, setIsActive] = useState(active);
  return (
    <div className={cn(
      "bg-white border rounded-[3rem] p-10 shadow-sm transition-all relative overflow-hidden group",
      isActive ? "border-slate-200" : "border-slate-100 opacity-50"
    )}>
       <div className="flex justify-between items-start mb-8">
          <div className={cn(
            "p-5 rounded-[1.5rem] shadow-xl transition-all duration-500",
            isActive ? "bg-blue-600 text-white shadow-blue-100" : "bg-slate-100 text-slate-400 shadow-none"
          )}>
             <Icon size={32} />
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={cn(
               "w-14 h-7 rounded-full p-1 transition-colors relative",
               isActive ? "bg-blue-600" : "bg-slate-200"
            )}
          >
             <motion.div 
               animate={{ x: isActive ? 28 : 0 }}
               className="w-5 h-5 bg-white rounded-full shadow-lg" 
             />
          </button>
       </div>
       <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">{title}</h3>
       <p className="text-xs text-slate-400 leading-relaxed font-bold mb-10">{desc}</p>
       
       <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} /> 3天前更
          </span>
          <button className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors uppercase tracking-widest">配置参数</button>
       </div>
    </div>
  );
}

function Plus({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
