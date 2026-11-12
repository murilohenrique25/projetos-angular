export interface Cupom {
  id?: number;
  codigo: string;
  descricao: string;
  tipo: 'PERCENTUAL' | 'VALOR_FIXO';
  valor: number;
  dataInicio: string;
  dataFim: string;
  limitado: boolean;
  limiteUsos: number;
  usosRealizados: number;
  ativo: boolean;
  dataCriacao?: Date;
}