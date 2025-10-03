import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectMemberRole {
  LEAD = 'lead',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  TESTER = 'tester',
}

export class CreateProjectMemberDto {
  @ApiProperty({
    description: 'UUID of the project',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description: 'UUID of the employee to be assigned to the project',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsUUID()
  employeeId: string;

  @ApiProperty({
    description: 'Role of the employee in the project',
    enum: ProjectMemberRole,
    example: ProjectMemberRole.DEVELOPER,
  })
  @IsEnum(ProjectMemberRole)
  role: ProjectMemberRole;

  @ApiPropertyOptional({
    description: 'Optional responsibilities of the project member',
    example: 'Develop backend APIs and manage database schema',
  })
  @IsOptional()
  @IsString()
  responsibilities?: string;
}
