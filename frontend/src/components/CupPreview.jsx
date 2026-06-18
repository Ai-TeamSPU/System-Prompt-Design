import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const CupPreview = ({ selectedTool, selectedBase, selectedDepartments, selectedFeatures, onClear, onDropItem, onRemoveTool, onRemoveBase, onRemoveDepartment, onRemoveFeature, onGenerate }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleGenerateClick = () => {
    if (!selectedTool || !selectedBase || selectedDepartments.length === 0) {
      setShowAlert(true);
    } else {
      onGenerate();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.type && data.id) {
        onDropItem(data.type, data.id);
      }
    } catch (err) {
      console.error("Drop parsing error", err);
    }
  };

  return (
    <div
      className={`glass-panel preview-col ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ transition: 'all 0.3s ease', border: isDragOver ? '2px dashed var(--primary-accent)' : '' }}
    >
      <div style={{ display: 'flex', gap: '5px', marginBottom: '1rem' }}>
        <div style={{ width: '40px', height: '4px', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
        <div style={{ width: '40px', height: '4px', background: 'var(--secondary-accent)', borderRadius: '2px' }}></div>
        <div style={{ width: '40px', height: '4px', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
        <div style={{ width: '40px', height: '4px', background: 'var(--secondary-accent)', borderRadius: '2px' }}></div>
      </div>
      <h2>PROMPT LAYERS</h2>
      {/* <p className="subtitle">prompt</p> */}

      <div 
        className="cup-visual" 
        style={{ 
          width: '100%', 
          flex: 1, 
          padding: '1.5rem', 
          overflowY: 'auto',
          justifyContent: (!selectedTool && !selectedBase && selectedDepartments.length === 0 && (!selectedFeatures || selectedFeatures.length === 0)) ? 'center' : 'flex-start'
        }}
      >
        {(!selectedTool && !selectedBase && selectedDepartments.length === 0 && (!selectedFeatures || selectedFeatures.length === 0)) ? (
          <>
            <Sparkles className="spin-icon" size={60} color="var(--primary-accent)" style={{ opacity: 0.8, marginBottom: '20px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Visual Preview</p>
          </>
        ) : (
          <div className="tags-container" style={{ marginBottom: 0 }}>
            {selectedTool && (
              <div className="tag">
                <span style={{ color: '#00f0ff' }}> Ai Agent:</span> {selectedTool.name.split('—')[0]}
                <button onClick={onRemoveTool}><X size={14} /></button>
              </div>
            )}

            {selectedBase && (
              <div className="tag">
                <span style={{ color: '#ffbd2e' }}>Prompt Base:</span> {selectedBase.name}
                <button onClick={onRemoveBase}><X size={14} /></button>
              </div>
            )}

            {selectedDepartments.map(dept => (
              <div key={dept.id} className="tag">
                <span style={{ color: '#ff003c' }}>Departments:</span> {dept.name.split(' ')[0]}
                <button onClick={() => onRemoveDepartment(dept.id)}><X size={14} /></button>
              </div>
            ))}

            {selectedFeatures && selectedFeatures.map(feature => (
              <div key={feature.id} className="tag">
                <span style={{ color: '#00ff73' }}>Feature:</span> {feature.name.split(' ')[0]}
                <button onClick={() => onRemoveFeature(feature.id)}><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onClear}>
          <RefreshCw size={18} /> ล้างตัวเลือก
        </button>
        <button className="btn btn-primary" onClick={handleGenerateClick}>
          <Sparkles size={18} /> Create Prompt System for you
        </button>
      </div>

      {showAlert && createPortal(
        <div className="modal-overlay" onClick={() => setShowAlert(false)} style={{ zIndex: 2000 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', textAlign: 'center', background: 'var(--bg-color)' }} onClick={e => e.stopPropagation()}>
            <AlertCircle size={48} color="#ff4b4b" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#ff4b4b', marginBottom: '0.5rem' }}>!!! กรุณาเลือกสิ่งที่ต้องการสร้าง !!!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>!! Please select what you wish to create. !!</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowAlert(false)}>
              ตกลง (OK)
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CupPreview;
