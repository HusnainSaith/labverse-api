export class ProjectMilestoneResponseDto {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  due_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}