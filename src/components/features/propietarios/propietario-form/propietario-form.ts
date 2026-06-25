import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Propietario } from '../../../../app/model/propietario';
import { Router } from '@angular/router';
import { PropietarioService } from '../../../../app/service/propietario-service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-propietario-form',
  imports: [FormsModule, NgClass],
  templateUrl: './propietario-form.html',
  styleUrl: './propietario-form.css',
})
export class PropietarioForm implements OnInit {
  readonly title = 'Formulario de Propietario';
  elPropietario = signal(new Propietario());

  // Input de señal que recibe el ID (si viene por parámetro de ruta)
  id = input<number>();
  private router = inject(Router);
  private service = inject(PropietarioService);

  ngOnInit(): void {
    this.cargarPropietario();
  }

  private cargarPropietario(): void {
    const elid = this.id();
    if (elid) {
      this.service.mostrarCategoria(elid).subscribe({
        next: (elPropietarioLeido) => this.elPropietario.set(elPropietarioLeido),
        error: (err) => console.error('Error al cargar el propietario:', err)
      });
    }
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.id()) {
      this.actualizarPropietario();
    } else {
      this.guardarPropietario();
    }
  }

  private guardarPropietario(): void {
    const nuevoPropietario = { ...this.elPropietario() };
    delete nuevoPropietario.idPropietario;

    this.service.crearCategoria(nuevoPropietario).subscribe({
      next: (propietarioCreado) => {
        this.router.navigate(['/ListaPropietarios']);
        Swal.fire({
          title: 'Propietario registrado',
          text: `El propietario "${propietarioCreado.nombrePropietario}" ha sido creado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al crear propietario:', err)
    });
  }

  private actualizarPropietario(): void {
    this.service.actualizarCategoria(this.elPropietario()).subscribe({
      next: () => {
        this.router.navigate(['/ListaPropietarios']);
        Swal.fire({
          title: 'Propietario actualizado',
          text: `El propietario "${this.elPropietario().nombrePropietario}" ha sido actualizado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al actualizar propietario:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/ListaPropietarios']);
  }
}
