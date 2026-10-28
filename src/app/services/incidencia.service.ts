import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Incidencia, EstadoIncidencia } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.mockApiUrl}${environment.endpoints.incidencias}`;

  listar(page: number = 1, limit: number = 10): Observable<Incidencia[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(res => {
        // Si la respuesta es un arreglo, lo devolvemos
        if (Array.isArray(res)) {
          return res;
        }
        // Si por alguna razón viene envuelto (ej. { data: [...] }), lo extraemos
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
        // Si no es nada de eso, devolvemos vacío
        return [];
      })
    );
  }

  obtenerPorId(id: string): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.baseUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<Incidencia> {
    const params = new HttpParams().set('codigo', codigo);
    return this.http.get<Incidencia[]>(this.baseUrl, { params }).pipe(
      map(res => {
        if (res && res.length > 0) return res[0];
        throw new Error('No encontrado');
      })
    );
  }

  crear(incidencia: any): Observable<Incidencia> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Incidencia>(this.baseUrl, incidencia, { headers });
  }

  actualizar(id: string, cambios: Partial<Incidencia>): Observable<Incidencia> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Incidencia>(`${this.baseUrl}/${id}`, cambios, { headers });
  }

  esTransicionValida(actual: EstadoIncidencia, nuevo: EstadoIncidencia): boolean {
    if (actual === 'resuelta') return false;
    if (actual === 'pendiente' && (nuevo === 'en_proceso' || nuevo === 'resuelta')) return true;
    if (actual === 'en_proceso' && nuevo === 'resuelta') return true;
    return false;
  }
}