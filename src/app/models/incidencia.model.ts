export type EstadoIncidencia = 'pendiente' | 'en_proceso' | 'resuelta';
export type PrioridadIncidencia = 'baja' | 'media' | 'alta';
export type TipoIncidencia = 'luminaria' | 'bache' | 'señalizacion' | 'alcantarilla' | 'parque';

export interface Incidencia {
  id?: string;
  codigo: string; 
  tipo: TipoIncidencia;
  descripcion: string;
  direccion: string;
  sector: string;
  fecha: string; 
  estado: EstadoIncidencia;
  prioridad: PrioridadIncidencia;
  fotoUrl: string | null; 
  latitud: number | null;
  longitud: number | null;
  observacionResolucion: string | null; 
}

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