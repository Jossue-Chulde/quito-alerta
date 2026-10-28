import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Cloudinary } from '@capawesome/capacitor-cloudinary';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  private cloudinaryInitialized = false;

  constructor() {}

  /**
   * Inicializa Cloudinary con el Cloud Name definido en environment.
   */
  private async initCloudinary() {
    if (!this.cloudinaryInitialized) {
      await Cloudinary.initialize({ cloudName: environment.cloudinary.cloudName });
      this.cloudinaryInitialized = true;
    }
  }

  /**
   * R6: Captura una foto usando la cámara nativa.
   */
  async capturarFoto(): Promise<string> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        correctOrientation: true
      });

      if (!photo.path) {
        throw new Error('No se obtuvo la ruta de la imagen.');
      }
      return photo.path;
    } catch (error) {
      console.error('Error al capturar foto:', error);
      throw new Error('No se pudo capturar la fotografía. Verifica los permisos de la cámara.');
    }
  }

  /**
   * R6: Sube la foto capturada a Cloudinary y devuelve la URL pública.
   */
  async subirFoto(path: string): Promise<string> {
    try {
      await this.initCloudinary();
      
      // En Android, Capacitor devuelve la ruta con "file://". 
      // El plugin de Cloudinary necesita la ruta limpia para poder leer el archivo temporal.
      let cleanPath = path;
      if (cleanPath.startsWith('file://')) {
        cleanPath = cleanPath.substring(7);
      }

      const result = await Cloudinary.uploadResource({
        path: cleanPath, 
        // Forzamos el tipo para evitar problemas con los tipos estrictos de TypeScript
        resourceType: 'Image' as any, 
        uploadPreset: environment.cloudinary.uploadPreset,
        publicId: `incidencia_${Date.now()}`
      });

      if (!result || !result.secureUrl) {
        throw new Error('Cloudinary no devolvió una URL válida.');
      }

      return result.secureUrl;
    } catch (error: any) {
      // ESTO ES LO QUE NOS DIRÁ EL ERROR REAL EN LOGCAT SI ALGO FALLA
      console.error('Error detallado de Cloudinary:', JSON.stringify(error)); 
      throw new Error('No se pudo subir la imagen. Intenta de nuevo.');
    }
  }
}