import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry])],
  exports: [TypeOrmModule],
})
export class TimeEntryModule {}