import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NavigationComponent
  ],
  template: `
    <app-navigation></app-navigation>
    <div class="expenses-container">
      <h2>Cadastro de Despesa</h2>

      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="expense-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da Despesa</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Gasolina, Aluguel...">
          <mat-error *ngIf="expenseForm.get('name')?.hasError('required')">
            Nome da despesa é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor Pago</mat-label>
          <input matInput type="number" formControlName="value" min="0" step="0.01">
          <span matPrefix>R$ </span>
          <mat-error *ngIf="expenseForm.get('value')?.hasError('required')">
            Valor é obrigatório
          </mat-error>
          <mat-error *ngIf="expenseForm.get('value')?.hasError('min')">
            Valor deve ser maior que zero
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit"
                [disabled]="expenseForm.invalid || isLoading" class="save-button">
          <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          <span *ngIf="!isLoading">Salvar</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .expenses-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    .expense-form {
      margin-bottom: 30px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .save-button {
      width: 100%;
      height: 48px;
    }
  `]
})
export class ExpensesComponent {
  expenseForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.expenseForm = this.formBuilder.group({
      name: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.expenseForm.valid) {
      try {
        this.isLoading = true;
        const expense: Expense = {
          ...this.expenseForm.value,
          date: new Date().toISOString()
        };
        await this.apiService.saveExpense(expense).toPromise();

        this.snackBar.open('Despesa salva com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.snackBar.open(`Erro ao salvar despesa: ${error}`, 'Fechar', {
          duration: 3000
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
