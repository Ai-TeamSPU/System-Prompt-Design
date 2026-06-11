import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

const PromptResult = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-container glass-panel">
      <div className="result-header">
        <h3>Generated Prompt</h3>
        <button className="btn-copy" onClick={handleCopy} title="Copy to clipboard">
          {copied ? <CheckCircle2 size={16} color="#00f0ff" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <div className="prompt-output">
        {prompt}
      </div>
    </div>
  );
};

export default PromptResult;
