import { OrdersService } from '../src/orders/orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  beforeEach(() => {
    service = new OrdersService();
  });

  it('should pack sample orders', () => {
    const payload = {
      pedidos: [
        {
          pedido_id: 1,
          produtos: [
            { produto_id: 'PS5', dimensoes: { altura: 40, largura: 10, comprimento: 25 } },
            { produto_id: 'Volante', dimensoes: { altura: 40, largura: 30, comprimento: 30 } },
          ],
        },
      ],
    };
    const res = service.pack(payload);
    expect(res.pedidos[0].caixas.length).toBeGreaterThanOrEqual(1);
  });
});