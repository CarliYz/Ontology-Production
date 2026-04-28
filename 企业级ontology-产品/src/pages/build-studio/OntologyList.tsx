import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Database, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function OntologyList() {
  const [ontologies, setOntologies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOntologies = () => {
    fetch("/api/ontologies")
      .then(res => res.json())
      .then(data => {
        setOntologies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOntologies();
  }, []);

  const createOntology = () => {
    const name = prompt("请输入 Ontology 名称:");
    if (!name) return;

    fetch("/api/ontologies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    .then(res => res.json())
    .then(() => {
      fetchOntologies();
    });
  };

  return (
    <div className="flex flex-col h-full bg-workspace/50 p-8 overflow-y-auto" id="ontology-list-page">
      <header className="flex justify-between items-end mb-10 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">图谱建设</h1>
          <p className="text-gray-500 text-sm">定义和管理组织内部的对象类型、关系及其数据映射。</p>
        </div>
        <button 
          onClick={createOntology}
          className="btn-primary flex items-center gap-2" 
          id="btn-create-ontology"
        >
          <Plus size={18} />
          <span>新建 Ontology</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Statistics or Quick Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索 Ontology..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-tech rounded-md text-sm outline-none focus:ring-1 focus:ring-[#106ba3]" 
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={16} />
            <span>筛选</span>
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="ontology-cards-grid">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-44 bg-white border border-tech rounded-lg animate-pulse" />
            ))
          ) : ontologies.map((ont) => (
            <motion.div
              layoutId={ont.id}
              key={ont.id}
              whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white border border-tech rounded-lg p-6 group transition-shadow cursor-pointer relative"
            >
              <Link to={`/build-studio/${ont.id}`} className="absolute inset-0 z-10" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#f0f7ff] text-[#106ba3] rounded">
                  <Database size={20} />
                </div>
                <div className={cn(
                  "text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider",
                  ont.status === 'published' ? "text-green-600 bg-green-50 border-green-200" : "text-amber-600 bg-amber-50 border-amber-200"
                )}>
                  {ont.status === 'published' ? '正式版本' : '草稿'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#106ba3] transition-colors mb-1">
                {ont.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">{ont.id}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 text-gray-500">
                <div className="flex items-center gap-2 text-[11px]">
                  <Clock size={12} />
                  <span>最近更新: 2026-04-23</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
