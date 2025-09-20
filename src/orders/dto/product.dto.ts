import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DimensionDto {
  @ApiProperty() @IsNumber() altura: number;
  @ApiProperty() @IsNumber() largura: number;
  @ApiProperty() @IsNumber() comprimento: number;
}

export class ProductDto {
  @ApiProperty() @IsString() produto_id: string;
  @ApiProperty() dimensoes: DimensionDto;
}