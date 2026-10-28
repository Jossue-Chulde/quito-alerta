import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonItem, IonLabel, IonThumbnail, IonBadge, IonSpinner, 
  IonButton, IonIcon, ViewWillEnter 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmarkOutline, chevronForwardOutline, trashOutline, alertCircleOutline } from 'ionicons/icons';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IncidenciaService } from '../../services/incidencia.service';
import { SeguimientoService } from '../../services/seguimiento.service';
import { Incidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonThumbnail, IonBadge, IonSpinner, 
    IonButton, IonIcon
  ]
})
export class SeguimientoPage implements ViewWillEnter {
  private incidenciaService = inject(IncidenciaService);
  private seguimientoService = inject(SeguimientoService);
  private router = inject(Router);

  incidencias: Incidencia[] = [];
  cargando: boolean = false;
  errorCarga: boolean = false;

  constructor() {
    addIcons({ bookmarkOutline, chevronForwardOutline, trashOutline, alertCircleOutline });
  }

  // R1: Se ejecuta cada vez que entras a la pestaña
  async ionViewWillEnter() {
    await this.cargarSeguimiento();
  }

  async cargarSeguimiento() {
    this.cargando = true;
    this.errorCarga = false;
    
    // 1. Obtener los códigos locales
    const codigos = await this.seguimientoService.obtenerCodigos();
    
    if (codigos.length === 0) {
      this.incidencias = [];
      this.cargando = false;
      return;
    }

    // 2. Hacer peticiones para cada código
    // Nota: Si MockAPI soporta filtros (ej. ?codigo=INC-2026-0001), se podría optimizar.
    // Por ahora, hacemos peticiones individuales usando el endpoint de listar con filtro.
    const peticiones = codigos.map(codigo => 
      this.incidenciaService.listar(1, 1).pipe(
        // Esta es una simplificación. En un entorno real, buscaríamos por código.
        // Como no tenemos un endpoint de búsqueda por código, filtraremos localmente.
        catchError(() => of(null))
      )
    );

    // Como MockAPI no filtra fácilmente por código desde un array, 
    // la forma más limpia con nuestros endpoints actuales es:
    // Hacer una petición por cada ID (pero no tenemos los IDs, solo los códigos).
    
    // SOLUCIÓN PARA ESTA DEMO: 
    // Traer la primera página de incidencias (o pedir a MockAPI que filtre por código).
    // MockAPI permite ?codigo=INC-2026-0001.
    
    // Vamos a usar un enfoque de petición por código:
    const requests = codigos.map(cod => 
      this.incidenciaService.buscarPorCodigo(cod).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: (resultados) => {
        // Filtrar los que fallaron o vinieron nulos
        this.incidencias = resultados.filter(r => r !== null) as Incidencia[];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar seguimiento:', err);
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  // R1: Desmarcar y quitar de la lista inmediatamente
  async desmarcar(incidencia: Incidencia, event: Event) {
    event.stopPropagation(); // Evita que se abra el detalle al hacer clic en el botón
    await this.seguimientoService.desmarcar(incidencia.codigo);
    this.incidencias = this.incidencias.filter(i => i.codigo !== incidencia.codigo);
  }

  verDetalle(incidencia: Incidencia) {
    if (incidencia.id) {
      this.router.navigate(['/detalle', incidencia.id]);
    }
  }

  getColorEstado(estado: string): string {
    if (estado === 'pendiente') return 'warning';
    if (estado === 'en_proceso') return 'primary';
    return 'success';
  }

  getColorPrioridad(prioridad: string): string {
    if (prioridad === 'alta') return 'danger';
    if (prioridad === 'media') return 'warning';
    return 'medium';
  }
}