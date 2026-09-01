import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <svg class="mb-3 h-12 w-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.5a1.5 1.5 0 00-1.5 1.5v.5a1.5 1.5 0 01-3 0v-.5A1.5 1.5 0 0011 13H10a2 2 0 00-2 2 2 2 0 002 2h4a2 2 0 002-2 2 2 0 01-2-2"></path>
      </svg>
      <p class="text-sm text-neutral-500">{{ message }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() message = 'Sin datos para mostrar';
}
