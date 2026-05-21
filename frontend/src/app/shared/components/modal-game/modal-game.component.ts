// src/app/shared/components/modal-game/modal-game.component.ts

import {
  Component, inject, input, output, effect, signal, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators, AbstractControl
} from '@angular/forms';
import { Desarrolladora } from '../../../core/models/desarrolladora.model';
import { Videojuego } from '../../../core/models/videojuego.model';
import { VideojuegoService } from '../../../core/services/videojuego.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-modal-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">{{ editId() ? 'Editar Juego' : 'Nuevo Juego' }}</span>
          <button class="modal-close" type="button" (click)="close.emit()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">

            <div class="field form-full">
              <label>Título *</label>
              <input formControlName="titulo" type="text" placeholder="Ej: The Legend of Zelda"
                [class.invalid]="isInvalid('titulo')">
              @if (isInvalid('titulo')) {
                <div class="error-msg">El título es obligatorio</div>
              }
            </div>

            <div class="field">
              <label>Género</label>
              <input formControlName="genero" type="text" placeholder="Ej: RPG, Acción">
            </div>

            <div class="field">
              <label>Año lanzamiento</label>
              <input formControlName="anioLanzamiento" type="number" placeholder="2024"
                [class.invalid]="isInvalid('anioLanzamiento')">
              @if (isInvalid('anioLanzamiento')) {
                <div class="error-msg">Año entre 1970 y 2030</div>
              }
            </div>

            <div class="field">
              <label>Puntuación (0–10)</label>
              <input formControlName="puntuacion" type="number" placeholder="9.5" step="0.1"
                [class.invalid]="isInvalid('puntuacion')">
              @if (isInvalid('puntuacion')) {
                <div class="error-msg">Puntuación entre 0 y 10</div>
              }
            </div>

            <div class="field">
              <label>Plataformas</label>
              <input formControlName="plataformas" type="text" placeholder="PC, PS5, Switch">
            </div>

            <div class="field">
              <label>Desarrolladora *</label>
              <select formControlName="desarrolladoraId" [class.invalid]="isInvalid('desarrolladoraId')">
                <option value="">Selecciona...</option>
                @for (d of devs(); track d.id) {
                  <option [value]="d.id">{{ d.nombre }}</option>
                }
              </select>
              @if (isInvalid('desarrolladoraId')) {
                <div class="error-msg">Selecciona una desarrolladora</div>
              }
            </div>

            <div class="field form-full">
              <label>Descripción</label>
              <textarea formControlName="descripcion" placeholder="Breve descripción..."></textarea>
            </div>

          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" type="button" (click)="close.emit()">Cancelar</button>
            <button class="btn btn-primary" type="submit" [disabled]="saving()">
              {{ saving() ? 'Guardando...' : '💾 Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ModalGameComponent implements OnInit {

  // Inputs/Outputs (Angular 17+ style)
  editId  = input<number | null>(null);
  devs    = input<Desarrolladora[]>([]);
  saved   = output<void>();
  close   = output<void>();

  private fb      = inject(FormBuilder);
  private gameSvc = inject(VideojuegoService);
  private toast   = inject(ToastService);

  // Signal para controlar estado de guardado
  saving = signal(false);

  form = this.fb.group({
    titulo:           ['', Validators.required],
    genero:           [''],
    anioLanzamiento:  [null as number | null, [Validators.min(1970), Validators.max(2030)]],
    puntuacion:       [null as number | null, [Validators.min(0), Validators.max(10)]],
    plataformas:      [''],
    descripcion:      [''],
    desarrolladoraId: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.editId();
    if (id) {
      this.gameSvc.getById(id).subscribe({
        next: (g: Videojuego) => {
          this.form.patchValue({
            titulo:           g.titulo,
            genero:           g.genero ?? '',
            anioLanzamiento:  g.anioLanzamiento ?? null,
            puntuacion:       g.puntuacion ?? null,
            plataformas:      g.plataformas ?? '',
            descripcion:      g.descripcion ?? '',
            desarrolladoraId: g.desarrolladoraId ? String(g.desarrolladoraId) : ''
          });
        },
        error: () => this.toast.error('No se pudo cargar el juego')
      });
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field) as AbstractControl;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    const v = this.form.value;
    const payload: Partial<Videojuego> = {
      titulo:           v.titulo!,
      genero:           v.genero || null,
      anioLanzamiento:  v.anioLanzamiento ?? null,
      puntuacion:       v.puntuacion ?? null,
      plataformas:      v.plataformas || null,
      descripcion:      v.descripcion || null,
      desarrolladoraId: v.desarrolladoraId ? Number(v.desarrolladoraId) : null
    };

    const id = this.editId();
    const obs = id
      ? this.gameSvc.update(id, payload)
      : this.gameSvc.create(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(id ? 'Juego actualizado' : 'Juego creado');
        this.saving.set(false);
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.toast.error(err?.error?.error ?? 'Error al guardar');
        this.saving.set(false);
      }
    });
  }
}
