import React, { useState } from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';

const CupPreview = ({ selectedTool, selectedBase, selectedDepartments, onClear, onDropItem, onRemoveTool, onRemoveBase, onRemoveDepartment }) => {
  const [isDragOver, setIsDragOver] = useState(false);

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
          justifyContent: (!selectedTool && !selectedBase && selectedDepartments.length === 0) ? 'center' : 'flex-start'
        }}
      >
        {(!selectedTool && !selectedBase && selectedDepartments.length === 0) ? (
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
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onClear}>
          <RefreshCw size={18} /> ล้างตัวเลือก
        </button>
        <button className="btn btn-primary">
          <Sparkles size={18} /> ดู Prompt
        </button>
      </div>
    </div>
  );
};

export default CupPreview;
