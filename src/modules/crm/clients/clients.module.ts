import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/clients.entity';
import { SupabaseService } from 'src/common/services/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, SupabaseService],
  exports: [ClientsService, TypeOrmModule, SupabaseService], // Export for other modules that might need to inject ClientsService or use Client entity
})
export class ClientsModule {}
