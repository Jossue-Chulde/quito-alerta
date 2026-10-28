import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResumenIndicadores } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.mockApiUrl}${environment.endpoints.resumen}`;

  obtenerResumen(): Observable<ResumenIndicadores> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => {
        // Manejo robusto: si es un arreglo, tomamos el primero; si es objeto, lo usamos
        if (Array.isArray(res) && res.length > 0) return res[0];
        if (res && typeof res === 'object' && !Array.isArray(res)) return res;
        
        // Si no hay datos, devolvemos ceros
        return { total: 0, pendientes: 0, enProceso: 0, resueltas: 0, alta: 0, media: 0, baja: 0 };
      }),
      catchError((err) => {
        console.error('Error fetching resumen:', err);
        return of({ total: 0, pendientes: 0, enProceso: 0, resueltas: 0, alta: 0, media: 0, baja: 0 });
      })
    );
  }

  actualizarResumen(id: string, resumen: Partial<ResumenIndicadores>): Observable<ResumenIndicadores> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<ResumenIndicadores>(`${this.baseUrl}/${id}`, resumen, { headers });
  }
}