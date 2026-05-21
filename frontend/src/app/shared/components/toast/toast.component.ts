// src/app/shared/components/toast/toast.component.ts

import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="toast-container">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast" [ngClass]="t.type">
          <span>{{ iconFor(t.type) }}</span>
          <span>{{ t.message }}</span>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  iconFor(type: string): string {
    if (type === 'success') return '✅';
    if (type === 'error')   return '❌';
    return 'ℹ️';
  }
}
