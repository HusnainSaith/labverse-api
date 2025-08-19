import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'ID of the question being answered (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: 'Text content of the answer',
    example: 'You can use NestJS with TypeORM to build scalable APIs efficiently.',
  })
  @IsString()
  answerText: string;

  @ApiPropertyOptional({
    description: 'ID of the user who answered (UUID v4)',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsOptional()
  @IsUUID()
  answeredBy?: string;
}
