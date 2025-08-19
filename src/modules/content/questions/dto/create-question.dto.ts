import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Text content of the question',
    example: 'What is the difference between NestJS and Express?',
  })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({
    description: 'ID of the user who asked the question (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  askedBy?: string;

  @ApiPropertyOptional({
    description: 'ID of the category the question belongs to (UUID v4)',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Publication status of the question',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
