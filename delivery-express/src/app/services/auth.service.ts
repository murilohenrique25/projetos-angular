import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    if (isBrowser) {
      const token = localStorage.getItem('admin-token');
      const user = localStorage.getItem('admin-user');

      if (token && user) {
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (email === 'admin@deliveryexpress.com' && password === 'admin123') {
          const user = {
            id: 1,
            nome: 'Administrador',
            email: email,
            role: 'ADMIN'
          };

          // Save to localStorage
          localStorage.setItem('admin-token', 'mock-jwt-token');
          localStorage.setItem('admin-user', JSON.stringify(user));

          // Update observables
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(user);

          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');

    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}