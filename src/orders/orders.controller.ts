import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { OrdersService } from './orders.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('packing')
@Controller('api')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post('packing')
  @ApiOperation({ summary: 'Empacotar pedidos' })
  @UseGuards(ApiKeyGuard)
  pack(@Body() body: CreateOrdersDto) {
    return this.service.pack(body);
  }
}