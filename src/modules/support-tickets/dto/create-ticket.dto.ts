import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'UUID of the client creating the ticket',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID('4')
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'Title of the ticket',
    example: 'Website not loading',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Subject of the ticket',
    example: 'Website downtime',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Detailed description of the ticket issue',
    example:
      'The main website is not loading on any browser since yesterday evening.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'UUID of the employee assigned to this ticket',
    example: '22222222-2222-2222-2222-222222222222',
  })
  @IsOptional()
  @IsUUID('4')
  assignedToId?: string;

  @ApiPropertyOptional({
    description: 'Priority of the ticket',
    example: 'high',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  priority?: string;

  @ApiPropertyOptional({
    description: 'Current status of the ticket',
    example: 'open',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @ApiPropertyOptional({
    description: 'Category of the ticket',
    example: 'Technical',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
