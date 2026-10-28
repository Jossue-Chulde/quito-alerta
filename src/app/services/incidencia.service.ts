import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
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

  listar(page: number, limit: number = environment.app.pageSize): Observable<HttpResponse<Incidencia[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', 'fecha')
      .set('order', 'desc');

    return this.http.get<Incidencia[]>(this.baseUrl, { params, observe: 'response' }).pipe(
      map((res: HttpResponse<Incidencia[]>) => {
        // Filtro de seguridad: solo dejamos pasar objetos que tengan 'codigo' y 'tipo'
        if (res.body) {
          const soloIncidencias = res.body.filter((item: any) => item.codigo && item.tipo);
          // Clonamos la respuesta pero con los datos filtrados
          return res.clone({ body: soloIncidencias });
        }
        return res;
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
        if (res && res.length > 0) {
          return res[0];
        }
        throw new Error('Incidencia no encontrada');
      })
    );
  }

  crear(incidencia: any): Observable<Incidencia> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
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