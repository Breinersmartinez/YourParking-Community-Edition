import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
        @if (description) {
          <p class="mt-1 text-sm text-neutral-400">{{ description }}</p>
        }
      </div>
      @if (actions) {
        <div class="flex flex-wrap items-center gap-2">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  actions = true;
}
