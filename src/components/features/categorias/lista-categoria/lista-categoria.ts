import { Component, OnInit, signal, inject } from '@angular/core';
import { Categoria } from '../../../../app/model/categoria';
import { CategoriaService } from '../../../../app/service/categoria-service'; // <-- Asegúrate de ajustar la ruta correcta a tu servicio
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-categoria',
  imports: [], // Si usas *ngIf o *ngFor tradicionales en tu HTML, recuerda importar CommonModule aquí
  templateUrl: './lista-categoria.html',
  styleUrl: './lista-categoria.css',
})
export class ListaCategoria implements OnInit {
  readonly titulo: string = 'Categorías de productos';

  // 1. Inicializamos la lista vacía, ya sin los datos en duro
  listaCategorias = signal<Categoria[]>([]);

  // 2. Inyectamos el servicio a través del constructor
  private service = inject(CategoriaService);

  private router = inject(Router);

  // 3. Al inicializarse el componente, mandamos a llamar al backend
  ngOnInit(): void {
    this.cargarCategorias();
  }

  private cargarCategorias(): void {
    this.service.mostrarCategorias().subscribe({
      next: lasCategorias => {
        this.listaCategorias.set(lasCategorias);
        console.log('Categorías cargadas:', lasCategorias);
      }, // Actualizamos la señal con los datos del backend
      error: err => console.error('Error al cargar categorías:', err)
    });
  }

  eliminar(categoria: Categoria): void {
    // 1. Validamos que el ID exista antes de abrir el cuadro de diálogo
    if (categoria.idCategoria === undefined) {
      Swal.fire('Error', 'No se puede eliminar una categoría sin un ID válido.', 'error');
      return;
    }

    Swal.fire({
      title: `¿Estás seguro de eliminar esta categoría: ${categoria.nombreCategoria}?`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        // 2. Aquí TypeScript ya sabe con 100% de certeza que idCategoria es un 'number'
        this.service.eliminarCategoria(categoria.idCategoria!).subscribe({
          next: () => {
            this.cargarCategorias(); // Recarga la lista después de eliminar
            Swal.fire({
              title: "¡Categoría eliminada!",
              text: `La categoría "${categoria.nombreCategoria}" ha sido eliminada.`,
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la categoría del servidor.', 'error');
          }
        });
      }
    });
  }

  irAForm(categoria?: Categoria): void {
    if (categoria) {
      this.router.navigate(['/CategoriaForm', categoria.idCategoria]);
    } else {
      this.router.navigate(['/CategoriaForm']);
    }
  }
}
