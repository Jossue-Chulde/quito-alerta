import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Incidencia, EstadoIncidencia } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.mockApiUrl}${environment.endpoints.incidencias}`;

  /**
   * R2 y R3: Consulta paginada. Devuelve la respuesta completa (HttpResponse)
   * para poder leer el header 'X-Total-Count' y saber si hay más páginas.
   */
  listar(page: number, limit: number = environment.app.pageSize): Observable<HttpResponse<Incidencia[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', 'fecha')
      .set('order', 'desc'); // Traer las más recientes primero

    return this.http.get<Incidencia[]>(this.baseUrl, { params, observe: 'response' });
  }

  /**
   * R2: Obtener detalle por ID.
   */
  obtenerPorId(id: string): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.baseUrl}/${id}`);
  }

  /**
   * R5: Crear incidencia.
   */
  crear(incidencia: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.baseUrl, incidencia);
  }

  /**
   * R9: Actualizar incidencia (usado principalmente para cambio de estado y observación).
   */
  actualizar(id: string, cambios: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.put<Incidencia>(`${this.baseUrl}/${id}`, cambios);
  }

  /**
   * R9: Validar si el cambio de estado es permitido.
   * Reglas: 
   * - pendiente -> en_proceso (Válido)
   * - pendiente -> resuelta (Válido)
   * - en_proceso -> resuelta (Válido)
   * - resuelta -> CUALQUIER COSA (Inválido)
   */
  esTransicionValida(actual: EstadoIncidencia, nuevo: EstadoIncidencia): boolean {
    if (actual === 'resuelta') return false;
    if (actual === 'pendiente' && (nuevo === 'en_proceso' || nuevo === 'resuelta')) return true;
    if (actual === 'en_proceso' && nuevo === 'resuelta') return true;
    return false;
  }
}