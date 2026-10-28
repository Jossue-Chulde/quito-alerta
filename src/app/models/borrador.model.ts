import { TipoIncidencia, PrioridadIncidencia } from './incidencia.model';

export interface BorradorIncidencia {
  tipo: TipoIncidencia | null;
  descripcion: string;
  direccion: string;
  sector: string;
  prioridad: PrioridadIncidencia;
  latitud: number | null;
  longitud: number | null;
  fotoUrl: string | null; 
  guardadoEn: string;
}