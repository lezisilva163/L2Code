import { Injectable } from "@nestjs/common";
import { BoxSpec, PackedBox } from "./interfaces/box.interface";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { ProductDto } from "./dto/product.dto";

@Injectable()
export class OrdersService {
  private boxes: BoxSpec[] = [
    { id: "Caixa 1", altura: 30, largura: 40, comprimento: 80 },
    { id: "Caixa 2", altura: 50, largura: 50, comprimento: 40 },
    { id: "Caixa 3", altura: 50, largura: 80, comprimento: 60 },
  ];

  private rotations(dim: {
    altura: number;
    largura: number;
    comprimento: number;
  }) {
    const { altura: h, largura: w, comprimento: l } = dim;
    return [
      [h, w, l],
      [h, l, w],
      [w, h, l],
      [w, l, h],
      [l, h, w],
      [l, w, h],
    ];
  }

  private volume(dim: {
    altura: number;
    largura: number;
    comprimento: number;
  }) {
    return dim.altura * dim.largura * dim.comprimento;
  }

  private fitsInBox(
    box: BoxSpec,
    dim: { altura: number; largura: number; comprimento: number }
  ) {
    return this.rotations(dim).some(
      (r) =>
        r[0] <= box.altura && r[1] <= box.largura && r[2] <= box.comprimento
    );
  }

  packOrder(produtos: ProductDto[]): PackedBox[] {
    const items = produtos
      .map((p) => ({ ...p, _volume: this.volume(p.dimensoes) }))
      .sort((a, b) => b._volume - a._volume);

    const openBoxes: Array<{ spec: BoxSpec; produtos: ProductDto[] }> = [];

    items.forEach((item) => {
      let placed = false;

      // Tenta colocar o item em uma caixa existente
      placed = openBoxes.some((ob) => {
        if (this.fitsInBox(ob.spec, item.dimensoes)) {
          ob.produtos.push(item);
          return true;
        }
        return false;
      });

      if (placed) return;

      // Busca caixas possíveis para o item
      const possible = this.boxes.filter((b) =>
        this.fitsInBox(b, item.dimensoes)
      );
      if (possible.length === 0) {
        // Produto não empacotado, salva mensagem
        if (!openBoxes.some((ob) => ob.spec.id === "NÃO EMPACOTADO")) {
          openBoxes.push({
            spec: {
              id: "NÃO EMPACOTADO",
              altura: 0,
              largura: 0,
              comprimento: 0,
            },
            produtos: [],
          });
        }
        const naoEmpacotadoBox = openBoxes.find(
          (ob) => ob.spec.id === "NÃO EMPACOTADO"
        );
        naoEmpacotadoBox?.produtos.push(item);
        return;
      }

      // Ordena as caixas possíveis pelo volume e adiciona o item
      const [chosen] = possible.sort(
        (a, b) =>
          a.altura * a.largura * a.comprimento -
          b.altura * b.largura * b.comprimento
      );
      openBoxes.push({ spec: chosen, produtos: [item] });
    });

    return openBoxes.map((ob) => ({
      caixa_id: ob.spec.id,
      produtos: ob.produtos.map((p) => p.produto_id),
    }));
  }

  pack(payload: CreateOrdersDto) {
    const pedidos = payload.pedidos || [];
    return {
      pedidos: pedidos.map((pedido) => ({
        pedido_id: pedido.pedido_id,
        caixas: this.packOrder(pedido.produtos),
      })),
    };
  }
}
