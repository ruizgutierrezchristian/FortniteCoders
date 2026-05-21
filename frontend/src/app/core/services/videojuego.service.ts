// src/app/core/services/videojuego.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego.model';

@Injectable({ providedIn: 'root' })
export class VideojuegoService {

  private readonly apiUrl = 'http://localhost:8080/api/videojuegos';

  constructor(private http: HttpClient) {}

  /** GET /api/videojuegos */
  getAll(q?: string, genero?: string, desarrolladoraId?: number): Observable<Videojuego[]> {
    let params = new HttpParams();
    if (q)              params = params.set('q', q);
    if (genero)         params = params.set('genero', genero);
    if (desarrolladoraId) params = params.set('desarrolladora', desarrolladoraId);
    return this.http.get<Videojuego[]>(this.apiUrl, { params });
  }

  /** GET /api/videojuegos/:id */
  getById(id: number): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}/${id}`);
  }

  /** GET /api/videojuegos/generos */
  getGeneros(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/generos`);
  }

  /** POST /api/videojuegos */
  create(videojuego: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.apiUrl, videojuego);
  }

  /** PUT /api/videojuegos/:id */
  update(id: number, videojuego: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.apiUrl}/${id}`, videojuego);
  }

  /** DELETE /api/videojuegos/:id */
  delete(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
