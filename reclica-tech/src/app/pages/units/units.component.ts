import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Unit } from '../../models/unit.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NavigationComponent
  ],
  template: `
    <app-navigation></app-navigation>
    <div class="units-container">
      <h2>Cadastro de Unidade</h2>

      <form [formGroup]="unitForm" (ngSubmit)="onSubmit()" class="unit-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Unidade</mat-label>
          <input matInput formControlName="type" placeholder="Ex: KG, Litro, Unidade...">
          <mat-error *ngIf="unitForm.get('type')?.hasError('required')">
            Tipo de unidade é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor</mat-label>
          <input matInput type="number" formControlName="value" min="0" step="0.01">
          <span matPrefix>R$ </span>
          <mat-error *ngIf="unitForm.get('value')?.hasError('required')">
            Valor é obrigatório
          </mat-error>
          <mat-error *ngIf="unitForm.get('value')?.hasError('min')">
            Valor deve ser maior que zero
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit"
                [disabled]="unitForm.invalid || isLoading" class="save-button">
          <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          <span *ngIf="!isLoading">Salvar</span>
        </button>
      </form>

      <mat-card class="info-card">
        <mat-card-header>
          <mat-card-title>Exemplos de Unidades</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Kg, Tonelada, Fardo, Saco, Litro, Metro, Unidade</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .units-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    .unit-form {
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
    .info-card {
      background-color: #f5f5f5;
    }
  `]
})
export class UnitsComponent {
  unitForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.unitForm = this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.unitForm.valid) {
      try {
        this.isLoading = true;
        const unit: Unit = this.unitForm.value;
        await this.apiService.saveUnit(unit).toPromise();

        this.snackBar.open('Unidade salva com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.snackBar.open(`Erro ao salvar unidade: ${error}`, 'Fechar', {
          duration: 3000
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}