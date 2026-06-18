import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Image as ImageIcon, X, Heart, Copy, Trash2, AlertTriangle } from 'lucide-react';
import UsecaseModal from './UsecaseModal';
import { supabase } from '../supabaseClient';

const UsecasesPage = ({ currentPrompt, currentTool, currentBase, currentDepartments, currentFeatures, isAdmin }) => {
  const [usecases, setUsecases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailUsecase, setSelectedDetailUsecase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedUsecases, setLikedUsecases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingUsecase, setDeletingUsecase] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedUsecases');
    if (storedLikes) {
      setLikedUsecases(JSON.parse(storedLikes));
    }
  }, []);

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

  const handleLike = async (usecaseId, currentLikes) => {
    const isLiked = likedUsecases.includes(usecaseId);
    const newLikes = isLiked ? Math.max((currentLikes || 0) - 1, 0) : (currentLikes || 0) + 1;

    // Optimistic UI update
    setUsecases(prev => prev.map(uc => uc.id === usecaseId ? { ...uc, likes: newLikes } : uc));
    
    // Update LocalStorage
    let newLikedArray;
    if (isLiked) {
      newLikedArray = likedUsecases.filter(id => id !== usecaseId);
    } else {
      newLikedArray = [...likedUsecases, usecaseId];
    }
    setLikedUsecases(newLikedArray);
    localStorage.setItem('likedUsecases', JSON.stringify(newLikedArray));

    try {
      const { error } = await supabase
        .from('usecases')
        .update({ likes: newLikes })
        .eq('id', usecaseId);

      if (error) {
        console.error("Error updating likes:", error);
        // Revert on error
        setUsecases(prev => prev.map(uc => uc.id === usecaseId ? { ...uc, likes: currentLikes } : uc));
        setLikedUsecases(likedUsecases);
        localStorage.setItem('likedUsecases', JSON.stringify(likedUsecases));
      }
    } catch (err) {
      console.error("Failed to update like", err);
    }
  };

  const handleAddUsecase = async (usecaseData) => {
    try {
      const newUsecase = {
        id: 'uc-' + Date.now(),
        title: usecaseData.title,
        description: usecaseData.description,
        image: usecaseData.image || null,
        date: new Date().toISOString(),
        created_by: usecaseData.author || 'Guest',
        generated_prompt: currentPrompt !== "Please select a Prompt Base." ? currentPrompt : null,
        tool_used: currentTool || null,
        base_used: currentBase || null,
        departments_used: currentDepartments || [],
        features_used: currentFeatures || []
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

  const handleDelete = async () => {
    if (!deletingUsecase) return;
    
    try {
      const { error } = await supabase
        .from('usecases')
        .delete()
        .eq('id', deletingUsecase.id);
        
      if (error) {
        console.error("Failed to delete usecase:", error);
        alert("Failed to delete usecase. Check console for details.");
      } else {
        setUsecases(prev => prev.filter(uc => uc.id !== deletingUsecase.id));
        // Adjust pagination if needed
        const totalPages = Math.ceil((usecases.length - 1) / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingUsecase(null);
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
        <>
          <div className="usecase-grid">
            {usecases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(uc => (
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
              <div className="usecase-content" style={{ position: 'relative' }}>
                {isAdmin && (
                  <button 
                    onClick={() => setDeletingUsecase(uc)}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'rgba(255, 50, 50, 0.1)',
                      border: '1px solid rgba(255, 50, 50, 0.3)',
                      color: '#ff4444',
                      padding: '0.4rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    title="Delete Usecase"
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255, 50, 50, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 50, 50, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <h3 className="usecase-title">{uc.title}</h3>
                <p className="usecase-desc">{uc.description}</p>
                <button 
                  onClick={() => setSelectedDetailUsecase(uc)} 
                  className="btn btn-secondary" 
                  style={{ marginBottom: '1rem', alignSelf: 'flex-start', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  อ่านรายละเอียด
                </button>
                <div className="usecase-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: 'var(--primary-accent)' }}>👤 โดย: {uc.created_by || 'ไม่ระบุชื่อ'}</span>
                    <span>{new Date(uc.date).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleLike(uc.id, uc.likes)}
                    className="btn-icon" 
                    style={{ 
                      color: likedUsecases.includes(uc.id) ? '#ff4b4b' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      width: 'auto',
                      padding: '0 0.5rem',
                      borderRadius: '12px'
                    }}
                  >
                    <Heart 
                      size={20} 
                      fill={likedUsecases.includes(uc.id) ? '#ff4b4b' : 'transparent'} 
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{uc.likes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(usecases.length / itemsPerPage) > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.3rem', marginTop: '2rem' }}>
              <button 
                className="btn btn-secondary" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
              >
                Prev
              </button>
              
              {Array.from({ length: Math.ceil(usecases.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentPage(page)}
                  style={{ 
                    padding: '0.3rem 0.6rem', 
                    fontSize: '0.85rem',
                    minWidth: '32px',
                    background: currentPage === page ? 'var(--primary-accent)' : 'transparent',
                    color: currentPage === page ? '#000' : 'white',
                    borderColor: currentPage === page ? 'var(--primary-accent)' : 'var(--glass-border)'
                  }}
                >
                  {page}
                </button>
              ))}

              <button 
                className="btn btn-secondary" 
                disabled={currentPage === Math.ceil(usecases.length / itemsPerPage)}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(usecases.length / itemsPerPage)))}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <UsecaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUsecase}
      />

      {/* Delete Confirmation Modal */}
      {deletingUsecase && (
        <div className="modal-overlay" onClick={() => setDeletingUsecase(null)} style={{ zIndex: 3000 }}>
          <div 
            className="modal-content glass-panel" 
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '400px',
              padding: '2rem',
              textAlign: 'center',
              animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'rgba(255, 50, 50, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              border: '1px solid rgba(255, 50, 50, 0.2)'
            }}>
              <AlertTriangle size={30} color="#ff4444" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#ff4444' }}>Delete Usecase?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>"{deletingUsecase.title}"</strong>?<br/>
              This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.8rem' }}
                onClick={() => setDeletingUsecase(null)}
              >
                Cancel
              </button>
              <button 
                className="action-btn" 
                style={{ flex: 1, padding: '0.8rem', background: '#ff4444', color: 'white', boxShadow: '0 4px 15px rgba(255, 50, 50, 0.3)' }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

              {selectedDetailUsecase.generated_prompt && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <h4 style={{ color: 'var(--primary-accent)', margin: 0 }}>Generated Prompt</h4>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDetailUsecase.generated_prompt);
                        alert('Copied to clipboard!');
                      }}
                    >
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                    {selectedDetailUsecase.generated_prompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsecasesPage;
