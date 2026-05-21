// src/app/pages/developers/developers.component.ts

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DesarrolladoraService } from '../../core/services/desarrolladora.service';
import { ToastService } from '../../core/services/toast.service';
import { Desarrolladora } from '../../core/models/desarrolladora.model';
import { ModalDeveloperComponent } from '../../shared/components/modal-developer/modal-developer.component';

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalDeveloperComponent],
  template: `
    <main>
      <div class="section-header">
        <div class="section-title">Desarrolladoras</div>
        <button class="btn btn-primary" (click)="openModal(null)">＋ Añadir desarrolladora</button>
      </div>

      <!-- Búsqueda (Formulario Reactivo) -->
      <form class="toolbar" [formGroup]="filterForm">
        <div class="search-wrap" style="flex:1">
          <span class="icon">🔍</span>
          <input formControlName="q" type="text" placeholder="Buscar desarrolladora o país...">
        </div>
      </form>

      @if (loading()) {
        <div class="devs-grid">
          <div class="loading"><div class="spinner"></div>Cargando...</div>
        </div>
      } @else if (error()) {
        <div class="devs-grid">
          <div class="empty">
            <div class="icon">⚠️</div>
            <h3>Error de conexión</h3>
            <p>{{ error() }}</p>
          </div>
        </div>
      } @else {
        <div class="devs-grid">
          @for (d of filteredDevs(); track d.id) {
            <div class="dev-card">
              <div class="dev-avatar">{{ initials(d.nombre) }}</div>
              <div class="dev-name">{{ d.nombre }}</div>
              <div class="dev-meta">
                @if (d.pais) {
                  <span class="dev-tag">🌍 {{ d.pais }}</span>
                }
                @if (d.anioFundacion) {
                  <span class="dev-tag">📅 {{ d.anioFundacion }}</span>
                }
              </div>
              <div class="dev-desc">{{ d.descripcion || 'Sin descripción.' }}</div>
              <div class="dev-games-count">
                🎮 {{ (d.videojuegos?.length ?? 0) }} videojuego{{ (d.videojuegos?.length ?? 0) !== 1 ? 's' : '' }}
              </div>
              @if (d.videojuegos && d.videojuegos.length > 0) {
                <div class="game-list-mini">
                  @for (v of d.videojuegos.slice(0, 3); track v.id) {
                    <div class="game-list-item">• {{ v.titulo }}</div>
                  }
                  @if (d.videojuegos.length > 3) {
                    <div style="padding: 3px 0; color: var(--muted2)">
                      + {{ d.videojuegos.length - 3 }} más...
                    </div>
                  }
                </div>
              }
              <div class="card-actions">
                <button class="btn btn-secondary btn-sm" (click)="openModal(d.id!)">✏️ Editar</button>
                <button class="btn btn-danger btn-sm"    (click)="deleteDev(d.id!)">🗑 Eliminar</button>
              </div>
            </div>
          } @empty {
            <div class="empty">
              <div class="icon">🏢</div>
              <h3>No se encontraron desarrolladoras</h3>
              <p>Prueba con otros filtros o añade nuevas.</p>
            </div>
          }
        </div>
      }
    </main>

    <!-- Modal -->
    @if (showModal()) {
      <app-modal-developer
        [editId]="editId()"
        (saved)="onSaved()"
        (close)="closeModal()"
      />
    }
  `
})
export class DevelopersComponent implements OnInit {

  private devSvc = inject(DesarrolladoraService);
  private toast  = inject(ToastService);
  private fb     = inject(FormBuilder);

  // Signals
  devs      = signal<Desarrolladora[]>([]);
  loading   = signal(true);
  error     = signal<string | null>(null);
  showModal = signal(false);
  editId    = signal<number | null>(null);

  // Formulario reactivo para búsqueda
  filterForm = this.fb.group({ q: [''] });

  // Computed: desarrolladoras filtradas
  filteredDevs = computed(() => {
    const q = (this.filterForm.value.q ?? '').toLowerCase();
    if (!q) return this.devs();
    return this.devs().filter(d =>
      d.nombre.toLowerCase().includes(q) || (d.pais ?? '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {});
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.devSvc.getAll().subscribe({
      next: (devs) => {
        this.devs.set(devs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Error al cargar las desarrolladoras');
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

  deleteDev(id: number): void {
    if (!confirm('¿Eliminar esta desarrolladora y todos sus videojuegos?')) return;
    this.devSvc.delete(id).subscribe({
      next: () => {
        this.toast.success('Desarrolladora eliminada');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Error al eliminar')
    });
  }

  initials(nombre: string): string {
    return nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
