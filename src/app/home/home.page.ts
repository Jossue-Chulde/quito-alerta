import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonGrid, 
  IonRow, IonCol, IonButton, IonIcon, IonSpinner, IonText
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, checkmarkDoneOutline, timeOutline, warningOutline, bookmarkOutline, addCircleOutline } from 'ionicons/icons';
import { ViewWillEnter } from '@ionic/angular';

import { ResumenService } from '../services/resumen.service';
import { SeguimientoService } from '../services/seguimiento.service';
import { ResumenIndicadores } from '../models/incidencia.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonSpinner, IonText
  ]
})
export class HomePage implements ViewWillEnter {
  private resumenService = inject(ResumenService);
  private seguimientoService = inject(SeguimientoService);
  private router = inject(Router);

  resumen: ResumenIndicadores | null = null;
  totalSeguimiento: number = 0;
  cargando: boolean = true;
  errorCarga: boolean = false;

  constructor() {
    addIcons({ peopleOutline, checkmarkDoneOutline, timeOutline, warningOutline, bookmarkOutline, addCircleOutline });
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    this.errorCarga = false;

    this.totalSeguimiento = await this.seguimientoService.contarSeguimiento();

    this.resumenService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar resumen:', err);
        // Si falla, mostramos ceros para que no se rompa la pantalla
        this.resumen = { total: 0, pendientes: 0, enProceso: 0, resueltas: 0, alta: 0, media: 0, baja: 0 };
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  irARegistro() { this.router.navigate(['/tabs/registro']); }
  irASeguimiento() { this.router.navigate(['/tabs/seguimiento']); }
}