import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center">
      <svg [class]="sizeClass()" class="animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  `,
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  sizeClass(): string {
    const map: Record<string, string> = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return map[this.size] || map['md'];
  }
}
