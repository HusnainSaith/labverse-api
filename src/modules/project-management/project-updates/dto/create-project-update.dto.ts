import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';

export enum ProjectUpdateType {
  PROGRESS = 'progress',
  MILESTONE = 'milestone',
  ISSUE = 'issue',
  COMPLETION = 'completion',
}

export class CreateProjectUpdateDto {
  @IsUUID()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ProjectUpdateType)
  updateType: ProjectUpdateType;

  @IsOptional()
  @IsUUID()
  createdByEmployeeId?: string;
}
