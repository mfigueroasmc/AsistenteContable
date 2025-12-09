export enum SystemModule {
  PLAN_CUENTAS = "Plan de Cuentas",
  CONSULTA_INGRESOS = "Consulta Ingresos",
  CONSULTA_GASTOS = "Consulta Gastos",
  PRESUPUESTO = "Presupuesto",
  CONTABILIDAD = "Contabilidad",
  DECRETOS_PAGO = "Decretos de Pago",
  DOCUMENTOS_GARANTIA = "Documentos Garantía",
  MENU_VARIOS = "Menú Varios",
  PARAMETROS = "Parámetros",
  TRANSPARENCIA = "Transparencia"
}

export enum DataSource {
  LIBRARY_PDF = "Biblioteca de Conocimientos (PDFs Normativos)",
  SUPPORT_HISTORY = "Histórico de Soportes y Tickets",
  REGULATIONS = "Normativa Vigente (Ley Chile/CGR)"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  sources?: string[]; // To simulate RAG citations
}

export interface Suggestion {
  id: string;
  text: string;
  category: SystemModule;
}

export interface Link {
  name: string;
  url: string;
}