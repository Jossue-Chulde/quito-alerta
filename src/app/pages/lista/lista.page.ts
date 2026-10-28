import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonItem, IonLabel, IonThumbnail, IonBadge, IonSpinner, 
  IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonIcon,
  ViewWillEnter, InfiniteScrollCustomEvent
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline, chevronForwardOutline } from 'ionicons/icons';

import { IncidenciaService } from '../../services/incidencia.service';
import { Incidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonThumbnail, IonBadge, IonSpinner, 
    IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonIcon
  ]
})
export class ListaPage implements ViewWillEnter {
  private incidenciaService = inject(IncidenciaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); 

  incidencias: Incidencia[] = [];
  page: number = 1;
  hasMore: boolean = true;
  cargando: boolean = false;
  errorCarga: boolean = false;

  constructor() {
    addIcons({ alertCircleOutline, chevronForwardOutline });
  }

  ionViewWillEnter() {
    this.cargarPrimeraPagina();
  }

  cargarPrimeraPagina() {
    this.page = 1;
    this.incidencias = [];
    this.hasMore = true;
    this.cargando = true;
    this.errorCarga = false;

    this.incidenciaService.listar(this.page).subscribe({
      next: (data) => {
        this.incidencias = data;
        if (this.incidencias.length < 10) this.hasMore = false;
        this.cargando = false;
        
        // FORZAMOS A ANGULAR A ACTUALIZAR LA PANTALLA
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar lista:', err);
        this.errorCarga = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarMasDatos(event: InfiniteScrollCustomEvent) {
    if (!this.hasMore) {
      event.target.complete();
      return;
    }

    this.page++;
    this.incidenciaService.listar(this.page).subscribe({
      next: (nuevas) => {
        this.incidencias = [...this.incidencias, ...nuevas];
        if (nuevas.length < 10) this.hasMore = false;
        event.target.complete();
      },
      error: (err) => {
        console.error('Error al cargar más:', err);
        event.target.complete();
        this.hasMore = false; 
      }
    });
  }

  verDetalle(incidencia: Incidencia) {
    // Si no hay ID, usamos el código como respaldo
    const idParaNavegar = incidencia.id || incidencia.codigo;
    if (idParaNavegar) {
      this.router.navigate(['/detalle', idParaNavegar]);
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