import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientInteractionsService } from './client-interactions.service';
import { ClientInteractionsController } from './client-interactions.controller';
import { ClientInteraction } from './entities/client-interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientInteraction])],
  controllers: [ClientInteractionsController],
  providers: [ClientInteractionsService],
  exports: [ClientInteractionsService],
})
export class ClientInteractionsModule {}