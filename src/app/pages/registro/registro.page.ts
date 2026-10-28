import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { IncidenciaService } from '../../services/incidencia.service';
import { ClimaService } from '../../services/clima.service';
import { FotoService } from '../../services/foto.service';
import { BorradorService } from '../../services/borrador.service';
import { Incidencia, TipoIncidencia } from '../../models/incidencia.model';
import { Clima } from '../../models/clima.model';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonSelect, IonSelectOption, IonTextarea, IonInput, IonCard, 
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonSpinner, IonButton, IonIcon, IonText 
} from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
    IonSelect, IonSelectOption, IonTextarea, IonInput, IonCard, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
    IonSpinner, IonButton, IonIcon, IonText
  ]
})
export class RegistroPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private incidenciaService = inject(IncidenciaService);
  private climaService = inject(ClimaService);
  private fotoService = inject(FotoService);
  private borradorService = inject(BorradorService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  formulario!: FormGroup;
  tipos: TipoIncidencia[] = ['luminaria', 'bache', 'señalizacion', 'alcantarilla', 'parque'];
  prioridades = ['baja', 'media', 'alta'];
  
  fotoLocalPath: string | null = null;
  fotoUrlCloudinary: string | null = null;
  subiendoFoto = false;
  
  climaActual: Clima | null = null;
  cargandoClima = false;
  errorClima: string | null = null;

  ngOnInit() {
    this.initFormulario();
    this.verificarBorrador();
    this.configurarAutoGuardado();
  }

  private initFormulario() {
    this.formulario = this.fb.group({
      tipo: ['', Validators.required],
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      sector: ['', Validators.required],
      prioridad: ['media', Validators.required],
      latitud: [null],
      longitud: [null]
    }, { validators: this.validarReglasCruzadas });
  }

  // Validador personalizado para R5 y R7
  private validarReglasCruzadas(group: AbstractControl): ValidationErrors | null {
    const tipo = group.get('tipo')?.value;
    const prioridad = group.get('prioridad')?.value;
    const foto = group.get('fotoUrl')?.value; // Lo manejamos manualmente
    const lat = group.get('latitud')?.value;
    const lng = group.get('longitud')?.value;

    // R5: Prioridad alta exige foto
    if (prioridad === 'alta' && !foto) {
      return { fotoRequerida: true };
    }
    // R7: Bache exige coordenadas
    if (tipo === 'bache' && (!lat || !lng)) {
      return { ubicacionRequerida: true };
    }
    return null;
  }

  // R8: Verificar si hay un borrador al entrar
  async verificarBorrador() {
    const borrador = await this.borradorService.obtenerBorrador();
    if (borrador) {
      const alert = await this.alertCtrl.create({
        header: 'Borrador encontrado',
        message: `Tienes un registro sin terminar de ${new Date(borrador.guardadoEn).toLocaleString()}. ¿Deseas continuarlo?`,
        buttons: [
          {
            text: 'Descartar',
            role: 'cancel',
            handler: () => this.borradorService.limpiarBorrador()
          },
          {
            text: 'Continuar',
            handler: () => {
              this.formulario.patchValue(borrador);
              this.fotoUrlCloudinary = borrador.fotoUrl;
              if (!this.fotoUrlCloudinary) {
                this.mostrarToast('La fotografía anterior no se pudo recuperar. Debes tomar una nueva.');
              }
            }
          }
        ]
      });
      await alert.present();
    }
  }

  // R8: Guardar borrador cada vez que cambia el formulario
  private configurarAutoGuardado() {
    this.formulario.valueChanges.subscribe(val => {
      this.borradorService.guardarBorrador({
        ...val,
        fotoUrl: this.fotoUrlCloudinary
      });
    });
  }

  // R6: Capturar foto
  async tomarFoto() {
    try {
      const path = await this.fotoService.capturarFoto();
      this.fotoLocalPath = path;
      this.subiendoFoto = true;
      
      // Subir a Cloudinary
      const url = await this.fotoService.subirFoto(path);
      this.fotoUrlCloudinary = url;
      
      // Actualizamos el formulario para que el validador sepa que ya hay foto
      this.formulario.updateValueAndValidity();
      this.mostrarToast('Foto subida correctamente');
    } catch (error: any) {
      this.mostrarToast(error.message);
    } finally {
      this.subiendoFoto = false;
    }
  }

  // R7: Obtener GPS
  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.formulario.patchValue({
        latitud: coordinates.coords.latitude,
        longitud: coordinates.coords.longitude
      });
      this.mostrarToast('Ubicación obtenida');
      this.consultarClima(coordinates.coords.latitude, coordinates.coords.longitude);
    } catch (error) {
      console.error('Error GPS:', error);
      this.mostrarToast('No se pudo obtener el GPS. Ingresa las coordenadas manualmente.');
    }
  }

  // R4: Consultar clima
  async consultarClima(lat: number, lon: number) {
    this.cargandoClima = true;
    this.errorClima = null;
    this.climaActual = null;

    this.climaService.obtenerClima(lat, lon).subscribe(res => {
      this.cargandoClima = false;
      if (res.ok) {
        this.climaActual = res.data;
      } else {
        this.errorClima = res.mensaje;
      }
    });
  }

  // R4: Si el inspector ingresa coordenadas manuales, consultamos el clima
  consultarClimaManual() {
    const lat = this.formulario.get('latitud')?.value;
    const lon = this.formulario.get('longitud')?.value;
    if (lat && lon) {
      this.consultarClima(lat, lon);
    }
  }

  // R5: Guardar incidencia
  async guardar() {
    if (this.formulario.invalid || this.subiendoFoto) {
      this.formulario.markAllAsTouched();
      return;
    }

    // R5: Validación estricta de foto en cliente
    if (this.formulario.value.prioridad === 'alta' && !this.fotoUrlCloudinary) {
      this.mostrarToast('La fotografía es obligatoria para prioridad alta.');
      return;
    }

    // Generar código (INC-AÑO-CORRELATIVO)
    const anio = new Date().getFullYear();
    const correlativo = Math.floor(Math.random() * 9000) + 1000; // Temporal para pruebas
    const codigo = `INC-${anio}-${correlativo}`;

    const nuevaIncidencia: Partial<Incidencia> = {
      codigo: codigo,
      tipo: this.formulario.value.tipo,
      descripcion: this.formulario.value.descripcion,
      direccion: this.formulario.value.direccion,
      sector: this.formulario.value.sector,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      prioridad: this.formulario.value.prioridad,
      fotoUrl: this.fotoUrlCloudinary,
      latitud: this.formulario.value.latitud,
      longitud: this.formulario.value.longitud,
      observacionResolucion: null
    };

    // Guardar en MockAPI
    this.incidenciaService.crear(nuevaIncidencia).subscribe({
      next: async () => {
        await this.borradorService.limpiarBorrador();
        this.mostrarToast('Incidencia registrada exitosamente');
        this.formulario.reset({ prioridad: 'media' });
        this.fotoUrlCloudinary = null;
        this.fotoLocalPath = null;
        this.climaActual = null;
        this.router.navigate(['/tabs/incidencias']);
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Error al guardar. Revisa tu conexión.');
      }
    });
  }

  private async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}