export interface Clima {
  temperatura: number;        
  precipitacionUltimaHora: number; 
  condicion: string;          
  weatherCode: number;        
  advertenciaLluvia: boolean; 
}

export type ResultadoClima = 
  | { ok: true; data: Clima }
  | { ok: false; mensaje: string };