import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Type,
  Hash,
  Calendar,
  Lock,
  Search,
  Layers,
  GitPullRequest,
  Zap,
  BarChart3
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/src/lib/utils";

interface Property {
  id: string;
  api_name: string;
  display_name: string;
  data_type: string;
  required: boolean;
}

interface ObjectType {
  id: string;
  api_name: string;
  display_name: string;
  description: string;
  primary_key: string;
  status: string;
}

export default function ObjectTypeBuilder() {
  const { ontologyId, objectTypeId } = useParams();
  const navigate = useNavigate();
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
  const [selectedOT, setSelectedOT] = useState<ObjectType | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [dirty, setDirty] = useState(false);

  // Fetch all object types for the ontology
  const fetchObjectTypes = () => {
    fetch(`/api/ontologies/${ontologyId}/object-types`)
      .then(res => res.json())
      .then(data => {
        setObjectTypes(data);
        // If objectTypeId is present in URL, select that one
        if (objectTypeId) {
          const matched = data.find((ot: any) => ot.id === objectTypeId);
          if (matched) setSelectedOT(matched);
        } else if (data.length > 0 && !selectedOT) {
          // Default selection if no ID in URL
          setSelectedOT(data[0]);
        }
      });
  };

  useEffect(() => {
    fetchObjectTypes();
  }, [ontologyId]);

  // Sync selectedOT with objectTypeId from URL
  useEffect(() => {
    if (objectTypeId && objectTypes.length > 0) {
      const matched = objectTypes.find(ot => ot.id === objectTypeId);
      if (matched) setSelectedOT(matched);
    }
  }, [objectTypeId, objectTypes]);

  // Fetch properties for the selected object type
  useEffect(() => {
    if (selectedOT) {
      setLoading(true);
      fetch(`/api/object-types/${selectedOT.id}/properties`)
        .then(res => res.json())
        .then(data => {
          setProperties(data);
          setLoading(false);
        });
    }
  }, [selectedOT]);

  const addProperty = () => {
    if (!selectedOT) return;
    const newProp = {
      api_name: `property${properties.length + 1}`,
      display_name: `新属性 ${properties.length + 1}`,
      data_type: "string"
    };

    fetch(`/api/object-types/${selectedOT.id}/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProp)
    })
    .then(res => res.json())
    .then(data => {
      setProperties([...properties, data]);
    });
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(properties.map(p => p.id === id ? { ...p, ...updates } : p));
    setDirty(true);
  };

  const deleteProperty = (id: string) => {
    if (!confirm("确定要删除此属性吗？")) return;
    fetch(`/api/properties/${id}`, { method: "DELETE" })
      .then(() => {
        setProperties(properties.filter(p => p.id !== id));
      });
  };

  const createObjectType = () => {
    const name = prompt("请输入对象显示名称:");
    if (!name) return;
    
    fetch(`/api/ontologies/${ontologyId}/object-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name, api_name: name.replace(/\s+/g, '') })
    })
    .then(res => res.json())
    .then(data => {
      setObjectTypes([...objectTypes, data]);
      setSelectedOT(data);
    });
  };

  const saveChanges = () => {
    if (!selectedOT) return;
    
    // Save all changed properties
    const promises = properties.map(p => 
      fetch(`/api/properties/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      })
    );

    // Save object type metadata
    promises.push(
      fetch(`/api/object-types/${selectedOT.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedOT)
      })
    );

    Promise.all(promises).then(() => {
      setDirty(false);
      alert("保存成功");
      fetchObjectTypes();
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-white" id="object-type-builder">
      {/* Left Sidebar: Object Selection */}
      <div className="w-64 border-r border-tech flex flex-col bg-gray-50/20">
        <div className="p-4 border-b border-tech bg-white/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索对象..." 
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-tech rounded text-xs focus:ring-1 focus:ring-[#106ba3] outline-none" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {objectTypes.map(ot => (
            <div
              key={ot.id}
              onClick={() => navigate(`/build-studio/${ontologyId}/objects/${ot.id}`)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors group cursor-pointer",
                selectedOT?.id === ot.id 
                  ? "bg-[#e1f0f9] text-[#106ba3] font-medium" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  ot.id === 'ot-001' ? "bg-blue-400" : "bg-purple-400"
                )} />
                <span className="truncate">{ot.display_name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm(`确定要删除对象类型 "${ot.display_name}" 吗？`)) {
                      fetch(`/api/object-types/${ot.id}`, { method: 'DELETE' })
                        .then(() => fetchObjectTypes());
                    }
                  }}
                  className="p-1 hover:text-red-500 rounded text-gray-400"
                >
                  <Trash2 size={12} />
                </button>
                <ChevronRight size={14} className={cn(
                  "text-gray-300",
                  selectedOT?.id === ot.id && "text-[#106ba3]"
                )} />
              </div>
            </div>
          ))}
          <button 
            onClick={createObjectType}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#106ba3] font-medium hover:bg-[#106ba3]/5 rounded transition-colors mt-2"
          >
            <Plus size={14} />
            新建对象类型
          </button>
        </div>
      </div>

      {/* Center: Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedOT ? (
          <>
            {/* Editor Header */}
            <header className="p-6 border-b border-tech bg-white shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-gray-900">{selectedOT.display_name}</h1>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-mono text-[10px] border border-tech uppercase tracking-tighter">
                      {selectedOT.api_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-2xl">
                    {selectedOT.description || "暂无描述信息。"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/analysis/impact?ref=${selectedOT.api_name}`}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                  >
                    <GitPullRequest size={14} />
                    影响分析
                  </Link>
                  <Link
                    to={`/analysis/hotspots?ref=${selectedOT.api_name}`}
                    className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100 flex items-center gap-2 hover:bg-amber-100 transition-colors"
                  >
                    <Zap size={14} />
                    性能热点
                  </Link>
                  <button className="btn-secondary py-1.5 px-3 flex items-center gap-2">
                    <Settings size={14} />
                    对象配置
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mt-4 border-b border-tech -mb-6">
                <button className="pb-2 border-b-2 border-[#106ba3] text-[#106ba3] font-medium text-sm">属性列表</button>
                <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 text-sm">链接关系</button>
                <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 text-sm">安全授权</button>
              </div>
            </header>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 tech-grid">
              <div className="bg-white border border-tech rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="bg-gray-50/50 px-4 py-3 border-b border-tech flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-700 font-mono text-xs uppercase tracking-wider">
                    <Database size={14} />
                    Properties ({properties.length})
                  </div>
                  <button 
                    onClick={addProperty}
                    className="text-[#106ba3] hover:text-[#0e5a8a] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} />
                    添加属性
                  </button>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-tech">
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-10">#</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">显示名称</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">API 名称</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">数据类型</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">必填</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16 text-center">主键</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tech">
                    {loading ? (
                      <tr><td colSpan={7} className="p-8 text-center text-gray-400 text-sm">正在加载属性...</td></tr>
                    ) : properties.map((prop, idx) => (
                      <tr key={prop.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono italic">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          <input 
                            type="text" 
                            value={prop.display_name}
                            onChange={(e) => updateProperty(prop.id, { display_name: e.target.value })}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text"
                            value={prop.api_name}
                            onChange={(e) => updateProperty(prop.id, { api_name: e.target.value })}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-mono text-[10px] border border-tech uppercase truncate block max-w-[150px] outline-none focus:bg-white focus:border-[#106ba3]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={prop.data_type}
                            onChange={(e) => updateProperty(prop.id, { data_type: e.target.value })}
                            className="bg-transparent text-xs text-gray-600 outline-none"
                          >
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="double">Double</option>
                            <option value="boolean">Boolean</option>
                            <option value="timestamp">Timestamp</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            checked={prop.required} 
                            onChange={(e) => updateProperty(prop.id, { required: e.target.checked })}
                            className="rounded border-tech text-[#106ba3] focus:ring-[#106ba3]/20" 
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => {
                              setSelectedOT({ ...selectedOT, primary_key: prop.api_name });
                              setDirty(true);
                            }}
                          >
                            {selectedOT.primary_key === prop.api_name ? (
                              <CheckCircle2 size={16} className="text-green-500 mx-auto" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-tech mx-auto group-hover:border-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={() => deleteProperty(prop.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <Layers className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-sm font-medium">请从左侧列表选择或创建一个对象类型</p>
          </div>
        )}
      </div>

      {/* Right Sidebar: Context Panel */}
      <aside className="w-80 border-l border-tech bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-tech bg-gray-50/50">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">对象元数据</h2>
        </div>
        
        {selectedOT ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section className="space-y-3 font-mono">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Unique RID</label>
                <div className="p-2 bg-gray-50 border border-tech rounded text-[10px] text-gray-600 break-all">
                  ri.ontology.main.object-type.{selectedOT.id.split('-').pop()}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {selectedOT.status === 'active' ? 'Active / Published' : 'Draft'}
                </div>
              </div>
            </section>

            <div className="h-px bg-tech" />

            <section className="space-y-4">
               <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Primary Key</label>
                  <select 
                    className="w-full px-2 py-1.5 bg-white border border-tech rounded text-xs outline-none focus:ring-1 focus:ring-[#106ba3]"
                    value={selectedOT.primary_key}
                    onChange={(e) => {
                      setSelectedOT({ ...selectedOT, primary_key: e.target.value });
                      setDirty(true);
                    }}
                  >
                    <option value="">未选择</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.api_name}>{p.display_name} ({p.api_name})</option>
                    ))}
                  </select>
               </div>

               <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Title Property</label>
                  <select className="w-full px-2 py-1.5 bg-white border border-tech rounded text-xs outline-none focus:ring-1 focus:ring-[#106ba3]">
                    <option value="">未选择</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.api_name}>{p.display_name}</option>
                    ))}
                  </select>
               </div>
            </section>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded p-3 space-y-2">
               <div className="flex items-center gap-2 text-amber-800 text-xs font-bold font-mono uppercase tracking-tight">
                  <AlertCircle size={14} />
                  Validation Issues (1)
               </div>
               <p className="text-[11px] text-amber-700 leading-relaxed font-mono">
                 - Missing mapping for datasource CRM_SYNC. This object will not have backing data.
               </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-300 italic text-sm">
            选择一个对象以查看详细属性
          </div>
        )}

        <div className="p-4 border-t border-tech space-y-2">
           <button 
             disabled={!dirty}
             onClick={saveChanges}
             className={cn(
               "w-full py-2 text-xs font-bold uppercase tracking-widest transition-all",
               dirty ? "bg-[#106ba3] hover:bg-[#0e5a8a] text-white shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"
             )}
           >
             保存修改
           </button>
           <button 
             disabled={!dirty}
             onClick={() => {
                setDirty(false);
                setSelectedOT({ ...selectedOT }); // Refresh trigger
             }}
             className="w-full btn-secondary py-2 text-xs font-bold uppercase tracking-widest border-transparent hover:border-tech disabled:opacity-50"
           >
             重置变更
           </button>
        </div>
      </aside>
    </div>
  );
}
