// src/app/core/models/desarrolladora.model.ts

export interface Desarrolladora {
  id?: number;
  nombre: string;
  pais?: string | null;
  anioFundacion?: number | null;
  descripcion?: string | null;
  videojuegos?: { id: number; titulo: string }[];
}
