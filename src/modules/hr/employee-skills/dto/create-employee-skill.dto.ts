import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeSkillDto {
  @ApiProperty({
    description: 'UUID of the employee',
    example: 'b1d2c3e4-f5a6-7890-1234-abcdef987654',
  })
  @IsUUID('4')
  employeeId: string;

  @ApiProperty({
    description: 'UUID of the skill',
    example: 'c2d3e4f5-a6b7-8901-2345-fedcba098765',
  })
  @IsUUID('4')
  skillId: string;

  @ApiPropertyOptional({
    description: 'Proficiency level of the skill (e.g., Beginner, Intermediate, Expert)',
    example: 'Intermediate',
  })
  @IsString()
  @IsOptional()
  proficiencyLevel?: string;

  @ApiPropertyOptional({
    description: 'Years of experience with this skill',
    example: 3,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  yearsOfExperience?: number;
}
