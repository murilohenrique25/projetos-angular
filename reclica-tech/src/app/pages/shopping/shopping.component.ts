import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { PurchaseItem } from '../../models/purchase-item.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NavigationComponent } from "../navigation/navigation.component";
import { Unit } from '../../models/unit.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-shopping',
  standalone: true,
  templateUrl: './shopping.component.html', // pode deixar inline se quiser
  styleUrls: ['./shopping.component.scss'],
  imports: [
    CommonModule,
    DatePipe,
    NavigationComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class ShoppingComponent implements OnInit {
  purchaseForm: FormGroup;
  materials: string[] = [];
  units: Unit[] = [];
  purchaseItems: PurchaseItem[] = [];
  currentDateTime = new Date();
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.purchaseForm = this.formBuilder.group({
      selectedMaterial: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      unitValue: ['', [Validators.required, Validators.min(0.01)]],
      selectedUnit: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
    this.loadUnits();
    this.updateCurrentDateTime();
    setInterval(() => this.updateCurrentDateTime(), 60000); // Update every minute
  }

  private updateCurrentDateTime(): void {
    this.currentDateTime = new Date();
  }

  async loadMaterials(): Promise<void> {
    try {
      const data = await this.apiService.getMaterials().toPromise();
      if (data) {
        this.materials = data.map(item => item.name);
      }
    } catch (error) {
      this.snackBar.open(`Erro ao carregar materiais recicláveis: ${error}`, 'Fechar', {
        duration: 3000
      });
    }
  }

  async loadUnits(): Promise<void> {
    try {
      const data = await this.apiService.getUnits().toPromise();
      if (data) {
        this.units = data;
      }
    } catch (error) {
      this.snackBar.open(`Erro ao carregar unidades: ${error}`, 'Fechar', {
        duration: 3000
      });
    }
  }

  addItem(): void {
    if (this.purchaseForm.valid) {
      const formValue = this.purchaseForm.value;
      const totalValue = formValue.quantity * formValue.unitValue;

      const item: PurchaseItem = {
        recyclableMaterial: formValue.selectedMaterial,
        quantity: formValue.quantity,
        unitValue: formValue.unitValue,
        totalValue: totalValue,
        unit: formValue.selectedUnit
      };

      this.purchaseItems.push(item);
      this.purchaseForm.reset();
    } else {
      this.snackBar.open('Preencha todos os campos', 'Fechar', {
        duration: 3000
      });
    }
  }

  removeItem(index: number): void {
    this.purchaseItems.splice(index, 1);
  }

  getTotalPurchaseValue(): number {
    return this.purchaseItems.reduce((sum, item) => sum + item.totalValue, 0);
  }

  async finalizePurchase(): Promise<void> {
    if (this.purchaseItems.length === 0) {
      this.snackBar.open('Adicione pelo menos um item', 'Fechar', {
        duration: 3000
      });
      return;
    }

    try {
      this.isLoading = true;
      const purchase = {
        items: this.purchaseItems,
        totalValue: this.getTotalPurchaseValue(),
        date: new Date().toISOString()
      };

      await this.apiService.savePurchase(purchase).toPromise();

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Compra de Recicláveis Finalizada',
          message: 'Deseja emitir recibo para o fornecedor?'
        }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (result) {
        this.router.navigate(['/receipt'], {
          state: {
            items: this.purchaseItems,
            total: this.getTotalPurchaseValue()
          }
        });
      } else {
        this.purchaseItems = [];
        this.snackBar.open('Compra salva com sucesso!', 'Fechar', {
          duration: 3000
        });
      }
    } catch (error) {
      this.snackBar.open(`Erro ao finalizar compra: ${error}`, 'Fechar', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }
}
