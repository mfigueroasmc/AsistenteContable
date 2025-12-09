import React from 'react';
import { Loader2, Search } from 'lucide-react';

interface LoadingIndicatorProps {
  step: 'searching' | 'generating';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 animate-in fade-in duration-300">
      <div className="relative">
        {step === 'searching' ? (
          <div className="bg-blue-100 p-3 rounded-full">
            <Search className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        ) : (
          <div className="bg-purple-100 p-3 rounded-full">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500">
        {step === 'searching' 
          ? "Consultando biblioteca normativa y manuales..." 
          : "Generando respuesta con Gemini Pro..."}
      </p>
    </div>
  );
};

export default LoadingIndicator;