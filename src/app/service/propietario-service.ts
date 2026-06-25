import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Propietario } from '../model/propietario';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  private readonly storageKey = 'vet_propietarios';

  constructor() {
    // Inicializar con datos de ejemplo si está vacío
    if (!localStorage.getItem(this.storageKey)) {
      const datosIniciales: Propietario[] = [
        { idPropietario: 1, nombrePropietario: 'Juan Pérez', telefonoPropietario: '555-1234', createAt: '2026-06-20' },
        { idPropietario: 2, nombrePropietario: 'María López', telefonoPropietario: '555-5678', createAt: '2026-06-22' },
        { idPropietario: 3, nombrePropietario: 'Carlos Gómez', telefonoPropietario: '555-9012', createAt: '2026-06-23' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(datosIniciales));
    }
  }

  private getPropietariosFromStorage(): Propietario[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private savePropietariosToStorage(propietarios: Propietario[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(propietarios));
  }

  mostrarCategorias(): Observable<Propietario[]> { // Mantener nombre similar o compatible
    return of(this.getPropietariosFromStorage());
  }

  mostrarCategoria(id: number): Observable<Propietario> {
    const list = this.getPropietariosFromStorage();
    const found = list.find(p => p.idPropietario === id);
    if (!found) {
      throw new Error('Propietario no encontrado');
    }
    return of(found);
  }

  crearCategoria(propietario: Propietario): Observable<Propietario> {
    const list = this.getPropietariosFromStorage();
    const maxId = list.reduce((max, p) => (p.idPropietario && p.idPropietario > max ? p.idPropietario : max), 0);
    propietario.idPropietario = maxId + 1;
    propietario.createAt = new Date().toISOString().split('T')[0];
    list.push(propietario);
    this.savePropietariosToStorage(list);
    return of(propietario);
  }

  eliminarCategoria(id: number): Observable<Propietario> {
    const list = this.getPropietariosFromStorage();
    const foundIndex = list.findIndex(p => p.idPropietario === id);
    if (foundIndex === -1) {
      throw new Error('Propietario no encontrado');
    }
    const removed = list.splice(foundIndex, 1)[0];
    this.savePropietariosToStorage(list);

    // Limpiar relación de propietario en las mascotas asociadas
    const mascotasKey = 'vet_mascotas';
    const mascotasData = localStorage.getItem(mascotasKey);
    if (mascotasData) {
      const mascotas = JSON.parse(mascotasData) as any[];
      const updatedMascotas = mascotas.map(m => {
        if (m.idPropietario && m.idPropietario.idPropietario === id) {
          m.idPropietario = undefined;
        }
        return m;
      });
      localStorage.setItem(mascotasKey, JSON.stringify(updatedMascotas));
    }

    return of(removed);
  }

  actualizarCategoria(propietario: Propietario): Observable<Propietario> {
    const list = this.getPropietariosFromStorage();
    const foundIndex = list.findIndex(p => p.idPropietario === propietario.idPropietario);
    if (foundIndex === -1) {
      throw new Error('Propietario no encontrado');
    }
    list[foundIndex] = propietario;
    this.savePropietariosToStorage(list);

    // Actualizar también en el almacenamiento de mascotas
    const mascotasKey = 'vet_mascotas';
    const mascotasData = localStorage.getItem(mascotasKey);
    if (mascotasData) {
      const mascotas = JSON.parse(mascotasData) as any[];
      const updatedMascotas = mascotas.map(m => {
        if (m.idPropietario && m.idPropietario.idPropietario === propietario.idPropietario) {
          m.idPropietario = propietario;
        }
        return m;
      });
      localStorage.setItem(mascotasKey, JSON.stringify(updatedMascotas));
    }

    return of(propietario);
  }
}
