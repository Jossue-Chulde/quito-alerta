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

      if (Capacitor.getPlatform() === 'web') {
        if (!photo.webPath) throw new Error('No se obtuvo la ruta web.');
        // Convertimos a Blob para la subida en web
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return { webPath: photo.webPath, blob };
      } else {
        if (!photo.path) throw new Error('No se obtuvo la ruta nativa.');
        return { path: photo.path };
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
      throw new Error('No se pudo capturar la fotografía. Verifica los permisos.');
    }
  }

  async subirFoto(data: { path?: string; blob?: Blob }): Promise<string> {
    if (Capacitor.getPlatform() === 'web') {
      return this.subirFotoWeb(data.blob!);
    } else {
      return this.subirFotoAndroid(data.path!);
    }
  }

  // MÉTODO PARA WEB: Usa fetch con FormData (Evita el 401 del plugin)
  private async subirFotoWeb(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    
    const url = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error detallado de Cloudinary (Web):', result);
        throw new Error(result.error?.message || 'Error al subir imagen.');
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Error de red en Cloudinary Web:', error);
      throw new Error('No se pudo subir la imagen. Revisa tu conexión.');
    }
  }

  // MÉTODO PARA ANDROID: Usa el plugin nativo con path
  private async subirFotoAndroid(path: string): Promise<string> {
    try {
      await this.initCloudinary();
      
      let cleanPath = path;
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
    } catch (error: any) {
      console.error('Error detallado de Cloudinary (Android):', JSON.stringify(error));
      throw new Error('No se pudo subir la imagen en Android. Revisa la consola.');
    }
  }
}