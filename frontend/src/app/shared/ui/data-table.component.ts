import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from './empty-state.component';
import { SpinnerComponent } from './spinner.component';

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  /** TemplateRef contextualizado con { row } para renderizar celdas personalizadas. */
  bodyTemplate?: TemplateRef<{ $implicit: any; row: any }>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: `
    <div class="card">
      @if (searchKeys.length > 0) {
        <div class="border-b border-neutral-800 px-5 py-4">
          <input class="input max-w-sm" [placeholder]="placeholder" [(ngModel)]="query" (ngModelChange)="applyFilter()" />
        </div>
      }
      @if (loading) {
        <div class="flex justify-center py-12"><app-spinner></app-spinner></div>
      } @else if (filtered.length === 0) {
        <app-empty-state [message]="emptyMessage"></app-empty-state>
      } @else {
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                @for (col of columns; track col.key) {
                  <th [class]="col.className">{{ col.label }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of filtered; track trackByFn($index, row)) {
                <tr>
                  @for (col of columns; track col.key) {
                    <td [class]="col.className">
                      @if (col.bodyTemplate) {
                        <ng-container *ngTemplateOutlet="col.bodyTemplate; context: { $implicit: row, row: row }"></ng-container>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  imports: [CommonModule, FormsModule, NgTemplateOutlet, EmptyStateComponent, SpinnerComponent],
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() searchKeys: string[] = [];
  @Input() placeholder = 'Buscar...';
  @Input() loading = false;
  @Input() emptyMessage = 'Sin datos para mostrar';

  query = '';
  filtered: any[] = [];

  ngOnInit(): void {
    this.applyFilter();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.query ? this.query.toLowerCase() : '';
    if (!q) {
      this.filtered = [...this.rows];
      return;
    }
    this.filtered = this.rows.filter((row) =>
      (this.searchKeys || []).some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }

  trackByFn(_index: number, row: any): any {
    return row?._key ?? row?.id ?? _index;
  }
}
