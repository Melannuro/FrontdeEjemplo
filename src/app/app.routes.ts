import { Routes } from '@angular/router';
import { ListaCategoria } from '../components/features/categorias/lista-categoria/lista-categoria';
import { CategoriaForm } from '../components/features/categorias/categoria-form/categoria-form';
import { Home } from '../components/shared/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'ListaCategoria', component: ListaCategoria },
  { path: 'CategoriaForm', component: CategoriaForm },
  { path: 'CategoriaForm/:id', component: CategoriaForm }
];
