
export type ProcessingStatus = PDF_STATES; 

export interface Stage<T extends ProcessingStatus> {
  key: T;
  label: string;
}

export type StageMap<T extends ProcessingStatus> = Record<T, Stage<T>>;

export type StageSequence<T extends ProcessingStatus> = Stage<T>[];


export type PDF_STATES = 
  | "pending" 
  | "uploading" 
  | "extracting_information" 
  | "vectorizing" 
  | "labeling" 
  | "completed" 
  | "error";


export const PDF_STAGES_MAP: StageMap<PDF_STATES> = {
  pending: { key: "pending", label: "En cola para procesar..." },
  uploading: { key: "uploading", label: "Subiendo fichero..." },
  extracting_information: { key: "extracting_information", label: "Extrayendo información del PDF..." },
  vectorizing: { key: "vectorizing", label: "Vectorizando..." },
  labeling: { key: "labeling", label: "Etiquetando..." },
  completed: { key: "completed", label: "¡Listo para IA!" },
  error: { key: "error", label: "Error en el procesamiento" }
};

export const PDF_STAGES: StageSequence<PDF_STATES> = [
  PDF_STAGES_MAP.pending,
  PDF_STAGES_MAP.uploading,
  PDF_STAGES_MAP.extracting_information,
  PDF_STAGES_MAP.vectorizing,
  PDF_STAGES_MAP.labeling,
  PDF_STAGES_MAP.completed,
];