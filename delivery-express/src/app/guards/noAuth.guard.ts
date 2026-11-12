import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(): boolean {
        if (!this.authService.isAuthenticated()) {
            return true; // acessa rota login se não autenticado
        }
        this.router.navigate(['/dashboard']); // redireciona se já autenticado
        return false;
    }
}