import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInteractionDto } from './create-client-interaction.dto';

export class UpdateClientInteractionDto extends PartialType(CreateClientInteractionDto) {}