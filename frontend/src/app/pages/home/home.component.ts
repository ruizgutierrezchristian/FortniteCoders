// src/app/pages/home/home.component.ts

import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideojuegoService } from '../../core/services/videojuego.service';
import { DesarrolladoraService } from '../../core/services/desarrolladora.service';
import { Videojuego } from '../../core/models/videojuego.model';
import { Desarrolladora } from '../../core/models/desarrolladora.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <!-- Hero -->
      <div class="hero">
        <h1>GAME<br>VAULT</h1>
        <p>Tu biblioteca personal de videojuegos. Gestiona títulos, desarrolladoras, géneros y puntuaciones.</p>
        <div class="stats-row">
          <div class="stat-card">
            <div class="num">{{ totalGames() }}</div>
            <div class="lbl">Videojuegos</div>
          </div>
          <div class="stat-card">
            <div class="num">{{ totalDevs() }}</div>
            <div class="lbl">Desarrolladoras</div>
          </div>
          <div class="stat-card">
            <div class="num">{{ avgScore() }}</div>
            <div class="lbl">Nota media</div>
          </div>
          <div class="stat-card">
            <div class="num">{{ totalGenres() }}</div>
            <div class="lbl">Géneros</div>
          </div>
        </div>
      </div>

      <!-- Top Games -->
      <div class="section-header">
        <div class="section-title">Mejor puntuados</div>
        <a class="btn btn-secondary" routerLink="/videojuegos">Ver todos →</a>
      </div>

      @if (loading()) {
        <div class="games-grid">
          <div class="loading"><div class="spinner"></div>Cargando...</div>
        </div>
      } @else if (error()) {
        <div class="games-grid">
          <div class="empty">
            <div class="icon">⚠️</div>
            <h3>Error de conexión</h3>
            <p>{{ error() }}</p>
          </div>
        </div>
      } @else {
        <div class="games-grid">
          @for (g of topGames(); track g.id) {
            <div class="game-card">
              <span class="game-genre">{{ g.genero || 'Sin género' }}</span>
              <div class="game-title">{{ g.titulo }}</div>
              <div class="game-dev">↗ {{ g.desarrolladoraNombre || '–' }}</div>
              <div class="game-desc">{{ g.descripcion || 'Sin descripción.' }}</div>
              <div class="platforms">
                @for (p of splitPlatforms(g.plataformas); track p) {
                  <span class="platform-tag">{{ p }}</span>
                }
              </div>
              <div class="game-meta">
                <span class="game-year">{{ g.anioLanzamiento || '–' }}</span>
                @if (g.puntuacion != null) {
                  <span class="score"><span class="star">★</span>{{ g.puntuacion.toFixed(1) }}</span>
                }
              </div>
            </div>
          } @empty {
            <div class="empty">
              <div class="icon">🎮</div>
              <h3>No hay juegos todavía</h3>
            </div>
          }
        </div>
      }
    </main>
  `
})
export class HomeComponent implements OnInit {

  private gameSvc = inject(VideojuegoService);
  private devSvc  = inject(DesarrolladoraService);

  // Signals para el estado
  games   = signal<Videojuego[]>([]);
  devs    = signal<Desarrolladora[]>([]);
  loading = signal(true);
  error   = signal<string | null>(null);

  // Computed signals derivados
  topGames    = computed(() => [...this.games()].sort((a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0)).slice(0, 6));
  totalGames  = computed(() => this.games().length);
  totalDevs   = computed(() => this.devs().length);
  totalGenres = computed(() => new Set(this.games().map(g => g.genero).filter(Boolean)).size);
  avgScore    = computed(() => {
    const scored = this.games().filter(g => g.puntuacion != null);
    if (!scored.length) return '–';
    const avg = scored.reduce((s, g) => s + (g.puntuacion ?? 0), 0) / scored.length;
    return avg.toFixed(1);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      games: this.gameSvc.getAll(),
      devs:  this.devSvc.getAll()
    }).subscribe({
      next: ({ games, devs }) => {
        this.games.set(games);
        this.devs.set(devs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'No se puede conectar con el backend. ¿Está Spring Boot corriendo?');
        this.loading.set(false);
      }
    });
  }

  splitPlatforms(platforms?: string | null): string[] {
    if (!platforms) return [];
    return platforms.split(',').map(p => p.trim()).filter(Boolean);
  }
}
