import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metrics: any = {};
  recentOrders: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRecentOrders();
  }

  loadDashboardData(): void {
    this.dataService.getDashboardMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });
  }

  loadRecentOrders(): void {
    this.dataService.getPedidos().subscribe(pedidos => {
      this.recentOrders = pedidos.slice(-5).reverse();
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDENTE': 'Pendente',
      'CONFIRMADO': 'Confirmado',
      'PREPARANDO': 'Preparando',
      'PRONTO': 'Pronto',
      'ENTREGUE': 'Entregue',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
  }
}
