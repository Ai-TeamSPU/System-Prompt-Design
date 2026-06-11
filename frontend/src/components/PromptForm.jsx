import React, { useState } from 'react';
import { Bot, Building2, FileText, Sparkles } from 'lucide-react';

const PromptForm = ({ options, onGenerate, isLoading }) => {
  const [formData, setFormData] = useState({
    aiModelId: options.aiModels[0]?.id || '',
    departmentId: options.departments[0]?.id || '',
    projectContext: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="aiModelId">
            <Bot size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Select AI Model
          </label>
          <select
            id="aiModelId"
            name="aiModelId"
            value={formData.aiModelId}
            onChange={handleChange}
            required
          >
            {options.aiModels.map(ai => (
              <option key={ai.id} value={ai.id}>{ai.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="departmentId">
            <Building2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Target Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            {options.departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="projectContext">
          <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Project Context / Additional Requirements (Optional)
        </label>
        <textarea
          id="projectContext"
          name="projectContext"
          placeholder="e.g. We need an internal dashboard to track employee performance and calculate monthly bonuses. The system must integrate with our existing Active Directory."
          value={formData.projectContext}
          onChange={handleChange}
        ></textarea>
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loader" style={{ marginRight: '10px', width: '20px', height: '20px', borderTopColor: '#000' }}></div>
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Generate Architecture Prompt
          </>
        )}
      </button>
    </form>
  );
};

export default PromptForm;
