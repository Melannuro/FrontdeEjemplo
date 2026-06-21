import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http: HttpClient = inject(HttpClient);
  private readonly urlEndPoint: string = 'http://localhost:8085/api/v1/categorias/categoria';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  mostrarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlEndPoint);
  }

  mostrarCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.urlEndPoint}/${id}`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.urlEndPoint, categoria, { headers: this.httpHeaders });
  }

  eliminarCategoria(id: number): Observable<Categoria> {
    return this.http.delete<Categoria>(`${this.urlEndPoint}/${id}`);
  }

  actualizarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.urlEndPoint}/${categoria.idCategoria}`, categoria, { headers: this.httpHeaders });
  }
}


  /*
  // Definir la URL del endpoint (API en Spring Boot)
  private urlEndPoint: string = 'api/v1/categorias/categoria';

  // Configurar las cabeceras para indicar que se enviará/recibirá JSON
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Inyectar HttpClient usando el constructor clásico o la función inject()
  constructor(private http: HttpClient) { }

  // 1. Mostrar todas las categorías (GET)
  mostrarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlEndPoint).pipe(
      map(response => response as Categoria[])
    );
  }

  // 2. Leer una sola categoría por ID (GET)
  leerCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.urlEndPoint}/${id}`);
  }

  // 3. Crear una nueva categoría (POST)
  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.urlEndPoint, categoria, { headers: this.httpHeaders });
  }

  // 4. Eliminar una categoría (DELETE)
  eliminarCategoria(id: number): Observable<Categoria> {
    return this.http.delete<Categoria>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }

  // 5. Actualizar una categoría existente (PUT)
  actualizarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.urlEndPoint}/${categoria.idCategoria}`, categoria, { headers: this.httpHeaders });
  }
}*/
