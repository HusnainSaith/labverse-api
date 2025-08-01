export class TaskCommentResponseDto {
  id: string;
  task_id: string;
  comment_text: string;
  commented_by_employee_profile_id: string;
  created_at: Date;
  updated_at: Date;
}
