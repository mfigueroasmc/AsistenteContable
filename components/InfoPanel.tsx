import React from 'react';
import { BookOpen, Database, ShieldCheck, ExternalLink } from 'lucide-react';
import { OFFICIAL_LINKS } from '../constants';

const InfoPanel: React.FC = () => {
  return (
    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5 text-sm text-slate-600">
      <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
        <Database className="w-4 h-4 text-blue-600" />
        <h3>Información Asistente de Búsqueda</h3>
      </div>
      
      <p className="mb-4 leading-relaxed text-justify">
        Este sistema inteligente ha sido desarrollado para fortalecer la gestión financiera municipal, proporcionando asistencia técnica basada exclusivamente en fuentes oficiales. 
        Integra normativas de la <strong className="text-slate-800">Contraloría General de la República (CGR)</strong>, 
        instrucciones de la <strong className="text-slate-800">Dirección de Presupuestos (DIPRES)</strong>, 
        lineamientos de la <strong className="text-slate-800">SUBDERE</strong> y legislación vigente de la 
        <strong className="text-slate-800"> Biblioteca del Congreso Nacional (BCN)</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-blue-700 font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca de Conocimientos</span>
          </div>
          <p className="text-xs text-slate-500">
            Acceso indexado a manuales CGR, tutoriales SIGFE y guías técnicas en PDF.
          </p>
        </div>
        
        <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-blue-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Normativa Oficial</span>
          </div>
          <p className="text-xs text-slate-500">
            Validación contra leyes vigentes, oficios de Contraloría y clasificadores presupuestarios.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Fuentes Oficiales de Conocimiento
        </h4>
        <div className="flex flex-wrap gap-2">
          {OFFICIAL_LINKS.map((link) => (
            <a 
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-blue-300 text-blue-600 hover:text-blue-800 text-xs px-2 py-1.5 rounded transition-colors"
            >
              {link.name} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;