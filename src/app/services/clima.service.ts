import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Clima, ResultadoClima } from '../models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  private http = inject(HttpClient);
  private baseUrl = environment.openMeteoUrl;

  obtenerClima(lat: number, lon: number): Observable<ResultadoClima> {
    const url = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&hourly=precipitation&past_hours=1&forecast_hours=1&timezone=auto`;

    return this.http.get<any>(url).pipe(
      map((res): ResultadoClima => {
        const temp = res.current?.temperature_2m ?? 0;
        const precipActual = res.current?.precipitation ?? 0;
        
        let precipAcumulada = precipActual;
        if (res.hourly?.precipitation && res.hourly.precipitation.length > 0) {
           precipAcumulada = res.hourly.precipitation[0];
        }

        const weatherCode = res.current?.weather_code ?? 0;
        
        const clima: Clima = {
          temperatura: Math.round(temp * 10) / 10,
          precipitacionUltimaHora: Math.round(precipAcumulada * 10) / 10,
          condicion: this.mapearWeatherCode(weatherCode),
          weatherCode: weatherCode,
          advertenciaLluvia: precipAcumulada > 5
        };

        return { ok: true, data: clima } as ResultadoClima; 
      }),
      catchError(err => {
        console.error('Error consultando clima:', err);
        return of({ ok: false, mensaje: 'No se pudo obtener información meteorológica. Puedes continuar con el registro.' } as ResultadoClima);
      })
    );
  }

  private mapearWeatherCode(code: number): string {
    if (code === 0) return 'Despejado';
    if (code >= 1 && code <= 3) return 'Parcialmente nublado';
    if (code === 45 || code === 48) return 'Niebla';
    if (code >= 51 && code <= 55) return 'Llovizna';
    if (code >= 61 && code <= 65) return 'Lluvia';
    if (code >= 80 && code <= 82) return 'Chubascos';
    if (code >= 95 && code <= 99) return 'Tormenta';
    return 'Condición desconocida';
  }
}