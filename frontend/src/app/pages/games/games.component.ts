// src/app/pages/games/games.component.ts

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { VideojuegoService } from '../../core/services/videojuego.service';
import { DesarrolladoraService } from '../../core/services/desarrolladora.service';
import { ToastService } from '../../core/services/toast.service';
import { Videojuego } from '../../core/models/videojuego.model';
import { Desarrolladora } from '../../core/models/desarrolladora.model';
import { ModalGameComponent } from '../../shared/components/modal-game/modal-game.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalGameComponent],
  template: `
    <main>
      <div class="section-header">
        <div class="section-title">Videojuegos</div>
        <button class="btn btn-primary" (click)="openModal(null)">＋ Añadir juego</button>
      </div>

      <!-- Toolbar de filtros (Formulario Reactivo) -->
      <form class="toolbar" [formGroup]="filterForm">
        <div class="search-wrap">
          <span class="icon">🔍</span>
          <input formControlName="q" type="text" placeholder="Buscar título o género...">
        </div>
        <select formControlName="genero">
          <option value="">Todos los géneros</option>
          @for (g of generos(); track g) {
            <option [value]="g">{{ g }}</option>
          }
        </select>
        <select formControlName="devId">
          <option value="">Todas las desarrolladoras</option>
          @for (d of devs(); track d.id) {
            <option [value]="d.id">{{ d.nombre }}</option>
          }
        </select>
        <select formControlName="sort">
          <option value="puntuacion">Mayor puntuación</option>
          <option value="anio">Año (reciente)</option>
          <option value="titulo">Título A-Z</option>
        </select>
      </form>

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
          @for (g of filteredGames(); track g.id) {
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
              <div class="card-actions">
                <button class="btn btn-secondary btn-sm" (click)="openModal(g.id!)">✏️ Editar</button>
                <button class="btn btn-danger btn-sm"    (click)="deleteGame(g.id!)">🗑 Eliminar</button>
              </div>
            </div>
          } @empty {
            <div class="empty">
              <div class="icon">🎮</div>
              <h3>No se encontraron videojuegos</h3>
              <p>Prueba con otros filtros o añade nuevos registros.</p>
            </div>
          }
        </div>
      }
    </main>

    <!-- Modal -->
    @if (showModal()) {
      <app-modal-game
        [editId]="editId()"
        [devs]="devs()"
        (saved)="onSaved()"
        (close)="closeModal()"
      />
    }
  `
})
export class GamesComponent implements OnInit {

  private gameSvc = inject(VideojuegoService);
  private devSvc  = inject(DesarrolladoraService);
  private toast   = inject(ToastService);
  private fb      = inject(FormBuilder);

  // Signals
  games     = signal<Videojuego[]>([]);
  devs      = signal<Desarrolladora[]>([]);
  generos   = signal<string[]>([]);
  loading   = signal(true);
  error     = signal<string | null>(null);
  showModal = signal(false);
  editId    = signal<number | null>(null);

  // Formulario reactivo para filtros
  filterForm = this.fb.group({
    q:      [''],
    genero: [''],
    devId:  [''],
    sort:   ['puntuacion']
  });

  // Computed: juegos filtrados y ordenados
  filteredGames = computed(() => {
    const v      = this.filterForm.value;
    const q      = (v.q ?? '').toLowerCase();
    const genero = v.genero ?? '';
    const devId  = v.devId ?? '';
    const sort   = v.sort ?? 'puntuacion';

    let list = this.games().filter(g => {
      const matchQ   = !q      || g.titulo.toLowerCase().includes(q) || (g.genero ?? '').toLowerCase().includes(q);
      const matchG   = !genero || g.genero === genero;
      const matchDev = !devId  || String(g.desarrolladoraId) === devId;
      return matchQ && matchG && matchDev;
    });

    if (sort === 'puntuacion') list = [...list].sort((a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0));
    else if (sort === 'anio') list = [...list].sort((a, b) => (b.anioLanzamiento ?? 0) - (a.anioLanzamiento ?? 0));
    else list = [...list].sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''));

    return list;
  });

  ngOnInit(): void {
    // Escuchar cambios en el formulario para re-computar (Signal reactivo)
    this.filterForm.valueChanges.subscribe(() => {
      // El computed signal se recalcula automáticamente cuando cambian los signals
      // Solo necesitamos que el template se actualice
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      games:   this.gameSvc.getAll(),
      devs:    this.devSvc.getAll(),
      generos: this.gameSvc.getGeneros()
    }).subscribe({
      next: ({ games, devs, generos }) => {
        this.games.set(games);
        this.devs.set(devs);
        this.generos.set(generos);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Error al cargar los datos');
        this.loading.set(false);
      }
    });
  }

  openModal(id: number | null): void {
    this.editId.set(id);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editId.set(null);
  }

  onSaved(): void {
    this.load();
  }

  deleteGame(id: number): void {
    if (!confirm('¿Eliminar este videojuego? Esta acción no se puede deshacer.')) return;
    this.gameSvc.delete(id).subscribe({
      next: () => {
        this.toast.success('Juego eliminado');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.error ?? 'Error al eliminar')
    });
  }

  splitPlatforms(platforms?: string | null): string[] {
    if (!platforms) return [];
    return platforms.split(',').map(p => p.trim()).filter(Boolean);
  }
}
