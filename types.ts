
export interface Tender {
  id: string;
  title: string;
  summary: string;
  link: string;
  updated: string;
  amount?: string;
  organism?: string; // Nuevo campo para el Órgano de Contratación
  contractType?: string; // Suministros, Servicios, etc.
  sourceType: string; // Perfiles Contratante, Plataformas Agregadas, Contratos Menores
  keywordsFound: string[];
  isRead: boolean;
}

export interface KeywordCategory {
  name: string;
  keywords: string[];
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface ProjectDraft {
  tenderId: string;
  introduction: string;
  objectives: string;
  methodology: string;
  resources: string;
  evaluation: string;
  coverImage?: string; // base64
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}
