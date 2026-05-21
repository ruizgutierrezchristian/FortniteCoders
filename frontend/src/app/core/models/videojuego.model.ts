// src/app/core/models/videojuego.model.ts

export interface Videojuego {
  id?: number;
  titulo: string;
  genero?: string | null;
  anioLanzamiento?: number | null;
  puntuacion?: number | null;
  plataformas?: string | null;
  descripcion?: string | null;
  desarrolladoraId?: number | null;
  desarrolladoraNombre?: string | null;
}

export interface VideojuegoForm {
  titulo: string;
  genero: string;
  anioLanzamiento: number | null;
  puntuacion: number | null;
  plataformas: string;
  descripcion: string;
  desarrolladoraId: number | null;
}
