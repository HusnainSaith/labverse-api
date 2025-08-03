import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  answerText: string;

  @IsOptional()
  @IsUUID()
  answeredBy?: string;
}