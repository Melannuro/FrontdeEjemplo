import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MascotaService } from '../../../../app/service/mascota-service';
import { PropietarioService } from '../../../../app/service/propietario-service';
import { Mascota } from '../../../../app/model/mascota';
import { Propietario } from '../../../../app/model/propietario';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-mascota-form',
  imports: [FormsModule, NgClass],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css',
})
export class MascotaForm implements OnInit {
  readonly title = 'Formulario de Mascota';
  laMascota = signal(new Mascota());

  // Input de señal que recibe el ID (si viene por parámetro de ruta)
  id = input<number>();
  private router = inject(Router);
  private service = inject(MascotaService);
  private propietarioService = inject(PropietarioService);
  listaPropietarios = signal<Propietario[]>([]);

  ngOnInit(): void {
    this.cargarMascota();
    this.cargarPropietarios();
  }

  private cargarPropietarios(): void {
    this.propietarioService.mostrarCategorias().subscribe({
      next: (data) => this.listaPropietarios.set(data),
      error: (err) => console.error('Error al cargar propietarios:', err)
    });
  }

  private cargarMascota(): void {
    const elid = this.id();
    if (elid) {
      this.service.mostrarProducto(elid).subscribe({
        next: (laMascotaLeida) => this.laMascota.set(laMascotaLeida),
        error: (err) => console.error('Error al cargar la mascota:', err)
      });
    }
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.id()) {
      this.actualizarMascota();
    } else {
      this.guardarMascota();
    }
  }

  private guardarMascota(): void {
    const nuevaMascota = { ...this.laMascota() };
    delete nuevaMascota.idMascota;

    this.service.crearProducto(nuevaMascota).subscribe({
      next: (mascotaCreada) => {
        this.router.navigate(['/ListaMascotas']);
        Swal.fire({
          title: 'Mascota registrada',
          text: `La mascota "${mascotaCreada.nombreMascota}" ha sido registrada exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al crear mascota:', err)
    });
  }

  private actualizarMascota(): void {
    this.service.actualizarProducto(this.laMascota()).subscribe({
      next: () => {
        this.router.navigate(['/ListaMascotas']);
        Swal.fire({
          title: 'Mascota actualizada',
          text: `La mascota "${this.laMascota().nombreMascota}" ha sido actualizada exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al actualizar mascota:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/ListaMascotas']);
  }

  compararPropietario(p1: Propietario, p2: Propietario): boolean {
    return p1 && p2 ? p1.idPropietario === p2.idPropietario : p1 === p2;
  }
}
