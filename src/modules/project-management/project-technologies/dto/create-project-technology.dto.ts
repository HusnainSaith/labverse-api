import { IsUUID } from 'class-validator';

export class CreateProjectTechnologyDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  technologyId: string;
}
