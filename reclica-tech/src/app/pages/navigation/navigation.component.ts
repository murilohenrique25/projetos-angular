import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button *ngIf="!isDashboard()" (click)="retornar()">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span>Sistema de Reciclagem</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavigationComponent {
  constructor(private authService: AuthService, private router: Router,) { }

  logout(): void {
    this.authService.logout();
  }

  retornar(): void {
    this.router.navigate(['/dashboard']);
  }
  
   isDashboard(): boolean {
    return this.router.url === '/dashboard';
  }
}