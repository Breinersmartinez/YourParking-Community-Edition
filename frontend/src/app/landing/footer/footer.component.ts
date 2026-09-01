import { Component } from '@angular/core';
import { resourcesLinks, platformLinks, communityLinks } from '../../shared/constants/landing-data';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-20 border-t border-neutral-800 bg-ink-900/60 py-12">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-8 flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-primary-500"></span>
          <span class="text-lg font-bold text-white">
            Your<em class="not-italic text-primary-500">Parking</em>
          </span>
        </div>
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-3">
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Recursos</h3>
            <ul class="space-y-2">
              @for (link of resourcesLinks; track link.text) {
                <li>
                  <a [href]="link.href" class="text-neutral-400 transition-colors hover:text-primary-400">{{ link.text }}</a>
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Plataforma</h3>
            <ul class="space-y-2">
              @for (link of platformLinks; track link.text) {
                <li>
                  <a [href]="link.href" class="text-neutral-400 transition-colors hover:text-primary-400">{{ link.text }}</a>
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Comunidad</h3>
            <ul class="space-y-2">
              @for (link of communityLinks; track link.text) {
                <li>
                  <a [href]="link.href" class="text-neutral-400 transition-colors hover:text-primary-400">{{ link.text }}</a>
                </li>
              }
            </ul>
          </div>
        </div>
        <div class="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          © {{ currentYear }} YourParking · Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  resourcesLinks = resourcesLinks;
  platformLinks = platformLinks;
  communityLinks = communityLinks;
}
