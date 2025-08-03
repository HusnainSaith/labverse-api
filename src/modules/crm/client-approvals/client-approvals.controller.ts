import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { ClientApprovalsService } from './client-approvals.service';
import { CreateClientApprovalDto } from './dto/create-client-approval.dto';
import { UpdateClientApprovalDto } from './dto/update-client-approval.dto';

@Controller('client-approvals')
export class ClientApprovalsController {
  constructor(private readonly clientApprovalsService: ClientApprovalsService) {}

  @Post()
  async createApproval(@Body() createClientApprovalDto: CreateClientApprovalDto) {
    return this.clientApprovalsService.createApproval(createClientApprovalDto);
  }

  @Get()
  async findAllApprovals() {
    return this.clientApprovalsService.findAllApprovals();
  }

  @Get('client/:clientId')
  async findApprovalsByClient(@Param('clientId') clientId: string) {
    return this.clientApprovalsService.findApprovalsByClient(clientId);
  }

  @Get(':id')
  async findApprovalById(@Param('id') id: string) {
    return this.clientApprovalsService.findApprovalById(id);
  }

  @Patch(':id/respond')
  async respondToApproval(@Param('id') id: string, @Body() updateClientApprovalDto: UpdateClientApprovalDto) {
    return this.clientApprovalsService.respondToApproval(id, updateClientApprovalDto);
  }

  @Delete(':id')
  async deleteApproval(@Param('id') id: string) {
    await this.clientApprovalsService.deleteApproval(id);
    return { message: 'Approval request deleted successfully.' };
  }
}