import { Routes } from '@angular/router';
import { ListaPropietario } from '../components/features/propietarios/lista-propietario/lista-propietario';
import { PropietarioForm } from '../components/features/propietarios/propietario-form/propietario-form';
import { Home } from '../components/shared/home/home';
import { ListaMascota } from '../components/features/mascotas/lista-mascota/lista-mascota';
import { MascotaForm } from '../components/features/mascotas/mascota-form/mascota-form';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  
  // Rutas de Propietarios (y compatibilidad con Categorías)
  { path: 'ListaCategoria', component: ListaPropietario },
  { path: 'ListaCategorias', component: ListaPropietario },
  { path: 'ListaPropietarios', component: ListaPropietario },
  { path: 'ListaPropietario', component: ListaPropietario },
  { path: 'CategoriaForm', component: PropietarioForm },
  { path: 'CategoriaForm/:id', component: PropietarioForm },
  { path: 'PropietarioForm', component: PropietarioForm },
  { path: 'PropietarioForm/:id', component: PropietarioForm },
  
  // Rutas de Mascotas (y compatibilidad con Productos)
  { path: 'ProductoForm', component: MascotaForm },
  { path: 'ProductoForm/:id', component: MascotaForm },
  { path: 'MascotaForm', component: MascotaForm },
  { path: 'MascotaForm/:id', component: MascotaForm },
  { path: 'ListaProductos', component: ListaMascota },
  { path: 'ListaProducto', component: ListaMascota },
  { path: 'ListaMascotas', component: ListaMascota },
  { path: 'ListaMascota', component: ListaMascota }
];
