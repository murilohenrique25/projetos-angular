import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DataService } from '../../services/data.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  displayedColumns: string[] = ['nome', 'preco', 'status', 'acoes'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.dataService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
    });
  }

  openProdutoDialog(produto?: Produto): void {
    // Implementation for dialog would go here
    this.snackBar.open('Funcionalidade de edição seria implementada aqui', 'Fechar', { duration: 3000 });
  }

  editProduto(produto: Produto): void {
    this.openProdutoDialog(produto);
  }

  deleteProduto(id?: number): void {
    if (id && confirm('Tem certeza que deseja excluir este produto?')) {
      this.dataService.deleteProduto(id).subscribe(() => {
        this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadProdutos();
      });
    }
  }
}
