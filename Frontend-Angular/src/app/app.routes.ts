import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', title: 'Angular Lab · Roadmap', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'signals', title: 'Angular Lab · Señales', loadComponent: () => import('./features/signals/signals').then(m => m.Signals) },
  { path: 'templates', title: 'Angular Lab · Plantillas', loadComponent: () => import('./features/templates/templates').then(m => m.Templates) },
  { path: 'forms', title: 'Angular Lab · Formularios', loadComponent: () => import('./features/forms/forms').then(m => m.Forms) },
  { path: 'services', title: 'Angular Lab · Servicios', loadComponent: () => import('./features/services/services').then(m => m.Services) },
  { path: '**', redirectTo: '' },
];
