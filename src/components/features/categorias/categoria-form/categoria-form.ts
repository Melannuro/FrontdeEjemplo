import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Categoria } from '../../../../app/model/categoria';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../../app/service/categoria-service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common'; // ¡Corregido el import de NgClass aquí!
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-categoria-form',
  // Añadimos NgClass a los imports para poder usarlo en el diseño adaptativo de Bootstrap
  imports: [FormsModule, NgClass],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css',
})
export class CategoriaForm implements OnInit {
  readonly title = 'Categorías form';
  laCategoria = signal(new Categoria());

  // Input de señal que recibe el ID (si viene por parámetro de ruta)
  id = input<number>();
  private router = inject(Router);
  private service = inject(CategoriaService);

  ngOnInit(): void {
    this.cargarCategoria();
  }

  private cargarCategoria(): void {
    const elid = this.id();
    if (elid) {
      this.service.mostrarCategoria(elid).subscribe({
        next: (laCategoriaLeida) => this.laCategoria.set(laCategoriaLeida),
        error: (err) => console.error('Error al cargar la categoría:', err)
      });
    }
  }

  // MÉTODO PÚBLICO PRINCIPAL: Se ejecuta al enviar el formulario
  guardar(form: NgForm): void {
    if (form.invalid) return;

    // Evaluamos inteligentemente el input() de señal para saber el modo
    if (this.id()) {
      this.actualizarCategoria();
    } else {
      this.guardarCategoria();
    }
  }

  // Mantenemos tus métodos privados de persistencia intactos
  private guardarCategoria(): void {
    // 1. Clonamos el objeto actual de la señal usando el spread operator (...)
    // para no alterar directamente lo que el usuario ve en el formulario.
    const nuevaCategoria = { ...this.laCategoria() };

    // 2. Eliminamos o volvemos nulo el ID para que Spring Boot sepa que es una CREACIÓN
    delete nuevaCategoria.idCategoria;

    // 3. Enviamos el objeto modificado al servicio
    this.service.crearCategoria(nuevaCategoria).subscribe({
      next: (categoriaCreada) => {
        console.log('Categoría creada:', categoriaCreada);
        this.router.navigate(['/ListaCategoria']);
        Swal.fire({
          title: 'Categoría creada',
          text: `La categoría "${categoriaCreada.nombreCategoria}" ha sido creada exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al crear la categoría:', err)
    });
  }

  private actualizarCategoria(): void {
    this.service.actualizarCategoria(this.laCategoria()).subscribe({
      next: () => {
        this.router.navigate(['/ListaCategoria']);
        Swal.fire({
          title: 'Categoría actualizada',
          text: `La categoría "${this.laCategoria().nombreCategoria}" ha sido actualizada exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al actualizar la categoría:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/ListaCategorias']);
  }
}
