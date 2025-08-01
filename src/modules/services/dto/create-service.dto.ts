import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'The name of the service', example: 'Website Design' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A detailed description of the service', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The base price of the service', example: 500.00 })
  @IsNumber()
  @Min(0)
  // Use IsDecimal if you need to strictly validate decimal format in string input before transformation
  base_price: number;

  @ApiProperty({ description: 'Expected duration of the service in days', required: false, example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration_in_days?: number;

  @ApiProperty({ description: 'Category of the service (e.g., "Web Development", "Consulting")', required: false, example: "Web Development" })
  @IsOptional()
  @IsString()
  category?: string;
}