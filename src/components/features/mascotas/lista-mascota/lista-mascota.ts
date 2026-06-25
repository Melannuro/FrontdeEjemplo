import { Component, inject, OnInit, signal } from '@angular/core';
import { MascotaService } from '../../../../app/service/mascota-service';
import { Mascota } from '../../../../app/model/mascota';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-mascota',
  imports: [],
  templateUrl: './lista-mascota.html',
  styleUrl: './lista-mascota.css',
})
export class ListaMascota implements OnInit {
  readonly titulo: string = 'Listado de Mascotas';
  listaMascotas = signal<Mascota[]>([]);

  private service = inject(MascotaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarMascotas();
  }

  private cargarMascotas(): void {
    this.service.mostrarProductos().subscribe({
      next: lasMascotas => {
        this.listaMascotas.set(lasMascotas);
      },
      error: err => console.error('Error al cargar mascotas:', err)
    });
  }

  eliminar(mascota: Mascota): void {
    if (mascota.idMascota === undefined) {
      Swal.fire('Error', 'No se puede eliminar una mascota sin un ID válido.', 'error');
      return;
    }

    Swal.fire({
      title: `¿Estás seguro de eliminar a la mascota: ${mascota.nombreMascota}?`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminarProducto(mascota.idMascota!).subscribe({
          next: () => {
            this.cargarMascotas();
            Swal.fire({
              title: "¡Mascota eliminada!",
              text: `La mascota "${mascota.nombreMascota}" ha sido eliminada.`,
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la mascota.', 'error');
          }
        });
      }
    });
  }

  irAForm(mascota?: Mascota): void {
    if (mascota) {
      this.router.navigate(['/MascotaForm', mascota.idMascota]);
    } else {
      this.router.navigate(['/MascotaForm']);
    }
  }
}
