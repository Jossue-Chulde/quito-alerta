export interface Clima {
  temperatura: number;        // °C
  precipitacionUltimaHora: number; // mm acumulados
  condicion: string;          // Descripción legible (ej. "Lluvia ligera")
  weatherCode: number;        // Código WMO original
  advertenciaLluvia: boolean; // true si > 5 mm
}

// Resultado tipado del servicio (para manejar errores sin lanzar excepciones)
export type ResultadoClima = 
  | { ok: true; data: Clima }
  | { ok: false; mensaje: string };