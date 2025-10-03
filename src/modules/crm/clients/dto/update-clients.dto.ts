// import { PartialType } from '@nestjs/swagger';
// import { CreateClientDto } from './create-clients.dto';

// export class UpdateClientDto extends PartialType(CreateClientDto) {}
// src/clients/dto/update-clients.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-clients.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    description: "The URL of the client's profile photo",
    example: 'https://supabase-bucket.com/client-profiles/image.png',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  profilePhoto?: string;
}
