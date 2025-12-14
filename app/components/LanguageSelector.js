'use client';

import { useState, useEffect } from 'react';
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi';

// List of major languages. You can add as many as you want.
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh-CN', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ru', label: 'Russian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  // Load saved language from cookie on mount
  useEffect(() => {
    const getCookie = (name) => {
      const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return v ? v[2] : null;
    };
    const langCookie = getCookie('googtrans');
    if (langCookie) {
      // Cookie format is usually "/auto/en" or "/en/hi"
      const code = langCookie.split('/').pop();
      setCurrentLang(code);
    }
  }, []);

  const changeLanguage = (langCode) => {
    // 1. Set Google Translate Cookie
    // Format: /source_lang/target_lang. "auto" detects source.
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/auto/${langCode}; path=/;`; // Fallback

    // 2. Set State
    setCurrentLang(langCode);
    setIsOpen(false);

    // 3. Reload page to apply translation
    window.location.reload();
  };

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || 'English';

  return (
    <div className="relative inline-block text-left notranslate">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-slate-800/50 py-2 px-5 rounded-full border border-slate-700 hover:border-slate-500 cursor-pointer transition-all group"
      >
        <FiGlobe className="text-indigo-400" />
        <span className="group-hover:text-white text-sm font-medium text-slate-300 min-w-[80px] text-left">
          {currentLabel}
        </span>
        <FiChevronDown className={`text-slate-500 group-hover:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden max-h-80 overflow-y-auto">
            <div className="py-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition-colors flex items-center justify-between ${currentLang === lang.code ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}
                >
                  {lang.label}
                  {currentLang === lang.code && <FiCheck />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}