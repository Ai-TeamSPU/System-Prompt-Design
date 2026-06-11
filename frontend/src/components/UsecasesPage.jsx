import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Image as ImageIcon, X } from 'lucide-react';
import UsecaseModal from './UsecaseModal';
import { supabase } from '../supabaseClient';

const UsecasesPage = ({ currentPrompt, currentTool, currentBase, currentDepartments }) => {
  const [usecases, setUsecases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailUsecase, setSelectedDetailUsecase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch usecases from Supabase
  const fetchUsecases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usecases')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error("Supabase returned an error:", error);
        setUsecases([]);
      } else {
        setUsecases(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch usecases", err);
      setUsecases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsecases();
  }, []);

  const handleAddUsecase = async (usecaseData) => {
    try {
      let name = localStorage.getItem('userNickname');
      if (!name) {
        name = window.prompt("กรุณาใส่ชื่อของคุณก่อนบันทึก:");
        if (name) {
          localStorage.setItem('userNickname', name);
        } else {
          return; // canceled
        }
      }

      const newUsecase = {
        id: 'uc-' + Date.now(),
        title: usecaseData.title,
        description: usecaseData.description,
        image: usecaseData.image || null,
        date: new Date().toISOString(),
        created_by: name || 'Guest',
        generated_prompt: currentPrompt !== "Please select a Prompt Base." ? currentPrompt : null,
        tool_used: currentTool || null,
        base_used: currentBase || null,
        departments_used: currentDepartments || []
      };
      const { error } = await supabase
        .from('usecases')
        .insert([newUsecase]);
        
      if (error) {
        console.error("Failed to add usecase to Supabase", error);
      } else {
        // Refresh the list after adding
        fetchUsecases();
      }
    } catch (err) {
      console.error("Failed to add usecase", err);
    }
  };

  return (
    <div className="usecases-page">
      <div className="usecases-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
            <LayoutGrid color="var(--primary-accent)" />
            Prompt Usecases
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Explore practical examples and templates created with Vibe Prompt Builder.
          </p>
        </div>
        <div style={{ flexShrink: 0, alignSelf: 'center' }}>
          <button className="btn btn-primary" style={{ width: 'max-content', padding: '0.6rem 1.2rem', fontSize: '0.95rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Prompt Usecase
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading usecases...</div>
      ) : usecases.length === 0 ? (
        <div className="empty-state glass-panel">
          <LayoutGrid size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Usecases Found</h3>
          <p>Be the first to add a prompt usecase example!</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Prompt Usecase
          </button>
        </div>
      ) : (
        <div className="usecase-grid">
          {usecases.map(uc => (
            <div key={uc.id} className="usecase-card glass-panel">
              <div className="usecase-image-container">
                {uc.image ? (
                  <img src={uc.image} alt={uc.title} className="usecase-image" />
                ) : (
                  <div className="usecase-image-placeholder">
                    <ImageIcon size={32} opacity={0.5} />
                    <span>No Image Provided</span>
                  </div>
                )}
              </div>
              <div className="usecase-content">
                <h3 className="usecase-title">{uc.title}</h3>
                <p className="usecase-desc">{uc.description}</p>
                <button 
                  onClick={() => setSelectedDetailUsecase(uc)} 
                  className="btn btn-secondary" 
                  style={{ marginBottom: '1rem', alignSelf: 'flex-start', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  อ่านรายละเอียด
                </button>
                <div className="usecase-meta">
                  <span style={{ color: 'var(--primary-accent)' }}>👤 โดย: {uc.created_by || 'ไม่ระบุชื่อ'}</span>
                  <span>{new Date(uc.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UsecaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUsecase}
      />

      {/* Detail Modal */}
      {selectedDetailUsecase && (
        <div className="modal-overlay" onClick={() => setSelectedDetailUsecase(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', overflowY: 'auto', maxHeight: '90vh', background: 'var(--bg-color)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDetailUsecase.title}</h3>
              <button className="btn-icon" onClick={() => setSelectedDetailUsecase(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {selectedDetailUsecase.image && (
                <img 
                  src={selectedDetailUsecase.image} 
                  alt={selectedDetailUsecase.title} 
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1rem', background: '#111' }} 
                />
              )}
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selectedDetailUsecase.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsecasesPage;
