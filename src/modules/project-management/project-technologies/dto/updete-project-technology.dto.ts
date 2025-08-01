import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectTechnologyDto } from './create-project-technology.dto';

// For a simple junction table, update might only involve changing the primary keys,
// which is typically handled by deleting and recreating, or not allowed.
// However, if there were additional fields on the junction table, this would be used.
// For now, it's included for completeness, even if its practical use is limited
// to potentially changing the project_id or technology_id (which implies a re-association).
export class UpdateProjectTechnologyDto extends PartialType(CreateProjectTechnologyDto) {}
