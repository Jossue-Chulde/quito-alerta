import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'incidencias',
        loadComponent: () => import('./pages/lista/lista.page').then(m => m.ListaPage)
      },
      {
        path: 'seguimiento',
        loadComponent: () => import('./pages/seguimiento/seguimiento.page').then(m => m.SeguimientoPage)
      },
      {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./pages/detalle/detalle.page').then(m => m.DetallePage)
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];