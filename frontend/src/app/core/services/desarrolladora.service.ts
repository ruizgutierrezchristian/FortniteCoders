// src/app/core/services/desarrolladora.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Desarrolladora } from '../models/desarrolladora.model';

@Injectable({ providedIn: 'root' })
export class DesarrolladoraService {

  private readonly apiUrl = 'http://localhost:8080/api/desarrolladoras';

  constructor(private http: HttpClient) {}

  /** GET /api/desarrolladoras */
  getAll(): Observable<Desarrolladora[]> {
    return this.http.get<Desarrolladora[]>(this.apiUrl);
  }

  /** GET /api/desarrolladoras/:id */
  getById(id: number): Observable<Desarrolladora> {
    return this.http.get<Desarrolladora>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/desarrolladoras */
  create(desarrolladora: Partial<Desarrolladora>): Observable<Desarrolladora> {
    return this.http.post<Desarrolladora>(this.apiUrl, desarrolladora);
  }

  /** PUT /api/desarrolladoras/:id */
  update(id: number, desarrolladora: Partial<Desarrolladora>): Observable<Desarrolladora> {
    return this.http.put<Desarrolladora>(`${this.apiUrl}/${id}`, desarrolladora);
  }

  /** DELETE /api/desarrolladoras/:id */
  delete(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
