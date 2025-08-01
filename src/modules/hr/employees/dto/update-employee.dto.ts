import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeProfileDto } from './create-employee.dto';

export class UpdateEmployeeProfileDto extends PartialType(CreateEmployeeProfileDto) {}
