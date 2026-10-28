import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Cloudinary, ResourceType } from '@capawesome/capacitor-cloudinary';
import { Capacitor } from '@capacitor/core';
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

  async capturarFoto(): Promise<{ path?: string; webPath?: string; blob?: Blob }> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        correctOrientation: true
      });

      // En la web, el plugin devuelve webPath. En Android, devuelve path.
      if (Capacitor.getPlatform() === 'web') {
        if (!photo.webPath) {
          throw new Error('No se obtuvo la ruta web de la imagen.');
        }
        // Convertimos la URL webPath a un Blob para subirlo a Cloudinary
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return { webPath: photo.webPath, blob };
      } else {
        if (!photo.path) {
          throw new Error('No se obtuvo la ruta de la imagen.');
        }
        return { path: photo.path };
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
      throw new Error('No se pudo capturar la fotografía. Verifica los permisos.');
    }
  }

  async subirFoto(data: { path?: string; blob?: Blob }): Promise<string> {
    try {
      await this.initCloudinary();

      if (Capacitor.getPlatform() === 'web') {
        // En la web, subimos el Blob
        const result = await Cloudinary.uploadResource({
          blob: data.blob!,
          resourceType: ResourceType.Image,
          uploadPreset: environment.cloudinary.uploadPreset,
          publicId: `incidencia_${Date.now()}`
        });
        if (!result || !result.secureUrl) {
          throw new Error('Cloudinary no devolvió una URL válida.');
        }
        return result.secureUrl;
      } else {
        // En Android, limpiamos la ruta y subimos el archivo
        let cleanPath = data.path!;
        if (cleanPath.startsWith('file://')) {
          cleanPath = cleanPath.substring(7);
        }
        const result = await Cloudinary.uploadResource({
          path: cleanPath,
          resourceType: ResourceType.Image,
          uploadPreset: environment.cloudinary.uploadPreset,
          publicId: `incidencia_${Date.now()}`
        });
        if (!result || !result.secureUrl) {
          throw new Error('Cloudinary no devolvió una URL válida.');
        }
        return result.secureUrl;
      }
    } catch (error: any) {
      console.error('Error detallado de Cloudinary:', JSON.stringify(error));
      throw new Error('No se pudo subir la imagen. Intenta de nuevo.');
    }
  }
}