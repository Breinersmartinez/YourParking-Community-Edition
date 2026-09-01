import { Component, Input } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card flex items-center gap-4 p-5">
      <div [class]="toneClass()" class="flex h-12 w-12 items-center justify-center rounded-xl">
        <ng-content></ng-content>
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm text-neutral-400">{{ title }}</p>
        @if (loading) {
          <div class="mt-1"><app-spinner size="sm"></app-spinner></div>
        } @else {
          <p class="text-2xl font-bold text-white">{{ value ?? '—' }}</p>
        }
      </div>
    </div>
  `,
  imports: [SpinnerComponent],
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: unknown;
  @Input() tone: 'primary' | 'yellow' | 'green' | 'red' | 'blue' | 'gray' = 'primary';
  @Input() loading = false;

  toneClass(): string {
    const tones: Record<string, string> = {
      primary: 'bg-primary-500/10 text-primary-500',
      yellow: 'bg-accent-400/10 text-accent-300',
      green: 'bg-success-500/10 text-success-500',
      red: 'bg-danger-500/10 text-danger-500',
      blue: 'bg-blue-500/10 text-blue-400',
      gray: 'bg-neutral-700/20 text-neutral-300',
    };
    return tones[this.tone] || tones['primary'];
  }
}
