export interface Pedido {
  id?: number;
  usuarioId: number;
  nomeCliente: string;
  telefoneCliente: string;
  itens: ItemPedido[];
  subtotal: number;
  taxaEntrega: number;
  cupomAplicado?: string;
  descontoCupom: number;
  total: number;
  status: StatusPedido;
  tipoEntrega: 'RETIRADA' | 'DELIVERY';
  endereco?: EnderecoEntrega;
  observacoes?: string;
  formaPagamento: string;
  dataHora: Date;
  dataConfirmacao?: Date;
  dataFinalizacao?: Date;
  tempoEstimado: number;
}

export interface ItemPedido {
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  precoOriginal: number;
  observacoes?: string;
  total: number;
}

export interface EnderecoEntrega {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  pontoReferencia?: string;
}

export type StatusPedido = 'PENDENTE' | 'CONFIRMADO' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';