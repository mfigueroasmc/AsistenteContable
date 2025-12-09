import { SystemModule, Suggestion, Link } from './types';

export const SUGGESTIONS: Suggestion[] = [
  { id: '1', text: "¿Cómo se aplica el ajuste sencillo en las cuentas presupuestarias?", category: SystemModule.PRESUPUESTO },
  { id: '2', text: "¿Qué cuenta uso para registrar licencias médicas no recuperables?", category: SystemModule.CONTABILIDAD },
  { id: '3', text: "Instrucciones para la carga de decretos de pago pendientes.", category: SystemModule.DECRETOS_PAGO },
  { id: '4', text: "Criterios para activar bienes de uso depreciables.", category: SystemModule.CONTABILIDAD },
  { id: '5', text: "¿Cuál es el código para documentos de garantía en custodia?", category: SystemModule.DOCUMENTOS_GARANTIA },
];

export const MODULE_OPTIONS = Object.values(SystemModule);

export const OFFICIAL_LINKS: Link[] = [
  { name: "Contraloría General (CGR)", url: "https://www.contraloria.cl" },
  { name: "Dirección de Presupuestos (DIPRES)", url: "https://www.dipres.gob.cl" },
  { name: "Biblioteca Congreso Nacional (BCN)", url: "https://www.bcn.cl" },
  { name: "SIGFE", url: "https://www.sigfe.cl" },
  { name: "SUBDERE", url: "https://www.subdere.gov.cl" },
  { name: "Normativa Contable (CGR)", url: "https://www.contraloria.cl/web/cgr/normativa-contable" }
];