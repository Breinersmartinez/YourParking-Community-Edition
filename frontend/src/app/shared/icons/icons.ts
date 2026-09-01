import { Component, Input } from '@angular/core';

function baseAttrs(size: string) {
  return {
    class: size,
    'stroke-width': '1.8',
    stroke: 'currentColor',
    fill: 'none',
    'stroke-linecap': 'round' as const,
    'stroke-linejoin': 'round' as const,
  };
}

@Component({
  selector: 'app-icon-menu',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
})
export class MenuIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-x',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
})
export class XIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-check',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>`,
})
export class CheckIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-dashboard',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
})
export class DashboardIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-spaces',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="6" height="6" rx="1"/><rect x="11" y="14" width="10" height="6" rx="1"/></svg>`,
})
export class SpacesIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-levels',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M3 9h18M3 13h18"/><path d="M9 5v14M15 5v9M9 19h6"/></svg>`,
})
export class LevelsIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-tickets',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M9 5v14"/></svg>`,
})
export class TicketsIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-reservations',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
})
export class ReservationsIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-incidents',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3l9-16z"/><path d="M12 10v4M12 17h.01"/></svg>`,
})
export class IncidentsIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-vehicles',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14l1-7H4l1 7z"/><path d="M4 10l-1 4M21 10l1 4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
})
export class VehiclesIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-users',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0M16 11a3 3 0 010 6M14 20a5 5 0 013-4"/></svg>`,
})
export class UsersIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-rates',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.6 0-3 .8-3 2s1.4 2 3 2 3 .8 3 2-1.4 2-3 2c-1.5 0-2.5-.5-3-1.5"/></svg>`,
})
export class RatesIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-payments',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20M6 15h4"/></svg>`,
})
export class PaymentsIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-logout',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
})
export class LogoutIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-revenue',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.6 0-3 .8-3 2s1.4 2 3 2 3 .8 3 2-1.4 2-3 2c-1.5 0-2.5-.5-3-1.5"/></svg>`,
})
export class RevenueIconComponent {
  @Input() size = 'h-5 w-5';
}

@Component({
  selector: 'app-icon-feature',
  standalone: true,
  template: `<svg [attr.class]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ng-content></ng-content></svg>`,
})
export class FeatureIconComponent {
  @Input() size = 'h-5 w-5';
}
