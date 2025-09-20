import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { ProductDto } from './product.dto';

class PedidoDto {
  @ApiProperty() @IsNumber() pedido_id: number;
  @ApiProperty({ type: [ProductDto] }) @IsArray() @Type(() => ProductDto) produtos: ProductDto[];
}

export class CreateOrdersDto {
  @ApiProperty({ type: [PedidoDto] }) @IsArray() @Type(() => PedidoDto) pedidos: PedidoDto[];
}