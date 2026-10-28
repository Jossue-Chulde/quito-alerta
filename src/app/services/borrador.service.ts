import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BorradorIncidencia } from '../models/borrador.model';

@Injectable({
  providedIn: 'root'
})
export class BorradorService {
  private readonly STORAGE_KEY = 'borrador_incidencia';

  async guardarBorrador(borrador: Omit<BorradorIncidencia, 'guardadoEn'>): Promise<void> {
    const borradorConFecha: BorradorIncidencia = {
      ...borrador,
      guardadoEn: new Date().toISOString()
    };

    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(borradorConFecha)
    });
  }

  async obtenerBorrador(): Promise<BorradorIncidencia | null> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    if (!value) return null;

    try {
      return JSON.parse(value) as BorradorIncidencia;
    } catch (e) {
      console.error('Error parseando borrador:', e);
      return null;
    }
  }

  async limpiarBorrador(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }
}