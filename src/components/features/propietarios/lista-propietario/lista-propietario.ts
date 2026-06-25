import { Component, OnInit, signal, inject } from '@angular/core';
import { Propietario } from '../../../../app/model/propietario';
import { PropietarioService } from '../../../../app/service/propietario-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-propietario',
  imports: [],
  templateUrl: './lista-propietario.html',
  styleUrl: './lista-propietario.css',
})
export class ListaPropietario implements OnInit {
  readonly titulo: string = 'Propietarios de Mascotas';
  listaPropietarios = signal<Propietario[]>([]);

  private service = inject(PropietarioService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarPropietarios();
  }

  private cargarPropietarios(): void {
    this.service.mostrarCategorias().subscribe({
      next: losPropietarios => {
        this.listaPropietarios.set(losPropietarios);
      },
      error: err => console.error('Error al cargar propietarios:', err)
    });
  }

  eliminar(propietario: Propietario): void {
    if (propietario.idPropietario === undefined) {
      Swal.fire('Error', 'No se puede eliminar un propietario sin un ID válido.', 'error');
      return;
    }

    Swal.fire({
      title: `¿Estás seguro de eliminar al propietario: ${propietario.nombrePropietario}?`,
      text: "¡Se desasociará de sus mascotas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminarCategoria(propietario.idPropietario!).subscribe({
          next: () => {
            this.cargarPropietarios();
            Swal.fire({
              title: "¡Propietario eliminado!",
              text: `El propietario "${propietario.nombrePropietario}" ha sido eliminado.`,
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el propietario.', 'error');
          }
        });
      }
    });
  }

  irAForm(propietario?: Propietario): void {
    if (propietario) {
      this.router.navigate(['/PropietarioForm', propietario.idPropietario]);
    } else {
      this.router.navigate(['/PropietarioForm']);
    }
  }
}
