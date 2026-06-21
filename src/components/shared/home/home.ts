import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Opcional pero recomendado

@Component({
  selector: 'app-home',
  standalone: true, // <-- Asegúrate de que Home también lo tenga si no venía por defecto
  imports: [CommonModule], // <-- Aquí ya puedes importar tu Header Standalone
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
