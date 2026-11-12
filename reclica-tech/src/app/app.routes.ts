import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

// Auth Guard Function
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'shopping',
    loadComponent: () => import('./pages/shopping/shopping.component').then(c => c.ShoppingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'units',
    loadComponent: () => import('./pages/units/units.component').then(c => c.UnitsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'expenses',
    loadComponent: () => import('./pages/expenses/expenses.component').then(c => c.ExpensesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'receipt',
    loadComponent: () => import('./pages/receipt/receipt.component').then(c => c.ReceiptComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
