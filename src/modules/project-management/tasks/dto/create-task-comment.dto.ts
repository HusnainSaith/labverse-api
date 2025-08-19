import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskCommentDto {
  @ApiProperty({
    description: 'UUID of the task to which this comment belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  task_id: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'Completed the initial module, please review.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  comment_text: string;

  @ApiProperty({
    description: 'UUID of the employee profile who made the comment',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  commented_by_employee_profile_id: string;
}
