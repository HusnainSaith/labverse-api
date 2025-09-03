import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesService } from './technology.service';
import { TechnologiesController } from './technology.controller';
import { Technology } from './entities/technology.entity';
import { SupabaseService } from 'src/common/services/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologiesController],
  providers: [TechnologiesService, SupabaseService],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
