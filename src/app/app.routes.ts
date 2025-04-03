import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'message/:id',
    loadComponent: () =>
      import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-edit-employee/add-edit-employee.component').then((m) => m.AddEditEmployeeComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

