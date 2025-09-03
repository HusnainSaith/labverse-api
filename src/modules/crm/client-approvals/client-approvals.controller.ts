import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientApprovalsService } from './client-approvals.service';
import { CreateClientApprovalDto } from './dto/create-client-approval.dto';
import { UpdateClientApprovalDto } from './dto/update-client-approval.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Client Approvals')
@Controller('client-approvals')
export class ClientApprovalsController {
  constructor(
    private readonly clientApprovalsService: ClientApprovalsService,
  ) {}

  @Post()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new client approval' })
  async createApproval(
    @Body() createClientApprovalDto: CreateClientApprovalDto,
  ) {
    return this.clientApprovalsService.createApproval(createClientApprovalDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all client plan quotations' })
  async findAllApprovals() {
    return this.clientApprovalsService.findAllApprovals();
  }

  @Get('client/:clientId')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all approvals for a specific client' })
  async findApprovalsByClient(@Param('clientId') clientId: string) {
    return this.clientApprovalsService.findApprovalsByClient(clientId);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a specific client approval by ID' })
  async findApprovalById(@Param('id') id: string) {
    return this.clientApprovalsService.findApprovalById(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Respond to a specific client approval by ID' })
  async respondToApproval(
    @Param('id') id: string,
    @Body() updateClientApprovalDto: UpdateClientApprovalDto,
  ) {
    return this.clientApprovalsService.respondToApproval(
      id,
      updateClientApprovalDto,
    );
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a specific client approval by ID' })
  async deleteApproval(@Param('id') id: string) {
    await this.clientApprovalsService.deleteApproval(id);
    return { message: 'Approval request deleted successfully.' };
  }
}
