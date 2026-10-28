import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BorradorIncidencia } from '../models/borrador.model';

@Injectable({
  providedIn: 'root'
})
export class BorradorService {
  private readonly STORAGE_KEY = 'borrador_incidencia';

  /**
   * R8: Guarda el borrador actual.
   */
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

  /**
   * R8: Recupera el borrador si existe.
   */
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

  /**
   * R8: Elimina el borrador (al guardar la incidencia o al descartarlo).
   */
  async limpiarBorrador(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }
}