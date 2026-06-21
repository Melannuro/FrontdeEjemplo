import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Categoria } from '../../../../app/model/categoria';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../../app/service/categoria-service';
import Swal from 'sweetalert2';
import { NgClass } from "../../../../../node_modules/@angular/common/types/_common_module-chunk";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-form',
  imports: [FormsModule], // Asegúrate de importar FormsModule para usar [(ngModel)]
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css',
})
export class CategoriaForm implements OnInit {
  readonly title = 'Categorias form';
  laCategoria = signal(new Categoria());

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

  private guardarCategoria(): void {
    this.service.crearCategoria(this.laCategoria()).subscribe({
      next: (categoriaCreada) => {
        console.log('Categoría creada:', categoriaCreada);
        this.router.navigate(['/ListaCategorias']);
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
        this.router.navigate(['/ListaCategorias']);
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
}
