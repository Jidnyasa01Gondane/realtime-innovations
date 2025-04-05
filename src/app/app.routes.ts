import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-edit-employee/add-edit-employee.component').then((m) => m.AddEditEmployeeComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./add-edit-employee/add-edit-employee.component').then((m) => m.AddEditEmployeeComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

