// src/app/shared/components/modal-developer/modal-developer.component.ts

import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DesarrolladoraService } from '../../../core/services/desarrolladora.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-modal-developer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">{{ editId() ? 'Editar Desarrolladora' : 'Nueva Desarrolladora' }}</span>
          <button class="modal-close" type="button" (click)="close.emit()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">

            <div class="field form-full">
              <label>Nombre *</label>
              <input formControlName="nombre" type="text" placeholder="Ej: Nintendo"
                [class.invalid]="isInvalid('nombre')">
              @if (isInvalid('nombre')) {
                <div class="error-msg">El nombre es obligatorio</div>
              }
            </div>

            <div class="field">
              <label>País</label>
              <input formControlName="pais" type="text" placeholder="Ej: Japón">
            </div>

            <div class="field">
              <label>Año fundación</label>
              <input formControlName="anioFundacion" type="number" placeholder="1985"
                [class.invalid]="isInvalid('anioFundacion')">
              @if (isInvalid('anioFundacion')) {
                <div class="error-msg">Año entre 1950 y 2030</div>
              }
            </div>

            <div class="field form-full">
              <label>Descripción</label>
              <textarea formControlName="descripcion" placeholder="Descripción de la desarrolladora..."></textarea>
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
export class ModalDeveloperComponent implements OnInit {

  editId = input<number | null>(null);
  saved  = output<void>();
  close  = output<void>();

  private fb     = inject(FormBuilder);
  private devSvc = inject(DesarrolladoraService);
  private toast  = inject(ToastService);

  // Signal de estado
  saving = signal(false);

  form = this.fb.group({
    nombre:        ['', Validators.required],
    pais:          [''],
    anioFundacion: [null as number | null, [Validators.min(1950), Validators.max(2030)]],
    descripcion:   ['']
  });

  ngOnInit(): void {
    const id = this.editId();
    if (id) {
      this.devSvc.getById(id).subscribe({
        next: (d) => {
          this.form.patchValue({
            nombre:        d.nombre,
            pais:          d.pais ?? '',
            anioFundacion: d.anioFundacion ?? null,
            descripcion:   d.descripcion ?? ''
          });
        },
        error: () => this.toast.error('No se pudo cargar la desarrolladora')
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
    const payload = {
      nombre:        v.nombre!,
      pais:          v.pais || null,
      anioFundacion: v.anioFundacion ?? null,
      descripcion:   v.descripcion || null
    };

    const id = this.editId();
    const obs = id
      ? this.devSvc.update(id, payload)
      : this.devSvc.create(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(id ? 'Desarrolladora actualizada' : 'Desarrolladora creada');
        this.saving.set(false);
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Error al guardar');
        this.saving.set(false);
      }
    });
  }
}
