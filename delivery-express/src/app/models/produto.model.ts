export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  promocao: boolean;
  precoPromocao?: number;
  categoriaId: number;
  categoria?: string;
  imagem?: string;
  ativo: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export interface Categoria {
  id?: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  ordem: number;
}