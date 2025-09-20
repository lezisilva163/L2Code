export interface BoxSpec {
  id: string;
  altura: number;
  largura: number;
  comprimento: number;
}

export interface PackedBox {
  caixa_id: string;
  produtos: string[];
}