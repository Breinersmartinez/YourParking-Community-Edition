import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { PricingComponent } from './pricing/pricing.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <div class="mx-auto max-w-7xl px-6 pt-20">
      <app-hero></app-hero>
      <app-features></app-features>
      <app-workflow></app-workflow>
      <app-pricing></app-pricing>
      <app-testimonials></app-testimonials>
    </div>
    <app-footer></app-footer>
  `,
  imports: [
    RouterModule,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    WorkflowComponent,
    PricingComponent,
    TestimonialsComponent,
    FooterComponent,
  ],
})
export class LandingComponent {}
