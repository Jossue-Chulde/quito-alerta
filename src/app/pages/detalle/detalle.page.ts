import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, 
  IonBackButton, IonButtons, AlertController, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmarkOutline, bookmark, createOutline, alertCircleOutline } from 'ionicons/icons';

import { IncidenciaService } from '../../services/incidencia.service';
import { SeguimientoService } from '../../services/seguimiento.service';
import { Incidencia, EstadoIncidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonSpinner,
    IonBackButton, IonButtons
  ]
})
export class DetallePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidenciaService = inject(IncidenciaService);
  private seguimientoService = inject(SeguimientoService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  incidencia: Incidencia | null = null;
  cargando = true;
  errorCarga = false;
  enSeguimiento = false;

  constructor() {
    addIcons({ bookmarkOutline, bookmark, createOutline, alertCircleOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarIncidencia(id);
    } else {
      this.errorCarga = true;
      this.cargando = false;
    }
  }

  private cargarIncidencia(id: string) {
    this.cargando = true;
    this.incidenciaService.obtenerPorId(id).subscribe({
      next: async (data) => {
        this.incidencia = data;
        this.enSeguimiento = await this.seguimientoService.estaEnSeguimiento(data.codigo);
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  // R1: Alternar seguimiento
  async toggleSeguimiento() {
    if (!this.incidencia) return;
    
    if (this.enSeguimiento) {
      await this.seguimientoService.desmarcar(this.incidencia.codigo);
      this.enSeguimiento = false;
      this.mostrarToast('Removido de seguimiento');
    } else {
      await this.seguimientoService.marcar(this.incidencia.codigo);
      this.enSeguimiento = true;
      this.mostrarToast('Añadido a seguimiento');
    }
  }

  // R9: Cambiar estado
  async cambiarEstado(nuevoEstado: EstadoIncidencia) {
    if (!this.incidencia) return;

    // Validar regla de transición
    if (!this.incidenciaService.esTransicionValida(this.incidencia.estado, nuevoEstado)) {
      this.mostrarToast('Transición de estado no permitida.');
      return;
    }

    // Si es resuelta, pedir observación obligatoria
    if (nuevoEstado === 'resuelta') {
      const alert = await this.alertCtrl.create({
        header: 'Resolver Incidencia',
        message: 'Ingresa una observación de al menos 10 caracteres.',
        inputs: [
          {
            name: 'observacion',
            type: 'textarea',
            placeholder: 'Detalle de la resolución...'
          }
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: (data) => {
              if (!data.observacion || data.observacion.trim().length < 10) {
                this.mostrarToast('La observación debe tener al menos 10 caracteres.');
                return false; // Evita que se cierre el alert
              }
              this.ejecutarCambioEstado(nuevoEstado, data.observacion.trim());
              return true;
            }
          }
        ]
      });
      await alert.present();
    } else {
      // Para 'en_proceso' no se pide observación
      this.ejecutarCambioEstado(nuevoEstado, null);
    }
  }

  private ejecutarCambioEstado(nuevoEstado: EstadoIncidencia, observacion: string | null) {
    if (!this.incidencia?.id) return;

    const cambios: Partial<Incidencia> = { estado: nuevoEstado };
    if (observacion) {
      cambios.observacionResolucion = observacion;
    }

    this.incidenciaService.actualizar(this.incidencia.id, cambios).subscribe({
      next: (data) => {
        this.incidencia = data;
        this.mostrarToast('Estado actualizado correctamente');
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Error al actualizar. Revisa tu conexión.');
      }
    });
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

  private async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, position: 'bottom' });
    await toast.present();
  }
}