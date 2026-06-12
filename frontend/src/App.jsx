import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import CupPreview from './components/CupPreview';
import PromptOutput from './components/PromptOutput';
import UsecasesPage from './components/UsecasesPage';
import PopularPage from './components/PopularPage';
import HistoryPage from './components/HistoryPage';
import DocsPage from './components/DocsPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import { supabase } from './supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [ingredients, setIngredients] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: tools } = await supabase.from('tools').select('*');
        const { data: promptBases } = await supabase.from('prompt_bases').select('*');
        const { data: departments } = await supabase.from('departments').select('*');
        
        setIngredients({
          tools: tools || [],
          promptBase: promptBases ? promptBases.map(row => ({
            id: row.id,
            name: row.name,
            desc: row.description,
            promptTemplate: row.prompt_template
          })) : [],
          departments: departments ? departments.map(row => ({
            id: row.id,
            name: row.name,
            desc: row.description
          })) : []
        });
      } catch (err) {
        console.error("Failed to load options from Supabase", err);
      }
    }
    loadData();
  }, []);

  const toggleDepartment = (dept) => {
    setSelectedDepartments(prev =>
      prev.find(d => d.id === dept.id)
        ? prev.filter(d => d.id !== dept.id)
        : [...prev, dept]
    );
  };

  const clearCup = () => {
    setSelectedTool(null);
    setSelectedBase(null);
    setSelectedDepartments([]);
  };

  const handleClonePrompt = (usecase) => {
    if (usecase.tool_used) setSelectedTool(usecase.tool_used);
    if (usecase.base_used) setSelectedBase(usecase.base_used);
    if (usecase.departments_used) setSelectedDepartments(usecase.departments_used);
    setCurrentPage('home');
  };

  const generatePrompt = () => {
    if (!selectedBase) return "Please select a Prompt Base.";

    let promptParts = [];

    // 1. Target AI Agent / Tool
    if (selectedTool) {
      promptParts.push(`==================================================
TARGET AI AGENT / TOOL
==================================================
Please optimize your output format and execution strategy for:
- ${selectedTool.name}`);
    }

    // 2. Base architecture
    if (selectedBase) {
      promptParts.push(`==================================================
PROJECT CONTEXT
==================================================
Base Architecture: ${selectedBase.name}`);
    }

    // 3. Core Prompt and Departments
    let deptString = selectedDepartments.length > 0
      ? selectedDepartments.map(d => `- ${d.name}: ${d.desc}`).join('\n')
      : "- (No departments selected)";

    // Use the promptTemplate from the selected base
    let corePrompt = (selectedBase.promptTemplate || "").replace('[DEPARTMENTS]', deptString);
    promptParts.push(corePrompt);

    return promptParts.join('\n\n');
  };

  const handleDropItem = (type, id) => {
    if (!ingredients) return;
    if (type === 'tools') {
      const item = ingredients.tools.find(t => t.id === id);
      if (item) setSelectedTool(item);
    } else if (type === 'base') {
      const item = ingredients.promptBase.find(b => b.id === id);
      if (item) setSelectedBase(item);
    } else if (type === 'departments') {
      const item = ingredients.departments.find(d => d.id === id);
      if (item) {
        setSelectedDepartments(prev =>
          prev.find(d => d.id === item.id) ? prev : [...prev, item]
        );
      }
    }
  };

  return (
    <div className="app-wrapper">
      <TopNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' ? (
        !ingredients ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8b949e' }}>Loading ingredients...</div>
        ) : (
        <div className="app-layout">
          <Sidebar
            ingredients={ingredients}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedBase={selectedBase}
            setSelectedBase={setSelectedBase}
            selectedDepartments={selectedDepartments}
            toggleDepartment={toggleDepartment}
          />
          <CupPreview
            selectedTool={selectedTool}
            selectedBase={selectedBase}
            selectedDepartments={selectedDepartments}
            onClear={clearCup}
            onDropItem={handleDropItem}
            onRemoveTool={() => setSelectedTool(null)}
            onRemoveBase={() => setSelectedBase(null)}
            onRemoveDepartment={(deptId) => setSelectedDepartments(prev => prev.filter(d => d.id !== deptId))}
            onGenerate={() => {
              setShowPromptModal(true);
              
              // Save to LocalStorage history
              const historyStr = localStorage.getItem('promptHistory');
              let historyArr = [];
              if (historyStr) {
                try { historyArr = JSON.parse(historyStr); } catch(e){}
              }
              const newItem = {
                id: Date.now().toString(),
                title: `Auto-saved Prompt (${selectedTool ? selectedTool.name.split('—')[0].trim() : 'Unknown Tool'})`,
                description: `บันทึกอัตโนมัติเมื่อ ${new Date().toLocaleString('th-TH')}`,
                tool_used: selectedTool,
                base_used: selectedBase,
                departments_used: selectedDepartments,
                generated_prompt: generatePrompt(),
                date: new Date().toISOString(),
                created_by: 'You (Local)'
              };
              historyArr.unshift(newItem); // Add to beginning
              localStorage.setItem('promptHistory', JSON.stringify(historyArr));
            }}
          />
        </div>
        )
      ) : currentPage === 'usecases' ? (
        <UsecasesPage 
          currentPrompt={generatePrompt()}
          currentTool={selectedTool}
          currentBase={selectedBase}
          currentDepartments={selectedDepartments}
        />
      ) : currentPage === 'popular' ? (
        <PopularPage />
      ) : currentPage === 'docs' ? (
        <DocsPage />
      ) : (
        <HistoryPage onClonePrompt={handleClonePrompt} />
      )}
      <ScrollToTopButton />

      {/* Prompt Output Modal */}
      {showPromptModal && (
        <div className="modal-overlay" onClick={() => setShowPromptModal(false)} style={{ zIndex: 1000 }}>
          <div 
            className="modal-content glass-panel" 
            style={{ 
              maxWidth: '800px', 
              width: '90%', 
              maxHeight: '90vh', 
              background: 'var(--bg-color)', 
              padding: 0, 
              display: 'flex', 
              flexDirection: 'column' 
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <PromptOutput
                prompt={generatePrompt()}
                selectedTool={selectedTool}
                selectedBase={selectedBase}
                selectedDepartments={selectedDepartments}
                onClose={() => setShowPromptModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
