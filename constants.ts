import { SystemModule, Suggestion, Link } from './types';

export const SUGGESTIONS: Suggestion[] = [
  // Contabilidad
  { id: 'c1', text: "¿Qué cuenta uso para registrar licencias médicas no recuperables?", category: SystemModule.CONTABILIDAD },
  { id: 'c2', text: "Criterios para activar bienes de uso depreciables.", category: SystemModule.CONTABILIDAD },
  { id: 'c3', text: "¿Cómo realizar el asiento de apertura anual?", category: SystemModule.CONTABILIDAD },

  // Presupuesto
  { id: 'p1', text: "¿Cómo se aplica el ajuste sencillo en las cuentas presupuestarias?", category: SystemModule.PRESUPUESTO },
  { id: 'p2', text: "¿Cuál es el procedimiento para una modificación presupuestaria?", category: SystemModule.PRESUPUESTO },
  { id: 'p3', text: "Consultar saldo disponible en ítem 22.", category: SystemModule.PRESUPUESTO },

  // Decretos de Pago
  { id: 'dp1', text: "Instrucciones para la carga de decretos de pago pendientes.", category: SystemModule.DECRETOS_PAGO },
  { id: 'dp2', text: "¿Cómo anular un decreto de pago ya firmado?", category: SystemModule.DECRETOS_PAGO },

  // Plan de Cuentas
  { id: 'pc1', text: "¿Cómo asociar una cuenta contable a un ítem presupuestario?", category: SystemModule.PLAN_CUENTAS },
  { id: 'pc2', text: "Estructura del plan de cuentas para sector municipal.", category: SystemModule.PLAN_CUENTAS },

  // Consulta Ingresos
  { id: 'ci1', text: "¿Cómo obtener el detalle de ingresos por permisos de circulación?", category: SystemModule.CONSULTA_INGRESOS },
  { id: 'ci2', text: "Reporte de ingresos percibidos vs devengados.", category: SystemModule.CONSULTA_INGRESOS },

  // Consulta Gastos
  { id: 'cg1', text: "Listar facturas pendientes de pago a 30 días.", category: SystemModule.CONSULTA_GASTOS },
  { id: 'cg2', text: "Estado de ejecución de gastos en personal.", category: SystemModule.CONSULTA_GASTOS },

  // Documentos Garantía
  { id: 'dg1', text: "¿Cuál es el código para documentos de garantía en custodia?", category: SystemModule.DOCUMENTOS_GARANTIA },
  { id: 'dg2', text: "Registrar devolución de boleta de garantía.", category: SystemModule.DOCUMENTOS_GARANTIA },

  // Menú Varios
  { id: 'mv1', text: "Generación de archivo ZIP para la Contraloría.", category: SystemModule.MENU_VARIOS },
  { id: 'mv2', text: "Configuración de usuarios y permisos del sistema.", category: SystemModule.MENU_VARIOS },

  // Parámetros
  { id: 'pm1', text: "Actualización de indicadores económicos (UTM, UF).", category: SystemModule.PARAMETROS },
  { id: 'pm2', text: "Cierre de año y apertura de periodo contable.", category: SystemModule.PARAMETROS },

  // Transparencia
  { id: 'tr1', text: "Generar archivo para portal de Transparencia Activa.", category: SystemModule.TRANSPARENCIA },
  { id: 'tr2', text: "¿Qué ítems se excluyen del reporte de transparencia?", category: SystemModule.TRANSPARENCIA },
];

export const MODULE_OPTIONS = Object.values(SystemModule);

export const OFFICIAL_LINKS: Link[] = [
  { name: "Contraloría General (CGR)", url: "https://www.contraloria.cl" },
  { name: "Dirección de Presupuestos (DIPRES)", url: "https://www.dipres.gob.cl" },
  { name: "Biblioteca Congreso Nacional (BCN)", url: "https://www.bcn.cl" },
  { name: "SIGFE", url: "https://www.sigfe.cl" },
  { name: "SUBDERE", url: "https://www.subdere.gov.cl" },
  { name: "Normativa Contable (CGR)", url: "https://www.contraloria.cl/web/cgr/normativa-contable" },
  { name: "Licencias Médicas (Nueva Normativa)", url: "https://mfigueroasmc.github.io/Contabilidad/" }
];