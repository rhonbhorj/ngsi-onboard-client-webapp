import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboard', pathMatch: 'full' },
  {
    path: 'onboard',
    loadComponent: () =>
      import('./features/form/merchant-form.component').then((m) => m.MerchantOnboardingComponent),
  },
];
