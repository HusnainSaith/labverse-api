import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum ProjectMemberRole {
  LEAD = 'lead',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  TESTER = 'tester',
}

export class CreateProjectMemberDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  employeeId: string;

  @IsEnum(ProjectMemberRole)
  role: ProjectMemberRole;

  @IsOptional()
  responsibilities?: string;
}
