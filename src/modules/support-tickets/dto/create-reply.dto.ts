import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketReplyDto {
  @ApiProperty({
    description: 'UUID of the employee or user sending the ticket reply',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID('4')
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({
    description: 'Main content of the ticket reply',
    example: 'We have investigated the issue and applied a fix.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Optional message or note associated with the reply',
    example: 'Please confirm if the issue persists.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description:
      'Indicates if the reply is internal and not visible to the client',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
