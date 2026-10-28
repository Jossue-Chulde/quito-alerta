import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResumenIndicadores } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.mockApiUrl}${environment.endpoints.resumen}`;

  /**
   * B3: Obtiene los indicadores precalculados.
   * MockAPI devuelve un array, así que tomamos el primer elemento.
   */
  obtenerResumen(): Observable<ResumenIndicadores> {
    return this.http.get<ResumenIndicadores[]>(this.baseUrl).pipe(
      map(res => {
        if (res && res.length > 0) return res[0];
        // Si por alguna razón está vacío, devolvemos ceros
        return { total: 0, pendientes: 0, enProceso: 0, resueltas: 0, alta: 0, media: 0, baja: 0 };
      })
    );
  }

  /**
   * B3: Actualiza los conteos. Se llamará después de crear o cambiar el estado de una incidencia.
   */
  actualizarResumen(id: string, resumen: Partial<ResumenIndicadores>): Observable<ResumenIndicadores> {
    return this.http.put<ResumenIndicadores>(`${this.baseUrl}/${id}`, resumen);
  }
}