import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboard', pathMatch: 'full' },
  {
    path: 'onboard',
    loadChildren: () => import('./features/form/form.routes').then((m) => m.formRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];
