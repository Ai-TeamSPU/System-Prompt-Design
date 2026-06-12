import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { Search, Filter, Copy, Clock, User, Download, Cpu, Building2, Briefcase } from 'lucide-react';

const HistoryPage = ({ onClonePrompt }) => {
  const [usecases, setUsecases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filters
  const [filterTool, setFilterTool] = useState('All');
  const [filterBase, setFilterBase] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setIsLoading(true);
    try {
      const historyStr = localStorage.getItem('promptHistory');
      let historyArr = [];
      if (historyStr) {
        historyArr = JSON.parse(historyStr);
      }
      setUsecases(historyArr);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    const historyStr = localStorage.getItem('promptHistory');
    if (historyStr) {
      const historyArr = JSON.parse(historyStr);
      const newArr = historyArr.filter(item => item.id !== deleteConfirmId);
      localStorage.setItem('promptHistory', JSON.stringify(newArr));
      setUsecases(newArr);
    }
    setDeleteConfirmId(null);
  };

  // ดึงรายชื่อ Tool, Base, Department แบบ Unique สำหรับทำ Dropdown
  const uniqueTools = [...new Set(usecases.map(uc => uc.tool_used?.name).filter(Boolean))];
  const uniqueBases = [...new Set(usecases.map(uc => uc.base_used?.name).filter(Boolean))];
  const uniqueDepartments = [...new Set(usecases.flatMap(uc => uc.departments_used?.map(d => d.name) || []).filter(Boolean))];

  // คัดกรองข้อมูลตามเงื่อนไข
  const filteredUsecases = usecases.filter(uc => {
    const matchesTool = filterTool === 'All' || uc.tool_used?.name === filterTool;
    const matchesBase = filterBase === 'All' || uc.base_used?.name === filterBase;
    const matchesDept = filterDepartment === 'All' || uc.departments_used?.some(d => d.name === filterDepartment);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (uc.title && uc.title.toLowerCase().includes(searchLower)) ||
      (uc.description && uc.description.toLowerCase().includes(searchLower));

    return matchesTool && matchesBase && matchesDept && matchesSearch;
  });

  return (
    <div className="usecases-page" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="usecases-header" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'stretch' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Prompt Feed & History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            ดูตัวอย่าง Prompt ที่ถูกสร้างขึ้นและนำไปต่อยอด (Clone) สำหรับโปรเจกต์ของคุณ
          </p>
        </div>

        {/* Filters Box */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Search size={16} /> ค้นหา
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="ค้นหาชื่อ หรือคำอธิบาย..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Cpu size={16} /> AI Agent
            </label>
            <select
              className="form-input"
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
            >
              <option value="All">ทั้งหมด</option>
              {uniqueTools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Building2 size={16} /> Company Size
            </label>
            <select
              className="form-input"
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
            >
              <option value="All">ทั้งหมด</option>
              {uniqueBases.map(base => (
                <option key={base} value={base}>{base}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Briefcase size={16} /> Department
            </label>
            <select
              className="form-input"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
            >
              <option value="All">ทั้งหมด</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {isLoading ? (
          <div className="loading-state">Loading history...</div>
        ) : filteredUsecases.length === 0 ? (
          <div className="empty-state glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Clock size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>ไม่พบข้อมูล Prompt</h3>
            <p>ยังไม่มีใครสร้าง Prompt ในระบบ หรืออาจไม่ตรงกับเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredUsecases.map(uc => (
              <div key={uc.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>{uc.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} /> {uc.created_by || 'Guest'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {new Date(uc.date).toLocaleString('th-TH')}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDeleteHistory(uc.id)}
                      style={{ flex: 'none', width: 'max-content', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.95rem', color: '#ff4b4b' }}
                      title="ลบประวัตินี้"
                    >
                      ลบ
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => onClonePrompt(uc)}
                      style={{ flex: 'none', width: 'max-content', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}
                    >
                      <Copy size={16} /> Clone Prompt
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {uc.tool_used && (
                    <span
                      onClick={() => setFilterTool(uc.tool_used.name)}
                      style={{ background: 'rgba(0,240,255,0.1)', color: '#00f0ff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(0,240,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(0,240,255,0.2)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(0,240,255,0.1)'}
                      title="คลิกเพื่อกรองตาม AI Agent นี้"
                    >
                      🤖 {uc.tool_used.name}
                    </span>
                  )}
                  {uc.base_used && (
                    <span
                      onClick={() => setFilterBase(uc.base_used.name)}
                      style={{ background: 'rgba(255,0,60,0.1)', color: '#ff003c', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(255,0,60,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,0,60,0.2)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(255,0,60,0.1)'}
                      title="คลิกเพื่อกรองตาม Company Size นี้"
                    >
                      🏢 {uc.base_used.name}
                    </span>
                  )}
                  {uc.departments_used && uc.departments_used.map(dept => (
                    <span
                      key={dept.id}
                      onClick={() => setFilterDepartment(dept.name)}
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white'; }}
                      onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--text-secondary)'; }}
                      title="คลิกเพื่อกรองตาม Department นี้"
                    >
                      💼 {dept.name.split(' ')[0]}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                  <div className="code-content custom-scrollbar" style={{ maxHeight: '400px', background: '#111', padding: '1rem', overflowY: 'auto', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {uc.generated_prompt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirmId && createPortal(
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)} style={{ zIndex: 2000 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', textAlign: 'center', background: 'var(--bg-color)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#ff4b4b', marginBottom: '1rem', fontSize: '1.4rem' }}>ต้องการลบใช่หรือไม่?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>ประวัติการสร้าง Prompt นี้จะถูกลบออกไปจากเครื่องของคุณและไม่สามารถกู้คืนได้</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirmId(null)}>
                ยกเลิก
              </button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#ff4b4b', borderColor: '#ff4b4b' }} onClick={confirmDelete}>
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HistoryPage;
