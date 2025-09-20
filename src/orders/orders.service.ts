import { Injectable } from '@nestjs/common';
import { BoxSpec, PackedBox } from './interfaces/box.interface';

@Injectable()
export class OrdersService {
  private boxes: BoxSpec[] = [
    { id: 'Caixa 1', altura: 30, largura: 40, comprimento: 80 },
    { id: 'Caixa 2', altura: 50, largura: 50, comprimento: 40 },
    { id: 'Caixa 3', altura: 50, largura: 80, comprimento: 60 },
  ];

  private rotations(dim: { altura: number; largura: number; comprimento: number }) {
    const { altura: h, largura: w, comprimento: l } = dim;
    return [
      [h, w, l], [h, l, w], [w, h, l], [w, l, h], [l, h, w], [l, w, h],
    ];
  }

  private volume(dim: { altura: number; largura: number; comprimento: number }) {
    return dim.altura * dim.largura * dim.comprimento;
  }

  private fitsInBox(box: BoxSpec, dim: { altura: number; largura: number; comprimento: number }) {
    const rots = this.rotations(dim);
    for (const r of rots) {
      if (r[0] <= box.altura && r[1] <= box.largura && r[2] <= box.comprimento) return true;
    }
    return false;
  }

  packOrder(produtos: any[]): PackedBox[] {
    const items = produtos
      .map((p) => ({ ...p, _volume: this.volume(p.dimensoes) }))
      .sort((a, b) => b._volume - a._volume);

    const openBoxes: Array<{ spec: BoxSpec; produtos: any[] }> = [];

    for (const item of items) {
      let placed = false;
      for (const ob of openBoxes) {
        if (this.fitsInBox(ob.spec, item.dimensoes)) {
          ob.produtos.push(item);
          placed = true;
          break;
        }
      }
      if (placed) continue;

      const possible = this.boxes.filter((b) => this.fitsInBox(b, item.dimensoes));
      if (possible.length === 0) {
        openBoxes.push({ spec: { id: `Custom-${item.produto_id}`, altura: item.dimensoes.altura, largura: item.dimensoes.largura, comprimento: item.dimensoes.comprimento }, produtos: [item] });
        continue;
      }
      possible.sort((a, b) => a.altura * a.largura * a.comprimento - (b.altura * b.largura * b.comprimento));
      openBoxes.push({ spec: possible[0], produtos: [item] });
    }

    return openBoxes.map((ob) => ({ caixa_id: ob.spec.id, produtos: ob.produtos.map((p) => p.produto_id) }));
  }

  pack(payload: any) {
    const pedidos = payload.pedidos || [];
    return { pedidos: pedidos.map((pedido) => ({ pedido_id: pedido.pedido_id, caixas: this.packOrder(pedido.produtos) })) };
  }
}