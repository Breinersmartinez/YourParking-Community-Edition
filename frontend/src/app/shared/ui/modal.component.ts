import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="onClose.emit()"></div>
        <div class="relative w-full max-w-lg rounded-xl border border-neutral-700 bg-ink-900 shadow-cardHover">
          <div class="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            <button class="btn-ghost btn-sm" (click)="onClose.emit()">✕</button>
          </div>
          <div class="max-h-[70vh] overflow-y-auto px-5 py-4">
            <ng-content></ng-content>
          </div>
          @if (showFooter) {
            <div class="flex justify-end gap-2 border-t border-neutral-800 px-5 py-4">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() title = '';
  @Input() open = false;
  @Input() showFooter = false;
  @Output() onClose = new EventEmitter<void>();
}
