import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientNoteDto {
  @ApiProperty({
    description: 'UUID of the client this note belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'UUID of the user/employee who authored the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    description: 'Content of the client note',
    example: 'Client mentioned they prefer weekly meetings on Monday mornings.',
  })
  @IsString()
  @IsNotEmpty()
  noteContent: string;
}
