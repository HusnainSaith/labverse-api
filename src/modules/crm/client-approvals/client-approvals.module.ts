import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientApprovalsController } from './client-approvals.controller';
import { ClientApprovalsService } from './client-approvals.service';
import { ClientApproval } from './entities/client-approval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientApproval])],
  controllers: [ClientApprovalsController],
  providers: [ClientApprovalsService],
})
export class ClientApprovalsModule {}