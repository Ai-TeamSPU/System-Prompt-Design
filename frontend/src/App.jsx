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
import AdminLoginModal from './components/AdminLoginModal';
import { supabase } from './supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('appTheme') || 'dark';
  });
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [ingredients, setIngredients] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: tools } = await supabase.from('tools').select('*');
        const { data: promptBases } = await supabase.from('prompt_bases').select('*');
        const { data: departments } = await supabase.from('departments').select('*');
        const { data: features } = await supabase.from('features').select('*');

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
          })) : [],
          features: features || []
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

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev =>
      prev.find(f => f.id === feature.id)
        ? prev.filter(f => f.id !== feature.id)
        : [...prev, feature]
    );
  };

  const clearCup = () => {
    setSelectedTool(null);
    setSelectedBase(null);
    setSelectedDepartments([]);
    setSelectedFeatures([]);
  };

  const handleClonePrompt = (usecase) => {
    if (usecase.tool_used) setSelectedTool(usecase.tool_used);
    if (usecase.base_used) setSelectedBase(usecase.base_used);
    if (usecase.departments_used) setSelectedDepartments(usecase.departments_used);
    if (usecase.features_used) setSelectedFeatures(usecase.features_used);
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
    let corePrompt = selectedBase.promptTemplate || "";

    // --- 1. Process DEPARTMENTS ---
    let deptAppended = false;

    // Use RegEx to handle variations in spaces/newlines/markdown (like **) in different prompt bases
    const deptRegexFull = /(### 3\.\s*ORGANIZATION LAYER[\s\S]*?ORGANIZATION STRUCTURE[^\n]*)/i;
    const deptRegexShort = /(ORGANIZATION STRUCTURE[^\n]*)/i;

    if (deptRegexFull.test(corePrompt)) {
      corePrompt = corePrompt.replace(deptRegexFull, (match, p1) => {
        let newP1 = p1;
        if (newP1.includes('(...)')) {
          newP1 = newP1.replace('(...)', `(${selectedDepartments.length})`);
        }
        return newP1 + "\n" + deptString;
      });
      deptAppended = true;
    } else if (deptRegexShort.test(corePrompt)) {
      corePrompt = corePrompt.replace(deptRegexShort, (match, p1) => {
        let newP1 = p1;
        if (newP1.includes('(...)')) {
          newP1 = newP1.replace('(...)', `(${selectedDepartments.length})`);
        }
        return newP1 + "\n" + deptString;
      });
      deptAppended = true;
    } else if (corePrompt.includes('[DEPARTMENTS]')) {
      corePrompt = corePrompt.replace('[DEPARTMENTS]', deptString);
      deptAppended = true;
    }

    // --- 2. Process FEATURES ---
    let featureString = "";
    let featureAppended = false;

    if (selectedFeatures.length > 0) {
      featureString = selectedFeatures.map(f => `- ${f.name}: ${f.description || ''}\n  Required: ${f.required_specs || 'None'}`).join('\n');

      const featAnchor1 = "### 5. FEATURES LAYER\n\nFEATURE MODULES (...):";
      const featAnchor2 = "FEATURE MODULES (...):";

      const featReplace1 = `### 5. FEATURES LAYER\n\nFEATURE MODULES (${selectedFeatures.length}):\n${featureString}`;
      const featReplace2 = `FEATURE MODULES (${selectedFeatures.length}):\n${featureString}`;

      if (corePrompt.includes(featAnchor1)) {
        corePrompt = corePrompt.replace(featAnchor1, featReplace1);
        featureAppended = true;
      } else if (corePrompt.includes(featAnchor2)) {
        corePrompt = corePrompt.replace(featAnchor2, featReplace2);
        featureAppended = true;
      } else if (corePrompt.includes('[..]')) {
        corePrompt = corePrompt.replace('[..]', featureString);
        featureAppended = true;
      } else if (corePrompt.includes('[FEATURES]')) {
        corePrompt = corePrompt.replace('[FEATURES]', featureString);
        featureAppended = true;
      }
    }

    // --- 3. Process AI AGENT (OUTPUT FORMAT) ---
    if (selectedTool) {
      const aiAnchorFull = "### 11. OUTPUT FORMAT LAYER\n\nOUTPUT FORMAT: Respond as (...).";
      const aiAnchorShort = "OUTPUT FORMAT: Respond as (...).";

      if (corePrompt.includes(aiAnchorFull)) {
        corePrompt = corePrompt.replace(aiAnchorFull, `### 11. OUTPUT FORMAT LAYER\n\nOUTPUT FORMAT: Respond as ${selectedTool.name}.`);
      } else if (corePrompt.includes(aiAnchorShort)) {
        corePrompt = corePrompt.replace(aiAnchorShort, `OUTPUT FORMAT: Respond as ${selectedTool.name}.`);
      } else if (corePrompt.includes('Respond as (...).')) {
        corePrompt = corePrompt.replace('Respond as (...).', `Respond as ${selectedTool.name}.`);
      }
    }

    // Push the fully compiled core prompt
    promptParts.push(corePrompt);

    // --- 3. Fallback Append (If anchors were not found in the template) ---
    if (selectedDepartments.length > 0 && !deptAppended) {
      promptParts.push(`==================================================\nDEPARTMENTS\n==================================================\n${deptString}`);
    }

    if (selectedFeatures.length > 0 && !featureAppended) {
      promptParts.push(`==================================================\nFEATURES & REQUIRED SPECS\n==================================================\n${featureString}`);
    }

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
    } else if (type === 'features') {
      const item = ingredients.features.find(f => f.id === id);
      if (item) {
        setSelectedFeatures(prev =>
          prev.find(f => f.id === item.id) ? prev : [...prev, item]
        );
      }
    }
  };

  return (
    <div className="app-wrapper">
      <TopNavbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAdminModal={() => setShowAdminModal(true)}
        theme={theme}
        setTheme={setTheme}
      />

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
              selectedFeatures={selectedFeatures}
              toggleFeature={toggleFeature}
            />
            <CupPreview
              selectedTool={selectedTool}
              selectedBase={selectedBase}
              selectedDepartments={selectedDepartments}
              selectedFeatures={selectedFeatures}
              onClear={clearCup}
              onDropItem={handleDropItem}
              onRemoveTool={() => setSelectedTool(null)}
              onRemoveBase={() => setSelectedBase(null)}
              onRemoveDepartment={(deptId) => setSelectedDepartments(prev => prev.filter(d => d.id !== deptId))}
              onRemoveFeature={(featureId) => setSelectedFeatures(prev => prev.filter(f => f.id !== featureId))}
              onGenerate={() => {
                setShowPromptModal(true);

                // Save to LocalStorage history
                const historyStr = localStorage.getItem('promptHistory');
                let historyArr = [];
                if (historyStr) {
                  try { historyArr = JSON.parse(historyStr); } catch (e) { }
                }
                const newItem = {
                  id: Date.now().toString(),
                  title: `Auto-saved Prompt (${selectedTool ? selectedTool.name.split('—')[0].trim() : 'Unknown Tool'})`,
                  description: `บันทึกอัตโนมัติเมื่อ ${new Date().toLocaleString('th-TH')}`,
                  tool_used: selectedTool,
                  base_used: selectedBase,
                  departments_used: selectedDepartments,
                  features_used: selectedFeatures,
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
          currentFeatures={selectedFeatures}
          isAdmin={isAdmin}
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
        <div className="modal-overlay" onClick={() => { setShowPromptModal(false); clearCup(); }} style={{ zIndex: 1000 }}>
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
                selectedFeatures={selectedFeatures}
                onClose={() => { setShowPromptModal(false); clearCup(); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminModal && (
        <AdminLoginModal
          onClose={() => setShowAdminModal(false)}
          onSuccess={() => {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
            setShowAdminModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
