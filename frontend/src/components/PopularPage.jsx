import React, { useState, useEffect } from 'react';
import { LayoutGrid, Image as ImageIcon, X, Heart, Trophy, Copy } from 'lucide-react';
import { supabase } from '../supabaseClient';

const PopularPage = () => {
  const [usecases, setUsecases] = useState([]);
  const [selectedDetailUsecase, setSelectedDetailUsecase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedUsecases, setLikedUsecases] = useState([]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedUsecases');
    if (storedLikes) {
      setLikedUsecases(JSON.parse(storedLikes));
    }
  }, []);

  const fetchPopularUsecases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usecases')
        .select('*')
        .gt('likes', 0)
        .order('likes', { ascending: false, nullsFirst: false })
        .limit(3);

      if (error) {
        console.error("Supabase returned an error:", error);
        setUsecases([]);
      } else {
        setUsecases(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch popular usecases", err);
      setUsecases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularUsecases();
  }, []);

  // Like logic removed for PopularPage


  return (
    <div className="usecases-page">
      <div className="usecases-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '0.5rem', color: '#ffd700' }}>
            <Trophy color="#ffd700" size={32} />
            Top 3 Popular Prompts
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            สุดยอด Prompt ยอดนิยมที่มีคนกด Like มากที่สุด 3 อันดับแรก
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading popular prompts...</div>
      ) : usecases.length === 0 ? (
        <div className="empty-state glass-panel">
          <Trophy size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Popular Prompts Yet</h3>
          <p>Go to the Usecase page and like some prompts!</p>
        </div>
      ) : (
        <div className="usecase-grid">
          {usecases.map((uc, index) => (
            <div key={uc.id} className="usecase-card glass-panel" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: index === 0 ? 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)' : index === 1 ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)' : 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
                color: '#111',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.0rem',
                fontFamily: 'Outfit, sans-serif',
                zIndex: 10,
                boxShadow: index === 0 ? '0 0 25px rgba(255, 215, 0, 0.6)' : '0 8px 16px rgba(0,0,0,0.4)',
                border: '4px solid var(--bg-color)',
                textShadow: '0 1px 1px rgba(255,255,255,0.5)'
              }}>
                #{index + 1}
              </div>
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
                <div className="usecase-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: 'var(--primary-accent)' }}>👤 โดย: {uc.created_by || 'ไม่ระบุชื่อ'}</span>
                    <span>{new Date(uc.date).toLocaleDateString()}</span>
                  </div>
                  <div
                    className="btn-icon"
                    style={{
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      width: 'auto',
                      padding: '0 0.5rem',
                      borderRadius: '12px',
                      cursor: 'default',
                      background: 'transparent'
                    }}
                  >
                    <Heart
                      size={20}
                      fill="transparent"
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{uc.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default PopularPage;
