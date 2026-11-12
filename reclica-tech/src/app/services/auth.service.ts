import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  async login(username: string, password: string): Promise<void> {
    if (!username || !password) {
      this.showMessage('Usuário e senha são obrigatórios');
      return;
    }

    try {
      this.isLoadingSubject.next(true);
      //const result = await this.apiService.login(username, password).toPromise();

     // if (result?.success) {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/dashboard']);
        this.showMessage('Login realizado com sucesso!');
    //  } else {
    //    this.showMessage('Credenciais inválidas');
   //   }
    } catch (error) {
      this.showMessage(`Erro ao fazer login: ${error}`);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
