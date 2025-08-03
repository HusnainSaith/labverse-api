import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientNotesService } from './client-notes.service';
import { ClientNotesController } from './client-notes.controller';
import { ClientNote } from './entities/client-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientNote])],
  controllers: [ClientNotesController],
  providers: [ClientNotesService],
  exports: [ClientNotesService],
})
export class ClientNotesModule {}