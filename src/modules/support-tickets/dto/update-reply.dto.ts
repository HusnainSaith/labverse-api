import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketReplyDto } from './create-reply.dto';

export class UpdateReplyDto extends PartialType(CreateTicketReplyDto) {}
