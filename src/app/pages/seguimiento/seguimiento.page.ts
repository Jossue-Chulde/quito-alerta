import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonItem, IonLabel, IonThumbnail, IonBadge, IonSpinner, 
  IonButton, IonIcon, ViewWillEnter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, trashOutline, alertCircleOutline } from 'ionicons/icons';
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
  private cdr = inject(ChangeDetectorRef);

  incidencias: Incidencia[] = [];
  cargando: boolean = false;
  errorCarga: boolean = false;

  constructor() {
    addIcons({ chevronForwardOutline, trashOutline, alertCircleOutline });
  }

  async ionViewWillEnter() {
    await this.cargarSeguimiento();
  }

  async cargarSeguimiento() {
    this.cargando = true;
    this.errorCarga = false;
    
    const codigos = await this.seguimientoService.obtenerCodigos();
    
    if (codigos.length === 0) {
      this.incidencias = [];
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    const requests = codigos.map(cod => 
      this.incidenciaService.buscarPorCodigo(cod).pipe(catchError(() => of(null)))
    );

    forkJoin(requests).subscribe({
      next: (resultados) => {
        this.incidencias = resultados.filter(r => r !== null) as Incidencia[];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar seguimiento:', err);
        this.errorCarga = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  async desmarcar(incidencia: Incidencia, event: Event) {
    event.stopPropagation();
    await this.seguimientoService.desmarcar(incidencia.codigo);
    this.incidencias = this.incidencias.filter(i => i.codigo !== incidencia.codigo);
    this.cdr.detectChanges();
  }

  verDetalle(incidencia: Incidencia) {
    const idParaNavegar = incidencia.id || incidencia.codigo;
    this.router.navigate(['/detalle', idParaNavegar]);
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