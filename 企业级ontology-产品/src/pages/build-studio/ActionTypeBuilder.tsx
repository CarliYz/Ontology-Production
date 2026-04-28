import { useState, useEffect } from "react";
import { 
  Zap, 
  Settings2, 
  Plus, 
  Trash2, 
  Play, 
  ShieldCheck,
  Save,
  Cpu,
  Clock,
  Database,
  Terminal,
  Activity,
  FileCode,
  Globe
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useParams, useNavigate } from "react-router-dom";

interface Parameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Action {
  id: string;
  name: string;
  apiName: string;
  status: 'published' | 'draft';
  type: 'Function' | 'API' | 'Logic';
  logic: string;
  description: string;
  parameters: Parameter[];
}

export default function ActionTypeBuilder() {
  const { ontologyId } = useParams();
  const [actions, setActions] = useState<Action[]>([
    { 
      id: 'act-1', 
      name: '创建订单 (Create Order)', 
      apiName: 'createOrder', 
      status: 'published', 
      type: 'Function', 
      description: '处理订单创建流程，包含库存预扣和结算',
      parameters: [
        { id: 'p1', name: 'orderContent', type: 'Object', required: true, description: '订单基础数据' },
        { id: 'p2', name: 'userId', type: 'String', required: true, description: '用户ID' },
        { id: 'p3', name: 'couponCode', type: 'String', required: false, description: '优惠码' }
      ],
      logic: `/**
 * @param {Object} orderContent
 * @param {String} userId
 */
function execute(orderContent, userId) {
  // 1. 验证用户状态
  const user = Objects.User.get(userId);
  if (!user) throw new Error("Invalid User");

  // 2. 预扣库存
  const stock = Objects.Inventory.subtract(orderContent.items);
  
  // 3. 生成订单记录
  return Objects.Order.create({
    ...orderContent,
    status: 'PENDING',
    creator: userId,
    createdAt: new Date().toISOString()
  });
}` 
    },
    { 
      id: 'act-2', 
      name: '库存同步 (Sync Inventory)', 
      apiName: 'syncStock', 
      status: 'draft', 
      type: 'Logic',
      description: '跨区域仓库库存水平同步任务',
      parameters: [
        { id: 'p4', name: 'warehouseId', type: 'String', required: true, description: '目标仓库ID' }
      ],
      logic: `// 执行多端同步逻辑\nasync function sync() {\n  const data = await External.ERP.getInventory();\n  return Objects.Inventory.bulkUpdate(data);\n}`
    },
    {
      id: 'act-3',
      name: '检查用户权限 (Check Permissions)',
      apiName: 'checkUserPerms',
      status: 'published',
      type: 'Function',
      description: '动态权限检查函数',
      parameters: [
        { id: 'p5', name: 'userId', type: 'String', required: true, description: '用户ID' },
        { id: 'p6', name: 'resourceId', type: 'String', required: true, description: '资源ID' }
      ],
      logic: `function check(userId, resourceId) {\n  return Roles.canAccess(userId, resourceId);\n}`
    }
  ]);

  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const selectedAction = actions.find(a => a.id === selectedActionId) || null;
  const [activeTab, setActiveTab] = useState<'logic' | 'params' | 'config'>('logic');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<any>(null);

  const updateAction = (id: string, updates: Partial<Action>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addParameter = () => {
    if (!selectedActionId) return;
    const newParam: Parameter = {
      id: `p-${Date.now()}`,
      name: 'newParam',
      type: 'String',
      required: false,
      description: '参数描述'
    };
    updateAction(selectedActionId, {
      parameters: [...(selectedAction?.parameters || []), newParam]
    });
  };

  const removeParameter = (paramId: string) => {
    if (!selectedActionId) return;
    updateAction(selectedActionId, {
      parameters: selectedAction?.parameters.filter(p => p.id !== paramId)
    });
  };

  const handleTest = () => {
    setTestResult('Executing...');
    setTimeout(() => {
      setTestResult({
        status: 'success',
        timestamp: new Date().toISOString(),
        output: {
           id: "ORD-" + Math.floor(Math.random() * 100000),
           status: "PENDING",
           data: testInputs
        }
      });
    }, 1500);
  };

  const saveAction = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateAction(selectedActionId!, { status: 'published' });
      setIsSaving(false);
      alert("保存成功！动作已发布至运行时。");
    }, 1000);
  };

  const createAction = () => {
    const newId = `act-${Date.now()}`;
    const newAction: Action = {
      id: newId,
      name: '未命名动作',
      apiName: `action_${actions.length + 1}`,
      status: 'draft',
      type: 'Function',
      description: '新创建的操作描述',
      parameters: [],
      logic: `function execute() {\n  // 在此编写逻辑\n}`
    };
    setActions(prev => [...prev, newAction]);
    setSelectedActionId(newId);
  };

  return (
    <div className="flex h-full bg-white font-sans relative" id="action-builder">
      {/* Test Modal Overlay */}
      {isTesting && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-slate-800">测试执行: {selectedAction?.name}</h3>
                 <button onClick={() => { setIsTesting(false); setTestResult(null); }} className="text-slate-400 hover:text-slate-600 border border-slate-200 p-1.5 rounded-lg transition-colors">
                    <Plus size={20} className="rotate-45" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">输入参数 (Mock Inputs)</h4>
                    {selectedAction?.parameters.map(p => (
                       <div key={p.id} className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-600 block">{p.name}</label>
                          <input 
                             type="text" 
                             placeholder={p.type}
                             onChange={(e) => setTestInputs(prev => ({ ...prev, [p.name]: e.target.value }))}
                             className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          />
                       </div>
                    ))}
                    <button 
                       onClick={handleTest}
                       className="w-full h-11 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                       <Play size={16} className="fill-current" /> 运行测试
                    </button>
                 </div>
                 <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] text-green-400 overflow-auto border border-slate-800">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                       <span className="text-slate-500 uppercase tracking-widest text-[9px]">Execution Output</span>
                    </div>
                    {testResult === 'Executing...' ? (
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="animate-spin" /> 执行中...
                       </div>
                    ) : testResult ? (
                       <pre className="whitespace-pre-wrap leading-relaxed">
                          {JSON.stringify(testResult, null, 2)}
                       </pre>
                    ) : (
                       <span className="text-slate-600 italic">等待执行...</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* List Sidebar */}
      <div className="w-80 border-r border-[#e5e5e5] flex flex-col bg-[#fcfcfc] shrink-0">
        <div className="p-6 pb-4 border-b border-[#f3f4f6]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 shadow-md shadow-amber-200 flex items-center justify-center text-white">
                <Zap size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">动作与函数</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase font-bold">Action Registry</p>
              </div>
            </div>
          </div>
          <button 
            onClick={createAction}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-slate-200"
          >
            <Plus size={18} /> 新建操作
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {actions.map(action => (
            <button 
              key={action.id} 
              onClick={() => setSelectedActionId(action.id)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all border group relative",
                selectedActionId === action.id 
                  ? "bg-white border-[#106ba3] shadow-md ring-1 ring-[#106ba3]/5" 
                  : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={cn(
                  "p-1.5 rounded-lg",
                  action.type === 'Function' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                )}>
                  {action.type === 'Function' ? <FileCode size={16} /> : <Activity size={16} />}
                </div>
                <div className={cn(
                  "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest",
                  action.status === 'published' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                  {action.status}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1 truncate">{action.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono italic">/{action.apiName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
        {selectedAction ? (
          <>
            <header className="h-20 bg-white border-b border-[#e5e5e5] px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Database size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={selectedAction.name}
                      onChange={(e) => updateAction(selectedAction.id, { name: e.target.value })}
                      className="text-xl font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                    />
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase shrink-0">{selectedAction.type}</span>
                  </div>
                  <input 
                    type="text"
                    value={selectedAction.description}
                    onChange={(e) => updateAction(selectedAction.id, { description: e.target.value })}
                    className="text-xs text-slate-400 bg-transparent border-none p-0 focus:ring-0 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsTesting(true)}
                  className="h-9 px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 border border-slate-200 transition-colors"
                >
                  <Play size={14} className="fill-current" /> 测试执行
                </button>
                <button 
                  onClick={saveAction}
                  disabled={isSaving}
                  className={cn(
                    "h-9 px-5 bg-[#106ba3] hover:bg-[#0d5482] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-100",
                    isSaving && "opacity-70 cursor-wait"
                  )}
                >
                  {isSaving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
                  {isSaving ? "正在保存..." : "保存并发布"}
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col p-8 pb-0">
              {/* Tab Navigation */}
              <div className="flex gap-8 border-b border-slate-200 mb-6 shrink-0">
                {[
                  { id: 'logic', label: '业务逻辑', icon: Terminal },
                  { id: 'params', label: '输入参数', icon: Globe },
                  { id: 'config', label: '运行时配置', icon: Settings2 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative",
                      activeTab === tab.id ? "text-[#106ba3]" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#106ba3] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-20">
                {activeTab === 'logic' && (
                  <div className="h-full flex flex-col gap-4 min-h-[500px]">
                    <div className="flex-1 bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#333]">
                      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">EXECUTABLE_JS</span>
                      </div>
                      <div className="flex-1 relative font-mono text-xs overflow-hidden flex">
                           <div className="text-slate-600 text-right select-none pr-4 border-r border-[#333] p-6 bg-[#1a1a1a]">
                              {selectedAction.logic.split('\n').map((_, i) => (
                                <div key={i}>{i + 1}</div>
                              ))}
                           </div>
                           <textarea 
                              value={selectedAction.logic}
                              onChange={(e) => updateAction(selectedAction.id, { logic: e.target.value })}
                              spellCheck={false}
                              className="flex-1 p-6 bg-transparent text-blue-300 leading-relaxed font-mono resize-none outline-none border-none focus:ring-0"
                           />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'params' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">参数签名 (Parameters)</h4>
                       <button 
                        onClick={addParameter}
                        className="text-xs font-bold text-[#106ba3] flex items-center gap-1 hover:underline"
                       >
                          <Plus size={14} /> 添加参数
                       </button>
                    </div>
                    <div className="space-y-3">
                      {selectedAction.parameters.map(param => (
                        <div key={param.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm group hover:border-[#106ba3] transition-colors">
                          <div className="flex items-center gap-6 text-sm flex-1">
                            <select 
                              value={param.type}
                              onChange={(e) => {
                                const newParams = selectedAction.parameters.map(p => 
                                  p.id === param.id ? { ...p, type: e.target.value } : p
                                );
                                updateAction(selectedAction.id, { parameters: newParams });
                              }}
                              className="w-16 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-mono text-[10px] font-bold border border-slate-100 outline-none p-2 focus:border-blue-400 appearance-none"
                            >
                               <option value="String">STR</option>
                               <option value="Number">NUM</option>
                               <option value="Boolean">BOL</option>
                               <option value="Object">OBJ</option>
                            </select>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text"
                                  value={param.name}
                                  onChange={(e) => {
                                    const newParams = selectedAction.parameters.map(p => 
                                      p.id === param.id ? { ...p, name: e.target.value } : p
                                    );
                                    updateAction(selectedAction.id, { parameters: newParams });
                                  }}
                                  className="font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 outline-none w-32"
                                />
                                <button 
                                  onClick={() => {
                                    const newParams = selectedAction.parameters.map(p => 
                                      p.id === param.id ? { ...p, required: !p.required } : p
                                    );
                                    updateAction(selectedAction.id, { parameters: newParams });
                                  }}
                                  className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded tracking-tighter transition-colors",
                                    param.required ? "text-red-500 bg-red-50" : "text-slate-400 bg-slate-50"
                                  )}
                                >
                                  {param.required ? 'REQUIRED' : 'OPTIONAL'}
                                </button>
                              </div>
                              <input 
                                type="text"
                                value={param.description}
                                onChange={(e) => {
                                  const newParams = selectedAction.parameters.map(p => 
                                    p.id === param.id ? { ...p, description: e.target.value } : p
                                  );
                                  updateAction(selectedAction.id, { parameters: newParams });
                                }}
                                className="text-xs text-slate-400 bg-transparent border-none p-0 focus:ring-0 w-full outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => removeParameter(param.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                            >
                               <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectedAction.parameters.length === 0 && (
                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                           <Globe size={32} className="mb-2 opacity-20" />
                           <p className="text-xs font-medium">暂无输入参数</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'config' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ConfigCard 
                      title="系统配置" 
                      items={[
                        { label: '执行超时 (Timeout)', value: '45s', icon: Clock },
                        { label: '内存分配 (Memory)', value: '256 MB', icon: Cpu },
                        { label: '底层运行时', value: 'Node 20.x', icon: Terminal }
                      ]} 
                    />
                    <ConfigCard 
                      title="安全隔离" 
                      items={[
                        { label: '执行角色', value: 'SYSTEM_ADMIN', icon: ShieldCheck },
                        { label: '外部网络访问', value: 'Allowed', icon: Globe },
                        { label: '缓存策略', value: 'None', icon: Save }
                      ]} 
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50/20">
             <div className="text-center max-w-xs space-y-6">
                <div className="w-24 h-24 rounded-[32px] bg-white border border-[#e5e5e5] shadow-xl flex items-center justify-center text-slate-200 mx-auto transform -rotate-12">
                   <Zap size={48} className="fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">未选择操作项</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">从左侧列表中选择一个动作或函数开始编辑。定义业务逻辑并配置执行参数。</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfigCard({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
      <div className="space-y-4 flex-1">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <item.icon size={14} />
              </div>
              <span className="text-xs text-slate-600 font-medium">{item.label}</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-all">
        修改配置
      </button>
    </div>
  );
}
