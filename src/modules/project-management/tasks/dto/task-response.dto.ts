export class TaskResponseDto {
  id: string;
  project_id: string;
  project_milestone_id?: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: Date;
  created_by_employee_profile_id: string;
  assigned_to_employee_profile_id?: string;
  created_at: Date;
  updated_at: Date;
}