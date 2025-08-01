import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsOptional()
  @IsUUID()
  askedBy?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}