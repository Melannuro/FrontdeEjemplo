import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calculadora } from './calculadora/calculadora';
import { Home } from '../components/shared/home/home';
import { Footer } from '../components/shared/footer/footer';
import { Header } from '../components/shared/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  titulo : String = "Veterinaria San José"
  protected readonly title = signal('VeterinariaApp');
}
