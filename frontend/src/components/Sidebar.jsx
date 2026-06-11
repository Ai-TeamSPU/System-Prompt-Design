import React, { useState } from 'react';
import { Layers, Database, Box, CheckCircle2 } from 'lucide-react';

const Sidebar = ({ ingredients, selectedTool, setSelectedTool, selectedBase, setSelectedBase, selectedDepartments, toggleDepartment }) => {
  const [activeTab, setActiveTab] = useState('tools');

  const handleDragStart = (e, type, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, id: item.id }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const tabs = [
    { id: 'tools', label: 'Ai Agent', icon: <img src="/Icon Ai Agent.svg" alt="Ai Agent" style={{ width: '20px', height: '20px' }} /> },
    { id: 'base', label: 'Company size', icon: <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>apartment</span> },
    { id: 'departments', label: 'Departments', icon: <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>work</span> }
  ];

  return (
    <div className="glass-panel sidebar-col">
      <div className="header-title">
        <span>Select material</span>
        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
          3/3 หมวด
        </span>
      </div>
      <p className="header-subtitle">
        {!selectedTool ? "กรุณาเลือก Ai Agent ก่อนเป็นอันดับแรก" : "แตะเพื่อเพิ่ม หรือลากเครื่องมือลงไป"}
      </p>

      <div className="tabs">
        {tabs.map(tab => {
          const isDisabled = tab.id !== 'tools' && !selectedTool;
          return (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                if (!isDisabled) {
                  setActiveTab(tab.id);
                }
              }}
              style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          );
        })}
      </div>

      <div className="card-list">
        {activeTab === 'tools' && ingredients.tools.map(tool => (
          <div
            key={tool.id}
            className={`selection-card ${selectedTool?.id === tool.id ? 'selected' : ''}`}
            onClick={() => setSelectedTool(tool)}
            draggable
            onDragStart={(e) => handleDragStart(e, 'tools', tool)}
          >
            <h4>{tool.name}</h4>
            {selectedTool?.id === tool.id && <CheckCircle2 size={18} className="card-icon" />}
          </div>
        ))}

        {activeTab === 'base' && ingredients.promptBase.map(base => (
          <div
            key={base.id}
            className={`selection-card ${selectedBase?.id === base.id ? 'selected' : ''}`}
            onClick={() => setSelectedBase(base)}
            draggable
            onDragStart={(e) => handleDragStart(e, 'base', base)}
          >
            <h4>{base.name}</h4>
            <p style={{ fontSize: '0.85rem', color: '#a0a0a0', marginTop: '0.2rem' }}>{base.desc || 'โครงสร้าง Prompt หลัก'}</p>
            {selectedBase?.id === base.id && <CheckCircle2 size={18} className="card-icon" />}
          </div>
        ))}

        {activeTab === 'departments' && ingredients.departments.map(dept => {
          const isSelected = selectedDepartments.some(d => d.id === dept.id);
          return (
            <div
              key={dept.id}
              className={`selection-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleDepartment(dept)}
              draggable
              onDragStart={(e) => handleDragStart(e, 'departments', dept)}
            >
              <h4>{dept.name}</h4>
              <p>{dept.desc}</p>
              {isSelected && <CheckCircle2 size={18} className="card-icon" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
