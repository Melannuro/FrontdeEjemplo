import { CategoriaService } from './../../../../app/service/categoria-service';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../app/service/producto-service';
import { Producto } from '../../../../app/model/producto';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Categoria } from '../../../../app/model/categoria';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, NgClass],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  readonly title = 'Productos form';
  elProducto = signal(new Producto());

  // Input de señal que recibe el ID (si viene por parámetro de ruta)
  id = input<number>();
  private router = inject(Router);
  private service = inject(ProductoService);
  private CategoriaService = inject(CategoriaService);
  listaCategorias = signal<Categoria[]>([]);

  ngOnInit(): void {
    this.cargarProducto();
    this.cargarCategorias(); // <-- LLAMAMOS AL MÉTODO AL INICIAR EL COMPONENTE
  }

  // Método dedicado a obtener las categorías del Backend de forma limpia
  private cargarCategorias(): void {
    this.CategoriaService.mostrarCategorias().subscribe({
      next: (data) => this.listaCategorias.set(data),
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  private cargarProducto(): void {
    const elid = this.id();
    if (elid) {
      this.service.mostrarProducto(elid).subscribe({
        next: (elProductoLeido) => this.elProducto.set(elProductoLeido),
        error: (err) => console.error('Error al cargar el producto :', err)
      });
    }
  }

  // MÉTODO PÚBLICO PRINCIPAL: Se ejecuta al enviar el formulario
  guardar(form: NgForm): void {
    if (form.invalid) return;

    // Evaluamos inteligentemente el input() de señal para saber el modo
    if (this.id()) {
      this.actualizarProducto();
    } else {
      this.guardarProducto();
    }
  }

  // Mantenemos tus métodos privados de persistencia intactos
  private guardarProducto(): void {
    // 1. Clonamos el objeto actual de la señal usando el spread operator (...)
    // para no alterar directamente lo que el usuario ve en el formulario.
    const nuevoProducto = { ...this.elProducto() };

    // 2. Eliminamos o volvemos nulo el ID para que Spring Boot sepa que es una CREACIÓN
    delete nuevoProducto.idProducto;

    // 3. Enviamos el objeto modificado al servicio
    this.service.crearProducto(nuevoProducto).subscribe({
      next: (productoCreado) => {
        console.log('Producto creado:', productoCreado);
        this.router.navigate(['/ListaProducto']);
        Swal.fire({
          title: 'Producto creado',
          text: `El producto "${productoCreado.nombreProducto}" ha sido creado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al crear el producto:', err)
    });
  }

  private actualizarProducto(): void {
    this.service.actualizarProducto(this.elProducto()).subscribe({
      next: () => {
        this.router.navigate(['/ListaProducto']);
        Swal.fire({
          title: 'Producto actualizado',
          text: `El producto "${this.elProducto().nombreProducto}" ha sido actualizado exitosamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => console.error('Error al actualizar el producto:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/ListaProducto']);
  }

  compararCategoria(c1: Categoria, c2: Categoria): boolean {
    return c1 && c2 ? c1.idCategoria === c2.idCategoria : c1 === c2;
  }

}

