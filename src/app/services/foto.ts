import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Cloudinary, ResourceType } from '@capawesome/capacitor-cloudinary';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  private cloudinaryInitialized = false;

  constructor() {}

  private async initCloudinary() {
    if (!this.cloudinaryInitialized) {
      await Cloudinary.initialize({ cloudName: environment.cloudinary.cloudName });
      this.cloudinaryInitialized = true;
    }
  }

  async capturarFoto(): Promise<string> {
    try {
      const photo = await Camera.getPhoto({
        quality: 85,
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

  async subirFoto(path: string): Promise<string> {
    try {
      await this.initCloudinary();
      
      const result = await Cloudinary.uploadResource({
        path: path,
        resourceType: ResourceType.Image, // <-- Corregido aquí (Mayúscula)
        uploadPreset: environment.cloudinary.uploadPreset,
        publicId: `incidencia_${Date.now()}`
      });

      if (!result.secureUrl) {
        throw new Error('Cloudinary no devolvió una URL válida.');
      }

      return result.secureUrl;
    } catch (error) {
      console.error('Error al subir foto a Cloudinary:', error);
      throw new Error('No se pudo subir la imagen. Intenta de nuevo.');
    }
  }
}