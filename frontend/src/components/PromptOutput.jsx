import React, { useState } from 'react';
import { Download, Copy, CheckCircle2 } from 'lucide-react';

const PromptOutput = ({ prompt, selectedTool, selectedBase, selectedDepartments }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="glass-panel prompt-col" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="header" style={{ flexShrink: 0 }}>
          <h2>Prompt ของคุณ</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '8px' }}>
              <Download size={18} />
            </button>
            <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '8px' }} onClick={handleCopy}>
              {copied ? <CheckCircle2 size={18} color="var(--primary-accent)" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="recipe-box">
          <h4>Prompt Layers</h4>
          <ul>
            <li>
              <span> Ai Agent:</span>
              <strong style={{ marginLeft: '5px' }}>{selectedTool ? selectedTool.name : 'ยังไม่เลือก'}</strong>
            </li>
            <li>
              <span> Prompt Base:</span>
              <strong style={{ marginLeft: '5px' }}>{selectedBase ? selectedBase.name : 'ยังไม่เลือก'}</strong>
            </li>
            <li>
              <span> Departments:</span>
              <strong style={{ marginLeft: '5px' }}>
                {selectedDepartments.length > 0
                  ? selectedDepartments.map(d => d.name.split(' ')[0]).join(', ')
                  : 'ยังไม่เลือก'}
              </strong>
            </li>
          </ul>
        </div>

        <div className="code-window">
          <div className="code-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span className="code-filename">vibe-coding.prompt.md</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#858585' }}>
              {prompt.split('\n').length} บรรทัด
            </span>
          </div>
          <div className="code-content">
            {prompt}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ marginTop: '1.2rem', padding: '0.8rem', fontSize: '0.95rem', flex: 'none' }} 
          onClick={handleCopy}
        >
          {copied ? (
            <><CheckCircle2 size={18} /> คัดลอกสำเร็จแล้ว!</>
          ) : (
            <><Copy size={18} /> คัดลอก Prompt ไปใช้งาน</>
          )}
        </button>
      </div>


    </div>
  );
};

export default PromptOutput;
