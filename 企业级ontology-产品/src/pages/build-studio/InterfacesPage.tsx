import { useState } from "react";
import { 
  Layout, 
  Palette, 
  Monitor, 
  Smartphone, 
  Box,
  Users,
  Layers, 
  MousePointer2, 
  ExternalLink, 
  ArrowLeft,
  Save,
  Play,
  Settings2,
  Trash2,
  ChevronRight,
  Database,
  BarChart3,
  Heading,
  FormInput,
  GalleryVertical,
  Undo2,
  Redo2,
  Eye,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface CanvasComponent {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  icon: any;
}

export default function InterfacesPage() {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([
    { id: 'c1', type: 'Header', label: '库存监控看板 v2', x: 0, y: 0, w: 12, h: 2, icon: Heading, dataSource: null, action: null } as any,
    { id: 'c2', type: 'Chart', label: '实时吞吐量统计', x: 0, y: 2, w: 8, h: 6, icon: BarChart3, dataSource: null, action: null } as any,
    { id: 'c3', type: 'List', label: '异常警报队列', x: 8, y: 2, w: 4, h: 6, icon: GalleryVertical, dataSource: null, action: null } as any,
  ]);

  const [showDataSource, setShowDataSource] = useState(false);
  const [showActionSelector, setShowActionSelector] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [objectTypes] = useState([
    { id: 'ot1', name: '订单 (Order)', icon: Database },
    { id: 'ot2', name: '库存 (Inventory)', icon: Box },
    { id: 'ot3', name: '用户 (User)', icon: Users },
  ]);

  const [availableActions] = useState([
    { id: 'act1', name: '创建订单', api: 'createOrder' },
    { id: 'act2', name: '同步库存', api: 'syncStock' },
    { id: 'act3', name: '发放优惠券', api: 'giveCoupon' },
  ]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<'validate' | 'confirm' | 'success'>('validate');

  const selectedComp = canvasComponents.find(c => c.id === selectedCompId);

  const updateCompProperty = (id: string, key: string, value: any) => {
    setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const addComponent = (type: string, label: string, icon: any) => {
    const newComp: CanvasComponent = {
      id: `c-${Date.now()}`,
      type,
      label,
      x: 0, y: 0, // Simplified for now
      w: type === 'Header' ? 12 : type === 'Chart' ? 8 : 4,
      h: type === 'Header' ? 2 : 6,
      icon,
      dataSource: null,
      action: null
    } as any;
    setCanvasComponents([...canvasComponents, newComp]);
    setSelectedCompId(newComp.id);
  };

  const removeComponent = (id: string) => {
    setCanvasComponents(canvasComponents.filter(c => c.id !== id));
    if (selectedCompId === id) setSelectedCompId(null);
  };

  const onPublish = () => {
    setIsPublishing(true);
    setPublishStep('validate');
    setTimeout(() => setPublishStep('confirm'), 2000);
  };

  // Dashboard View
  if (!editingAppId) {
    // ... existing dashboard code ...
    return (
      <div className="flex flex-col h-full bg-[#fcfcfc] p-10 overflow-y-auto" id="interfaces-dashboard">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center">
                 <Layout size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">界面与应用</h1>
                <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.3em] mt-1">Application Builder</p>
              </div>
            </div>
            <p className="text-slate-500 max-w-xl text-sm leading-relaxed font-medium">
              构建基于图谱数据的业务工具。将复杂的数据关系转化为直观的操作界面。
            </p>
          </div>
          <button 
            onClick={() => setEditingAppId('new')}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 创建新应用
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AppCard 
            title="库存监控看板" 
            type="Dashboard" 
            platform="Web" 
            updated="2小时前" 
            icon={Monitor}
            color="blue"
            onClick={() => setEditingAppId('app-1')}
          />
          <AppCard 
            title="现场物流助手" 
            type="Form" 
            platform="Mobile" 
            updated="昨天" 
            icon={Smartphone}
            color="green"
            onClick={() => setEditingAppId('app-2')}
          />
          <div className="border border-slate-200 bg-slate-50/50 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-white transition-all cursor-pointer shadow-sm">
             <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-500 mb-6 transition-all group-hover:scale-110">
                <Plus size={32} />
             </div>
             <h3 className="font-bold text-slate-900">查看模版库</h3>
             <p className="text-xs text-slate-400 mt-2 font-medium">从行业沉淀的优秀设计开始</p>
          </div>
        </div>

        <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative group shadow-2xl">
           <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6 backdrop-blur-md">
                 New Feature
              </div>
              <h3 className="text-4xl font-extrabold leading-tight mb-8">
                将定义的动作 (Actions)<br /> 
                <span className="text-blue-400 underline decoration-blue-800 underline-offset-8">无缝绑定</span> 到 UI 按钮
              </h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                直接从对象图谱中拉取逻辑函数。无需编写前端业务代码，通过低代码方式即可完成复杂的业务流程编排。
              </p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-900/40">
                   立即开始构建 <ChevronRight size={18} />
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-sm transition-all">
                   查看示例文档
                </button>
              </div>
           </div>
           <Palette size={400} className="absolute -bottom-20 -right-20 text-white/5 transform rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
        </section>
      </div>
    );
  }

  // Builder View
  return (
    <div className="flex h-full bg-slate-50 overflow-hidden relative" id="interface-builder">
      {/* Publish Modal Overlay */}
      <AnimatePresence>
        {isPublishing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsPublishing(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
             >
                {publishStep === 'validate' && (
                  <div className="p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto">
                       <CheckCircle2 size={40} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">正在打包应用资产</h3>
                       <p className="text-sm text-slate-500 mt-2">正在编译业务逻辑、检查组件依赖项...</p>
                    </div>
                    <div className="space-y-3 pt-6">
                       <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-400">
                          UI Component Hierarchy: Optimized
                       </div>
                       <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-400">
                          Action Bindings: 100% Reliable
                       </div>
                    </div>
                  </div>
                )}

                {publishStep === 'confirm' && (
                  <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-2xl font-black text-slate-900">发布应用预览</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Version v1.0.4 - Production Ready</p>
                       </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      发布后，应用将部署至「用户工作区」。所有绑定的对象类型和 Action 将会自动继承现有的安全策略。
                    </p>
                    <div className="flex gap-4">
                       <button onClick={() => setIsPublishing(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">取消</button>
                       <button 
                         onClick={() => {
                            setPublishStep('success');
                            setTimeout(() => setIsPublishing(false), 2000);
                         }}
                         className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100"
                       >
                         开始发布
                       </button>
                    </div>
                  </div>
                )}

                {publishStep === 'success' && (
                  <div className="p-10 text-center space-y-4 bg-emerald-600 text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black">应用已发布！</h3>
                    <p className="text-sm opacity-90">实例预览地址已同步至工作区。</p>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selector Overlays */}
      <AnimatePresence>
        {showDataSource && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-bold text-slate-900">选择数据源</h3>
                   <button onClick={() => setShowDataSource(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Plus size={24} className="rotate-45" /></button>
                </div>
                <div className="p-8 space-y-3">
                   {objectTypes.map(ot => (
                      <button 
                        key={ot.id} 
                        onClick={() => {
                          updateCompProperty(selectedCompId!, 'dataSource', ot.name);
                          setShowDataSource(false);
                        }}
                        className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-3xl transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm">
                               <ot.icon size={20} />
                            </div>
                            <span className="font-bold text-sm">{ot.name}</span>
                         </div>
                         <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                   ))}
                </div>
             </motion.div>
          </motion.div>
        )}

        {showActionSelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-bold text-slate-900">绑定业务动作</h3>
                   <button onClick={() => setShowActionSelector(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Plus size={24} className="rotate-45" /></button>
                </div>
                <div className="p-8 space-y-3">
                   {availableActions.map(act => (
                      <button 
                        key={act.id} 
                        onClick={() => {
                          updateCompProperty(selectedCompId!, 'action', act.name);
                          setShowActionSelector(false);
                        }}
                        className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-amber-500 hover:text-white rounded-3xl transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-amber-600 shadow-sm">
                               <Play size={18} className="fill-current" />
                            </div>
                            <div>
                               <p className="font-bold text-sm text-left">{act.name}</p>
                               <p className="text-[10px] opacity-60 font-mono tracking-tighter">API: /{act.api}</p>
                            </div>
                         </div>
                         <Plus size={18} />
                      </button>
                   ))}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Sidebar - Components */}
      {!isPreview && (
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <button 
              onClick={() => setEditingAppId(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest mb-6"
            >
              <ArrowLeft size={14} /> 返回列表
            </button>
            <h2 className="text-lg font-bold text-slate-900">组件库</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            <ComponentGroup title="布局组件" items={[
              { name: '分栏布局', type: 'Layout', icon: Layout },
              { name: '页眉容器', type: 'Header', icon: Heading },
              { name: '标签页', type: 'Tabs', icon: Layers }
            ]} onAdd={addComponent} />

            <ComponentGroup title="数据展示" items={[
              { name: '实时图表', type: 'Chart', icon: BarChart3 },
              { name: '对象列表', type: 'List', icon: GalleryVertical },
              { name: '统计卡片', type: 'Stats', icon: Database }
            ]} onAdd={addComponent} />

            <ComponentGroup title="交互输入" items={[
              { name: '输入框', type: 'Input', icon: FormInput },
              { name: '选择器', type: 'Select', icon: MousePointer2 },
              { name: '功能按钮', type: 'Button', icon: Plus }
            ]} onAdd={addComponent} />
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#eff1f4]">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button className="p-2 rounded-lg bg-white text-blue-600 shadow-sm"><Monitor size={16} /></button>
               <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600"><Smartphone size={16} /></button>
             </div>
             <div className="h-4 w-[1px] bg-slate-200 mx-2" />
             <div className="flex items-center gap-1">
               <button className="p-2 text-slate-400 hover:text-slate-600"><Undo2 size={16} /></button>
               <button className="p-2 text-slate-400 hover:text-slate-600"><Redo2 size={16} /></button>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsPreview(!isPreview)}
              className={cn(
                "px-4 h-9 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors",
                isPreview ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              )}
            >
               {isPreview ? <MousePointer2 size={14} /> : <Eye size={14} />}
               {isPreview ? "编辑模式" : "预览模式"}
             </button>
             <button 
              onClick={onPublish}
              className="px-5 h-10 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-200"
            >
               <Save size={14} /> 保存并发布
             </button>
          </div>
        </header>

        <div className={cn(
          "flex-1 p-12 flex justify-center overflow-auto custom-scrollbar transition-all duration-300",
          isPreview ? "p-0 bg-white" : "p-12"
        )}>
           <div className={cn(
             "w-full max-w-5xl bg-white border border-slate-200 shadow-2xl min-h-screen p-8 relative overflow-hidden transition-all duration-500",
             isPreview ? "rounded-none max-w-full border-none shadow-none" : "rounded-[2rem]"
           )}>
              {!isPreview && <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />}
              
              <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(64px,auto)] relative">
                {canvasComponents.map(comp => (
                  <motion.div 
                    layoutId={comp.id}
                    key={comp.id}
                    onClick={() => !isPreview && setSelectedCompId(comp.id)}
                    className={cn(
                      "rounded-3xl border transition-all relative group overflow-hidden",
                      isPreview ? "border-transparent" : "p-4 flex flex-col justify-center items-center gap-3",
                      !isPreview && "cursor-pointer",
                      selectedCompId === comp.id && !isPreview
                        ? "bg-blue-50/50 border-blue-500 shadow-xl shadow-blue-100/50 ring-4 ring-blue-50" 
                        : "bg-white border-slate-100 shadow-sm",
                      !isPreview && "hover:border-blue-200"
                    )}
                    style={{
                      gridColumn: `span ${comp.w}`,
                      gridRow: `span ${comp.h}`
                    }}
                  >
                    {!isPreview ? (
                      <>
                        <div className={cn(
                          "p-3 rounded-xl",
                          comp.type === 'Chart' ? "bg-amber-100 text-amber-600" :
                          comp.type === 'Header' ? "bg-slate-100 text-slate-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                           <comp.icon size={comp.type === 'Header' ? 20 : 32} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{comp.label}</span>
                        
                        {(comp as any).dataSource && (
                          <span className="absolute bottom-2 right-2 text-[8px] font-mono font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 uppercase">
                            {(comp as any).dataSource}
                          </span>
                        )}

                        {selectedCompId === comp.id && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                             <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    ) : (
                      <PreviewRenderer component={comp} />
                    )}
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <AnimatePresence>
        {selectedCompId && !isPreview && (
          <motion.div 
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <Settings2 size={16} />
                 </div>
                 <h3 className="text-sm font-bold text-slate-900">组件属性</h3>
               </div>
               <button onClick={() => setSelectedCompId(null)} className="text-slate-400 hover:text-slate-600">
                  <Plus size={18} className="rotate-45" />
               </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">基础信息</label>
                <div className="space-y-3 font-medium">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-500">显示名称</span>
                    <input 
                      type="text" 
                      value={canvasComponents.find(c => c.id === selectedCompId)?.label || ''}
                      onChange={(e) => {
                        setCanvasComponents(prev => prev.map(c => c.id === selectedCompId ? { ...c, label: e.target.value } : c));
                      }}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">数据源绑定</label>
                <button 
                  onClick={() => setShowDataSource(true)}
                  className={cn(
                    "w-full h-12 border-2 rounded-xl flex items-center justify-center gap-3 text-xs font-bold transition-all group",
                    (selectedComp as any)?.dataSource 
                      ? "bg-blue-50 border-blue-200 text-blue-600" 
                      : "border-dashed border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
                  )}
                >
                   {(selectedComp as any)?.dataSource ? (
                      <>
                        <Database size={16} /> {(selectedComp as any).dataSource}
                      </>
                   ) : (
                      <>
                        <Plus size={16} className="text-slate-300 group-hover:text-blue-400" /> 选择对象类型
                      </>
                   )}
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">交互动作 (Interaction)</label>
                <button 
                  onClick={() => setShowActionSelector(true)}
                  className={cn(
                    "w-full h-12 border rounded-2xl p-4 flex items-center justify-between text-left transition-all",
                    (selectedComp as any)?.action 
                      ? "bg-amber-50 border-amber-200" 
                      : "bg-slate-50 border-slate-100 hover:border-amber-200"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                        (selectedComp as any)?.action ? "bg-white text-amber-600" : "bg-white text-slate-400"
                      )}>
                         <Play size={14} className={(selectedComp as any)?.action ? "fill-current" : ""} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">点击时执行</span>
                        <span className="text-xs text-slate-600 font-bold">{(selectedComp as any)?.action || '未绑定动作'}</span>
                      </div>
                   </div>
                   <ChevronRight size={14} className="text-slate-300" />
                </button>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <div className="bg-blue-50 text-blue-600 rounded-2xl p-6 relative overflow-hidden group">
                   <h4 className="text-[11px] font-bold mb-2">架构完整性</h4>
                   <p className="text-[10px] leading-relaxed opacity-80 mb-4">
                     该应用包含敏感数据展示，已自动继承图谱层级的访问策略。
                   </p>
                   <div className="flex items-center gap-1 text-[10px] font-bold underline cursor-pointer">
                      查看安全详情 <ExternalLink size={10} />
                   </div>
                   <CheckCircle2 size={64} className="absolute -bottom-4 -right-4 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppCard({ title, type, platform, updated, icon: Icon, color, onClick }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-200/50 shadow-blue-50",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200/50 shadow-emerald-50"
  };
  
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={cn("p-4 rounded-[1.25rem] border shadow-lg", colors[color as keyof typeof colors])}>
             <Icon size={24} />
          </div>
          <div className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-[0.2em]">
             {platform}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <div className="flex items-center gap-4 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
           <span className="flex items-center gap-1.5"><Layers size={12} /> {type}</span>
           <span className="w-1 h-1 rounded-full bg-slate-300" />
           <span>更新于 {updated}</span>
        </div>
      </div>
    </div>
  );
}

function ComponentGroup({ title, items, onAdd }: { title: string, items: any[], onAdd: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {items.map(item => (
          <button 
            key={item.name} 
            onClick={() => onAdd(item.type, item.name, item.icon)}
            className="w-full flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
              <item.icon size={18} />
            </div>
            <span className="text-xs font-bold text-slate-700">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewRenderer({ component }: { component: any }) {
  if (component.type === 'Header' || component.label.includes('页眉')) {
    return (
      <div className="w-full h-full flex items-center justify-between px-8 bg-slate-900 text-white min-h-[80px]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
             <component.icon size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tight">{component.label}</h1>
        </div>
        <div className="flex gap-4">
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Users size={16} /></div>
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Settings2 size={16} /></div>
        </div>
      </div>
    );
  }

  if (component.type === 'Chart' || component.label.includes('图表')) {
    return (
      <div className="w-full h-full p-8 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
        <div className="flex justify-between items-start mb-10">
           <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{component.label}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">REAL-TIME TRAFFIC MONITOR</p>
           </div>
           <BarChart3 size={20} className="text-blue-500" />
        </div>
        <div className="flex-1 flex items-end gap-3 px-4">
           {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
             <motion.div 
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               transition={{ delay: i * 0.05, type: 'spring', damping: 10 }}
               key={i} 
               className="flex-1 bg-blue-600 rounded-t-xl hover:bg-blue-500 transition-colors cursor-pointer relative group/bar" 
             >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                   {h}%
                </div>
             </motion.div>
           ))}
        </div>
        <div className="mt-6 border-t border-slate-50 pt-6 flex justify-between text-[10px] font-bold text-slate-400">
           <span>00:00</span>
           <span>06:00</span>
           <span>12:00</span>
           <span>18:00</span>
           <span>23:59</span>
        </div>
      </div>
    );
  }

  if (component.type === 'List' || component.label.includes('列表')) {
    return (
      <div className="w-full h-full p-8 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{component.label}</h3>
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-6 flex-1">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="flex gap-4 items-center group/item hover:bg-slate-50 p-2 -m-2 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0 flex items-center justify-center text-slate-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                   <Box size={20} />
                </div>
                <div className="flex-1 space-y-1">
                   <div className="flex justify-between items-center">
                      <div className="w-24 h-3 bg-slate-200 rounded-full" />
                      <div className="w-12 h-2 bg-slate-100 rounded-full" />
                   </div>
                   <div className="w-40 h-2 bg-slate-100 rounded-full" />
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-10 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[200px]">
       <div className="p-6 bg-slate-50 text-slate-400 rounded-[2rem] group-hover:scale-110 transition-transform">
          <component.icon size={48} />
       </div>
       <div>
          <p className="text-lg font-black text-slate-900 tracking-tight">{component.label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Functional Module</p>
       </div>
       {component.action && (
         <button className="px-8 py-3 bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-xl shadow-amber-100 hover:bg-amber-400 transition-all">
            {component.action}
         </button>
       )}
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
