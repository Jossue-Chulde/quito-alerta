// Tipos literales para evitar errores de tipeo
export type EstadoIncidencia = 'pendiente' | 'en_proceso' | 'resuelta';
export type PrioridadIncidencia = 'baja' | 'media' | 'alta';
export type TipoIncidencia = 'luminaria' | 'bache' | 'señalizacion' | 'alcantarilla' | 'parque';

// Interfaz principal que refleja el recurso en MockAPI
export interface Incidencia {
  id?: string; // MockAPI lo genera, opcional al crear
  codigo: string; // Formato INC-2026-0001
  tipo: TipoIncidencia;
  descripcion: string;
  direccion: string;
  sector: string;
  fecha: string; // ISO 8601 UTC (ej. 2026-10-27T15:30:00.000Z)
  estado: EstadoIncidencia;
  prioridad: PrioridadIncidencia;
  fotoUrl: string | null; // URL de Cloudinary
  latitud: number | null;
  longitud: number | null;
  observacionResolucion: string | null; // Obligatorio solo al pasar a 'resuelta'
}

// Interfaz para el endpoint /resumen (B3)
export interface ResumenIndicadores {
  id?: string;
  total: number;
  pendientes: number;
  enProceso: number;
  resueltas: number;
  alta: number;
  media: number;
  baja: number;
}