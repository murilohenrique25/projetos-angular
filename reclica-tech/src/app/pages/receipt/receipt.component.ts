import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { PurchaseItem } from '../../models/purchase-item.model';
import { CompanyData } from '../../models/company-data.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavigationComponent
  ],
  template: `
    <app-navigation></app-navigation>
    <div class="receipt-container">
      <div class="receipt-header">
        <h2>Recibo de Compra - Recicláveis</h2>
        <button mat-icon-button color="primary" (click)="printReceipt()" class="print-button">
          <mat-icon>print</mat-icon>
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!isLoading" class="receipt-content">
        <!-- Company Data -->
        <mat-card class="company-card">
          <mat-card-content>
            <h3>{{ companyData.name || 'Empresa XYZ' }}</h3>
            <p>CNPJ: {{ companyData.cnpj || '00.000.000/0000-00' }}</p>
            <p>{{ companyData.address || 'Endereço não informado' }}</p>
            <p>Telefone: {{ companyData.phone || '(00) 0000-0000' }}</p>
          </mat-card-content>
        </mat-card>

        <!-- Supplier and Buyer Info -->
        <form [formGroup]="receiptForm" class="receipt-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>CPF/CNPJ do Fornecedor</mat-label>
            <input matInput formControlName="cpf" placeholder="000.000.000-00 ou 00.000.000/0000-00">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome do Comprador</mat-label>
            <input matInput formControlName="seller">
          </mat-form-field>
        </form>

        <!-- Items List -->
        <div class="items-section">
          <h3>Materiais Recicláveis Comprados:</h3>

          <mat-card class="items-card">
            <div class="items-header">
              <div class="item-col">Item</div>
              <div class="qty-col">Qtd</div>
              <div class="price-col">Valor Unit.</div>
              <div class="total-col">Total</div>
            </div>

            <div class="items-list">
              <div *ngFor="let item of items" class="item-row">
                <div class="item-col">{{ item.recyclableMaterial }}</div>
                <div class="qty-col">{{ item.quantity | number:'1.2-2' }} {{ item.unit }}</div>
                <div class="price-col">R$ {{ item.unitValue | number:'1.2-2' }}</div>
                <div class="total-col">R$ {{ item.totalValue | number:'1.2-2' }}</div>
              </div>
            </div>

            <div class="items-total">
              <strong>TOTAL GERAL: R$ {{ total | number:'1.2-2' }}</strong>
            </div>
          </mat-card>
        </div>

        <!-- Date and Time -->
        <div class="datetime-info">
          <p>Data: {{ currentDate | date:'dd/MM/yyyy' }}</p>
          <p>Hora: {{ currentDate | date:'HH:mm' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .receipt-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .print-button {
      transform: scale(1.2);
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
    .company-card {
      margin-bottom: 20px;
      background-color: #f5f5f5;
    }
    .company-card h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .company-card p {
      margin: 4px 0;
    }
    .receipt-form {
      margin-bottom: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    .items-section h3 {
      margin-bottom: 16px;
    }
    .items-card {
      padding: 0;
      overflow: hidden;
    }
    .items-header {
      display: flex;
      background-color: #f5f5f5;
      padding: 12px;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
    }
    .items-list {
      max-height: 300px;
      overflow-y: auto;
    }
    .item-row {
      display: flex;
      padding: 8px 12px;
      border-bottom: 1px solid #eee;
      font-size: 12px;
    }
    .item-row:last-child {
      border-bottom: none;
    }
    .item-col {
      flex: 3;
      padding-right: 8px;
    }
    .qty-col, .price-col, .total-col {
      flex: 2;
      text-align: right;
      padding-right: 8px;
    }
    .items-total {
      padding: 12px;
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      text-align: right;
      font-size: 16px;
    }
    .datetime-info {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
    .datetime-info p {
      margin: 2px 0;
    }
    @media print {
      .receipt-header button {
        display: none;
      }
      app-navigation {
        display: none;
      }
    }
  `]
})
export class ReceiptComponent implements OnInit {
  receiptForm: FormGroup;
  items: PurchaseItem[] = [];
  total = 0;
  companyData: CompanyData = {
    name: '',
    cnpj: '',
    address: '',
    phone: ''
  };
  currentDate = new Date();
  isLoading = true;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.receiptForm = this.formBuilder.group({
      cpf: ['', Validators.required],
      seller: ['', Validators.required]
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) {
      this.items = state['items'] || [];
      this.total = state['total'] || 0;
    }
  }

  ngOnInit(): void {
    this.loadCompanyData();
  }

  async loadCompanyData(): Promise<void> {
    try {
      const data = await this.apiService.getCompanyData().toPromise();
      if (data) {
        this.companyData = data;
      }
    } catch (error) {
      this.snackBar.open(`Erro ao carregar dados da empresa: ${error}`, 'Fechar', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }

  printReceipt(): void {
    window.print();
    this.snackBar.open('Recibo gerado com sucesso!', 'Fechar', {
      duration: 3000
    });
    this.router.navigate(['/dashboard']);
  }
}
