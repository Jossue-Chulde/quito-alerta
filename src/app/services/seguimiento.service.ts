import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  private readonly STORAGE_KEY = 'seguimiento_codigos';

  async obtenerCodigos(): Promise<string[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    if (!value) return [];
    
    try {
      return JSON.parse(value) as string[];
    } catch (e) {
      console.error('Error parseando seguimiento:', e);
      return [];
    }
  }

  async marcar(codigo: string): Promise<void> {
    const codigos = await this.obtenerCodigos();
    if (!codigos.includes(codigo)) {
      codigos.push(codigo);
      await this.guardar(codigos);
    }
  }

  async desmarcar(codigo: string): Promise<void> {
    const codigos = await this.obtenerCodigos();
    const filtrados = codigos.filter(c => c !== codigo);
    await this.guardar(filtrados);
  }

  async estaEnSeguimiento(codigo: string): Promise<boolean> {
    const codigos = await this.obtenerCodigos();
    return codigos.includes(codigo);
  }

  async contarSeguimiento(): Promise<number> {
    const codigos = await this.obtenerCodigos();
    return codigos.length;
  }

  private async guardar(codigos: string[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(codigos)
    });
  }
}