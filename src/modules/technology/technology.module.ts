import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesService } from './technology.service';
import { TechnologiesController } from './technology.controller';
import { Technology } from './entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
