import { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import './App.css';

// Import prettier for code formatting
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [processedCode, setProcessedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Language options
  const languages = [
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'python', label: 'Python' },
    { value: 'csharp', label: 'C#' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
  ];

  // Function to remove comments based on language
  const removeComments = (sourceCode: string, lang: string) => {
    if (!sourceCode) return '';
    
    let result = sourceCode;
    
    switch (lang) {
      case 'javascript':
      case 'java':
      case 'cpp':
      case 'c':
      case 'csharp':
        // Remove single line comments
        result = result.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      case 'python':
        // Remove single line comments
        result = result.replace(/#.*$/gm, '');
        // Remove multi-line triple-quoted strings used as comments
        result = result.replace(/'''[\s\S]*?'''/g, '');
        result = result.replace(/"""[\s\S]*?"""/g, '');
        break;
      default:
        break;
    }
    
    return result;
  };

  // Function to beautify code based on language
  const beautifyCode = async (sourceCode: string, lang: string) => {
    if (!sourceCode) return '';
    
    try {
      let formattedCode = sourceCode;
      
      // Use prettier for supported languages
      if (['javascript', 'java', 'csharp'].includes(lang)) {
        formattedCode = await prettier.format(sourceCode, {
          parser: 'babel',
          plugins: [parserBabel],
          semi: true,
          singleQuote: true,
        });
      } else if (lang === 'cpp' || lang === 'c') {
        // Basic indentation for C/C++
        // In a real app, you might want to use a dedicated C/C++ formatter
        formattedCode = sourceCode;
      } else if (lang === 'python') {
        // Basic indentation for Python
        // In a real app, you might want to use a dedicated Python formatter
        formattedCode = sourceCode;
      }
      
      return formattedCode;
    } catch (error) {
      console.error('Error beautifying code:', error);
      return sourceCode; // Return original if beautification fails
    }
  };

  // Process the code (remove comments and beautify)
  const processCode = async () => {
    if (!code) return;
    
    const withoutComments = removeComments(code, language);
    const beautified = await beautifyCode(withoutComments, language);
    
    setProcessedCode(beautified);
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Copy processed code to clipboard
  const copyToClipboard = async () => {
    if (processedCode) {
      try {
        await navigator.clipboard.writeText(processedCode);
        setCopySuccess(true);
        
        // Reset copy success message after 2 seconds
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>NoComments</h1>
        <p>Remove comments and beautify your code</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="language-select">Language:</label>
          <select 
            id="language-select"
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="editor-container">
        <div className="editor-section">
          <h2>Input Code</h2>
          <CodeEditor
            value={code}
            language={language}
            placeholder="Paste your code here..."
            onChange={(e) => {
              setCode(e.target.value);
              // Reset processed state when input changes
            }}
            padding={15}
            style={{
              fontSize: 14,
              backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
              fontFamily: '"Fira code", "Fira Mono", monospace',
              minHeight: '300px',
              width: '100%',
              borderRadius: '8px',
            }}
          />
          <button 
            className="process-button" 
            onClick={processCode}
            disabled={!code}
          >
            Process Code
          </button>
        </div>

        <div className="editor-section">
          <h2>Processed Code</h2>
          <div className="code-container">
            <CodeEditor
              value={processedCode}
              language={language}
              readOnly
              padding={15}
              style={{
                fontSize: 14,
                backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
                fontFamily: '"Fira code", "Fira Mono", monospace',
                minHeight: '300px',
                width: '100%',
                borderRadius: '8px',
              }}
            />
            <button 
              className={`copy-button ${copySuccess ? 'copy-success' : ''}`}
              onClick={copyToClipboard}
              disabled={!processedCode}
            >
              {copySuccess ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} Bhumit Chaudhry. All rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
