import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardData } from '../../models/dashboard-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    NavigationComponent,
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData = {
    recycledMaterialsQuantity: 0,
    purchasesQuantity: 0,
    totalPurchasesValue: 0,
    totalExpensesValue: 0
  };
  currentDate = new Date();
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.isLoading = true;
      const data = await this.apiService.getDashboardData().toPromise();
      if (data) {
        this.dashboardData = data;
      }
    } catch (error) {
      this.snackBar.open(`Erro ao carregar dados: ${error}`, 'Fechar', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
