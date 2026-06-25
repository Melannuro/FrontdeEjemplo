import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mascota } from '../model/mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly storageKey = 'vet_mascotas';

  constructor() {
    // Inicializar con datos de ejemplo si está vacío
    if (!localStorage.getItem(this.storageKey)) {
      const datosIniciales: Mascota[] = [
        {
          idMascota: 1,
          nombreMascota: 'Firulais',
          especieMascota: 'Perro',
          edadMascota: 3,
          idPropietario: { idPropietario: 1, nombrePropietario: 'Juan Pérez', telefonoPropietario: '555-1234', createAt: '2026-06-20' },
          createAt: '2026-06-21'
        },
        {
          idMascota: 2,
          nombreMascota: 'Michi',
          especieMascota: 'Gato',
          edadMascota: 2,
          idPropietario: { idPropietario: 2, nombrePropietario: 'María López', telefonoPropietario: '555-5678', createAt: '2026-06-22' },
          createAt: '2026-06-23'
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(datosIniciales));
    }
  }

  private getMascotasFromStorage(): Mascota[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveMascotasToStorage(mascotas: Mascota[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(mascotas));
  }

  mostrarProductos(): Observable<Mascota[]> { // Para coincidir con la arquitectura del listado de productos
    return of(this.getMascotasFromStorage());
  }

  mostrarProducto(id: number): Observable<Mascota> {
    const list = this.getMascotasFromStorage();
    const found = list.find(m => m.idMascota === id);
    if (!found) {
      throw new Error('Mascota no encontrada');
    }
    return of(found);
  }

  crearProducto(mascota: Mascota): Observable<Mascota> {
    const list = this.getMascotasFromStorage();
    const maxId = list.reduce((max, m) => (m.idMascota && m.idMascota > max ? m.idMascota : max), 0);
    mascota.idMascota = maxId + 1;
    mascota.createAt = new Date().toISOString().split('T')[0];
    list.push(mascota);
    this.saveMascotasToStorage(list);
    return of(mascota);
  }

  eliminarProducto(id: number): Observable<Mascota> {
    const list = this.getMascotasFromStorage();
    const foundIndex = list.findIndex(m => m.idMascota === id);
    if (foundIndex === -1) {
      throw new Error('Mascota no encontrada');
    }
    const removed = list.splice(foundIndex, 1)[0];
    this.saveMascotasToStorage(list);
    return of(removed);
  }

  actualizarProducto(mascota: Mascota): Observable<Mascota> {
    const list = this.getMascotasFromStorage();
    const foundIndex = list.findIndex(m => m.idMascota === mascota.idMascota);
    if (foundIndex === -1) {
      throw new Error('Mascota no encontrada');
    }
    list[foundIndex] = mascota;
    this.saveMascotasToStorage(list);
    return of(mascota);
  }
}
