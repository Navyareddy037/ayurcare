import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Compass, Leaf, BookOpen, Layers, Info } from 'lucide-react';

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState<'HERB' | 'DOSHA' | 'ARTICLE'>('HERB');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/knowledge?type=${activeTab}&search=${search}`);
      if (res.data && res.data.success) {
        setItems(res.data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [activeTab, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ayur-primary text-xs font-semibold border border-emerald-250">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vedic Scriptures & Botanical Encyclopedia</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900">Ayurvedic Knowledge Hub</h1>
        <p className="text-stone-550 text-sm max-w-xl mx-auto font-sans">
          Explore botanical descriptions of organic herbs, analyze bodily constitutions, and read seasonal wellness guidelines (Dinacharya).
        </p>
      </div>

      {/* Tabs / Search Controller */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-stone-200 p-4 rounded-3xl shadow-sm">
        <div className="flex rounded-xl bg-stone-105 p-1 border border-stone-200/40 w-full sm:w-auto">
          {[
            { id: 'HERB', label: 'Medicinal Herbs', icon: Leaf },
            { id: 'DOSHA', label: 'Body Doshas', icon: Layers },
            { id: 'ARTICLE', label: 'Blogs & Guides', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearch('');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all w-1/3 sm:w-auto ${
                  activeTab === tab.id
                    ? 'bg-white text-ayur-primary shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search encyclopedia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-stone-200 animate-pulse space-y-3">
              <div className="h-5 w-1/3 bg-stone-200 rounded"></div>
              <div className="h-3 w-2/3 bg-stone-200 rounded"></div>
              <div className="h-20 bg-stone-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-stone-200 border-dashed text-xs text-stone-500">
          No records found matching your keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-base text-stone-900 leading-snug">{item.title}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-ayur-primary font-bold uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
                
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.content}
                </p>
              </div>

              {item.tags && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-105">
                  {item.tags.split(',').map((tag: string) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-550 border border-stone-200/40">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-205/50 flex gap-4 text-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-800 font-bold">Integrating Ayurveda Into Daily Life</strong>
          <p className="text-stone-600 leading-relaxed font-sans">
            Wellness in Ayurveda is achieved by maintaining equilibrium of the three bodily humors (Vata, Pitta, Kapha). Take the AI assessment to analyze your body type or book slots with Panchakarma practitioners to design specialized detox processes.
          </p>
        </div>
      </div>
    </div>
  );
}
