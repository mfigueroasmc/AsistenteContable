import React, { useState, useRef, useEffect } from 'react';
import { Search, Server, FileText, History, MessageSquare, Send, ChevronDown, RefreshCw, Volume2, Square } from 'lucide-react';
import { SystemModule, DataSource, ChatMessage } from './types';
import { SUGGESTIONS, MODULE_OPTIONS } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import InfoPanel from './components/InfoPanel';
import LoadingIndicator from './components/LoadingIndicator';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  // State
  const [selectedModule, setSelectedModule] = useState<SystemModule>(SystemModule.CONTABILIDAD);
  const [selectedSource, setSelectedSource] = useState<DataSource>(DataSource.SUPPORT_HISTORY);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'searching' | 'generating'>('searching');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    // With full page scrolling, this will scroll the window
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load voices explicitly for Chrome
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = (text: string, id: string) => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    if (speakingId === id) {
      // If clicking the same button, just stop.
      setSpeakingId(null);
      return;
    }

    // Clean markdown for better speech (simple strip)
    const cleanText = text.replace(/[*#_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();

    // Priority: Chile -> Mexico -> 419 (Latam) -> Any Spanish
    const voice = 
      voices.find(v => v.lang === 'es-CL') ||
      voices.find(v => v.lang === 'es-MX') ||
      voices.find(v => v.lang === 'es-419') ||
      voices.find(v => v.lang.startsWith('es'));

    if (voice) {
      utterance.voice = voice;
    }
    
    // Slightly slower rate for better clarity on technical terms
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Stop speech if user sends a new message
    if (speakingId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);
    setLoadingStep('searching'); // Start with searching visualization

    try {
      // Keep a small delay for UI transition smoothness (Searching -> Generating)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingStep('generating');
      
      // Convert internal chat history to Gemini format
      const historyForModel = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Call API - now returns object with text AND real sources
      const { text: responseText, sources } = await sendMessageToGemini(text, selectedModule, selectedSource, historyForModel);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        sources: sources // Use real sources from Google Search Grounding
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error in handleSend:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Lo siento, hubo un problema al conectar con el asistente. Por favor verifica tu conexión o intenta nuevamente.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([]);
    setQuery('');
    setLoadingStep('searching');
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(query);
    }
  };

  // Filter suggestions based on selected module
  const currentSuggestions = SUGGESTIONS.filter(
    (s) => s.category === selectedModule
  ).slice(0, 3);

  const displaySuggestions = currentSuggestions.length > 0 
    ? currentSuggestions 
    : SUGGESTIONS.slice(0, 3); // Fallback to first 3 if no match

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-4 pb-12">
      {/* Removed fixed height (max-h) and internal scroll (overflow-hidden) to show full content */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl flex flex-col">
        
        {/* Header - Sticky ensures it stays visible even if layout shifts */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between shadow-md z-30 sticky top-0 rounded-t-xl">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-200" />
            <h1 className="text-lg font-semibold tracking-wide truncate">Asistente del Sistema de Contabilidad</h1>
          </div>
          
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-blue-400/30 ml-2 shadow-sm"
            title="Iniciar una nueva conversación"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Consulta</span>
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-4 z-20">
          {/* Module Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Server className="w-3 h-3" /> Seleccione Sistema (Menú Principal)
            </label>
            <div className="relative">
              <select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value as SystemModule)}
                className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
              >
                {MODULE_OPTIONS.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Source Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <History className="w-3 h-3" /> Origen de la información
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  value={DataSource.LIBRARY_PDF}
                  checked={selectedSource === DataSource.LIBRARY_PDF}
                  onChange={() => setSelectedSource(DataSource.LIBRARY_PDF)}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm text-slate-700 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" /> Biblioteca (PDF)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  value={DataSource.SUPPORT_HISTORY}
                  checked={selectedSource === DataSource.SUPPORT_HISTORY}
                  onChange={() => setSelectedSource(DataSource.SUPPORT_HISTORY)}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm text-slate-700 flex items-center gap-1">
                  <History className="w-3 h-3 text-slate-400" /> Histórico 
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content Area - Expands naturally with content */}
        <div className="flex-1 p-4 bg-white relative min-h-[300px]">
          
          {messages.length === 0 ? (
            <div className="h-full py-12 flex flex-col justify-center items-center text-slate-500 opacity-60">
               <MessageSquare className="w-16 h-16 mb-4 text-slate-150" />
               <p className="text-sm font-medium">Inicia una consulta seleccionando un módulo del sistema</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-50 text-blue-900 rounded-tr-none border border-blue-100' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    {msg.role === 'model' && (
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                           <span>Asistente IA</span>
                         </div>
                       </div>
                    )}
                    
                    <div className="prose prose-sm prose-blue max-w-none">
                       {msg.isError ? (
                         <span className="text-red-500">{msg.text}</span>
                       ) : (
                         <ReactMarkdown>{msg.text}</ReactMarkdown>
                       )}
                    </div>

                    {msg.role === 'model' && !msg.isError && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-3">
                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-400 font-semibold mb-1">Fuentes Web (Google Search):</p>
                            <div className="flex flex-wrap gap-2">
                              {msg.sources.map((src, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                                  <Search className="w-2.5 h-2.5 opacity-50" /> {src}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-end">
                           <button
                             onClick={() => handleSpeak(msg.text, msg.id)}
                             className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                               speakingId === msg.id 
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                 : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                             }`}
                             title={speakingId === msg.id ? "Detener lectura" : "Escuchar respuesta"}
                           >
                             {speakingId === msg.id ? (
                               <>
                                 <Square className="w-3.5 h-3.5 fill-current" />
                                 <span>Detener</span>
                               </>
                             ) : (
                               <>
                                 <Volume2 className="w-3.5 h-3.5" />
                                 <span>Escuchar</span>
                               </>
                             )}
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && <LoadingIndicator step={loadingStep} />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggestions Area - Flows at the bottom */}
        <div className="bg-white p-4 border-t border-slate-100 z-10">
          
          {/* Input Box */}
          <div className="relative mb-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escriba su pregunta aquí. Ej: ¿Cómo contabilizar una transferencia corriente?"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm text-slate-700 shadow-sm transition-all"
              rows={2}
            />
            <button
              onClick={() => handleSend(query)}
              disabled={!query.trim() || isLoading}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${
                query.trim() && !isLoading 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
             {displaySuggestions.map((suggestion) => (
               <button
                 key={suggestion.id}
                 onClick={() => handleSend(suggestion.text)}
                 disabled={isLoading}
                 className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
               >
                 {suggestion.text}
               </button>
             ))}
          </div>

          <InfoPanel />
        </div>

      </div>
    </div>
  );
};

export default App;