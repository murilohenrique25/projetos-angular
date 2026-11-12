import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Produto, Categoria } from '../models/produto.model';
import { Cupom } from '../models/cupom.model';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private produtosSubject = new BehaviorSubject<Produto[]>([]);
  private cuponsSubject = new BehaviorSubject<Cupom[]>([]);
  private pedidosSubject = new BehaviorSubject<Pedido[]>([]);

  public produtos$ = this.produtosSubject.asObservable();
  public cupons$ = this.cuponsSubject.asObservable();
  public pedidos$ = this.pedidosSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Mock data
    const produtos: Produto[] = [
      { id: 1, nome: 'Pizza Margherita', descricao: 'Molho de tomate, mussarela, manjericão', preco: 32.90, promocao: true, precoPromocao: 24.90, categoriaId: 1, categoria: 'Pizzas', ativo: true },
      { id: 2, nome: 'Pizza Pepperoni', descricao: 'Molho de tomate, mussarela, pepperoni', preco: 36.90, promocao: false, categoriaId: 1, categoria: 'Pizzas', ativo: true },
      { id: 3, nome: 'X-Burger', descricao: 'Hambúrguer artesanal, queijo, alface, tomate', preco: 24.90, promocao: true, precoPromocao: 19.90, categoriaId: 2, categoria: 'Hambúrgueres', ativo: true },
      { id: 4, nome: 'X-Bacon', descricao: 'Hambúrguer, bacon, queijo, alface, tomate', preco: 28.90, promocao: false, categoriaId: 2, categoria: 'Hambúrgueres', ativo: true },
      { id: 5, nome: 'Coca-Cola 350ml', descricao: 'Refrigerante gelado', preco: 4.50, promocao: false, categoriaId: 3, categoria: 'Bebidas', ativo: true },
      { id: 6, nome: 'Suco de Laranja', descricao: 'Suco natural 300ml', preco: 6.90, promocao: true, precoPromocao: 5.90, categoriaId: 3, categoria: 'Bebidas', ativo: true }
    ];

    const cupons: Cupom[] = [
      { id: 1, codigo: 'PROMO10', descricao: '10% de desconto', tipo: 'PERCENTUAL', valor: 10, dataInicio: '2024-12-01', dataFim: '2024-12-31', limitado: true, limiteUsos: 100, usosRealizados: 23, ativo: true },
      { id: 2, codigo: 'DESCONTO5', descricao: 'R$ 5,00 de desconto', tipo: 'VALOR_FIXO', valor: 5.00, dataInicio: '2024-12-01', dataFim: '2024-12-25', limitado: false, limiteUsos: 0, usosRealizados: 45, ativo: true },
      { id: 3, codigo: 'PRIMEIRA', descricao: '20% primeira compra', tipo: 'PERCENTUAL', valor: 20, dataInicio: '2024-12-01', dataFim: '2024-12-31', limitado: true, limiteUsos: 50, usosRealizados: 12, ativo: true }
    ];

    const pedidos: Pedido[] = [
      {
        id: 1001,
        usuarioId: 1,
        nomeCliente: 'João Silva',
        telefoneCliente: '(11) 98765-4321',
        itens: [
          { produtoId: 1, nomeProduto: 'Pizza Margherita', quantidade: 1, precoUnitario: 24.90, precoOriginal: 32.90, observacoes: 'Sem oregano', total: 24.90 },
          { produtoId: 5, nomeProduto: 'Coca-Cola 350ml', quantidade: 2, precoUnitario: 4.50, precoOriginal: 4.50, total: 9.00 }
        ],
        subtotal: 33.90,
        taxaEntrega: 5.00,
        cupomAplicado: 'PROMO10',
        descontoCupom: 3.39,
        total: 35.51,
        status: 'PREPARANDO',
        tipoEntrega: 'DELIVERY',
        endereco: {
          logradouro: 'Rua das Palmeiras',
          numero: '456',
          complemento: 'Apto 45',
          bairro: 'Vila Nova',
          cidade: 'São Paulo',
          cep: '01234-567',
          pontoReferencia: 'Próximo ao mercado'
        },
        formaPagamento: 'PIX',
        dataHora: new Date('2024-12-13T14:30:00'),
        tempoEstimado: 35
      }
    ];

    this.produtosSubject.next(produtos);
    this.cuponsSubject.next(cupons);
    this.pedidosSubject.next(pedidos);
  }

  // Produtos
  getProdutos(): Observable<Produto[]> {
    return this.produtos$;
  }

  createProduto(produto: Produto): Observable<Produto> {
    const produtos = this.produtosSubject.value;
    const newProduto = { ...produto, id: Date.now(), dataCriacao: new Date() };
    produtos.push(newProduto);
    this.produtosSubject.next(produtos);
    return of(newProduto).pipe(delay(500));
  }

  updateProduto(produto: Produto): Observable<Produto> {
    const produtos = this.produtosSubject.value;
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index !== -1) {
      produtos[index] = { ...produto, dataAtualizacao: new Date() };
      this.produtosSubject.next(produtos);
    }
    return of(produto).pipe(delay(500));
  }

  deleteProduto(id: number): Observable<boolean> {
    const produtos = this.produtosSubject.value;
    const filteredProdutos = produtos.filter(p => p.id !== id);
    this.produtosSubject.next(filteredProdutos);
    return of(true).pipe(delay(500));
  }

  // Cupons
  getCupons(): Observable<Cupom[]> {
    return this.cupons$;
  }

  createCupom(cupom: Cupom): Observable<Cupom> {
    const cupons = this.cuponsSubject.value;
    const newCupom = { ...cupom, id: Date.now(), dataCriacao: new Date() };
    cupons.push(newCupom);
    this.cuponsSubject.next(cupons);
    return of(newCupom).pipe(delay(500));
  }

  updateCupom(cupom: Cupom): Observable<Cupom> {
    const cupons = this.cuponsSubject.value;
    const index = cupons.findIndex(c => c.id === cupom.id);
    if (index !== -1) {
      cupons[index] = cupom;
      this.cuponsSubject.next(cupons);
    }
    return of(cupom).pipe(delay(500));
  }

  deleteCupom(id: number): Observable<boolean> {
    const cupons = this.cuponsSubject.value;
    const filteredCupons = cupons.filter(c => c.id !== id);
    this.cuponsSubject.next(filteredCupons);
    return of(true).pipe(delay(500));
  }

  // Pedidos
  getPedidos(): Observable<Pedido[]> {
    return this.pedidos$;
  }

  updatePedidoStatus(pedidoId: number, novoStatus: any): Observable<Pedido> {
    const pedidos = this.pedidosSubject.value;
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = novoStatus;
      if (novoStatus === 'CONFIRMADO') {
        pedido.dataConfirmacao = new Date();
      } else if (novoStatus === 'ENTREGUE') {
        pedido.dataFinalizacao = new Date();
      }
      this.pedidosSubject.next([...pedidos]);
    }
    return of(pedido!).pipe(delay(300));
  }

  // Dashboard metrics
  getDashboardMetrics(): Observable<any> {
    const produtos = this.produtosSubject.value;
    const cupons = this.cuponsSubject.value;
    const pedidos = this.pedidosSubject.value;

    const metrics = {
      totalProdutos: produtos.length,
      produtosPromocao: produtos.filter(p => p.promocao).length,
      cuponsAtivos: cupons.filter(c => c.ativo).length,
      pedidosHoje: pedidos.length,
      vendasHoje: pedidos.reduce((sum, p) => sum + p.total, 0),
      ticketMedio: pedidos.length > 0 ? pedidos.reduce((sum, p) => sum + p.total, 0) / pedidos.length : 0
    };

    return of(metrics).pipe(delay(300));
  }
}