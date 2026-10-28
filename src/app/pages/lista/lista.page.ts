import { Component, OnInit, inject } from '@angular/core';
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

  incidencias: Incidencia[] = [];
  page: number = 1;
  hasMore: boolean = true;
  cargando: boolean = false;
  errorCarga: boolean = false;

  constructor() {
    addIcons({ alertCircleOutline, chevronForwardOutline });
  }

  // Se ejecuta cada vez que entramos a la pestaña
  ionViewWillEnter() {
    // Si la lista está vacía, cargamos la primera página
    if (this.incidencias.length === 0) {
      this.cargarPrimeraPagina();
    }
  }

  cargarPrimeraPagina() {
    this.page = 1;
    this.incidencias = [];
    this.hasMore = true;
    this.cargando = true;
    this.errorCarga = false;

    this.incidenciaService.listar(this.page).subscribe({
      next: (res) => {
        this.incidencias = res.body || [];
        
        // Verificamos si hay más páginas. MockAPI envía X-Total-Count
        const totalItems = res.headers.get('X-Total-Count');
        if (totalItems) {
          const total = parseInt(totalItems, 10);
          this.hasMore = this.incidencias.length < total;
        } else {
          // Respaldo: si trajo menos de 10, ya no hay más
          this.hasMore = this.incidencias.length === 10;
        }
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar lista:', err);
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  // R3: Carga progresiva
  cargarMasDatos(event: InfiniteScrollCustomEvent) {
    if (!this.hasMore) {
      event.target.complete();
      return;
    }

    this.page++;
    this.incidenciaService.listar(this.page).subscribe({
      next: (res) => {
        const nuevas = res.body || [];
        this.incidencias = [...this.incidencias, ...nuevas];
        
        // Si trajo menos de 10, es la última página
        if (nuevas.length < 10) {
          this.hasMore = false;
        }
        
        event.target.complete();
      },
      error: (err) => {
        console.error('Error al cargar más:', err);
        event.target.complete();
        this.hasMore = false; // Detenemos el scroll para evitar spam de errores
      }
    });
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