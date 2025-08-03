import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientApproval, ApprovalStatus } from './entities/client-approval.entity';
import { CreateClientApprovalDto } from './dto/create-client-approval.dto';
import { UpdateClientApprovalDto } from './dto/update-client-approval.dto';

@Injectable()
export class ClientApprovalsService {
  constructor(
    @InjectRepository(ClientApproval) private approvalRepository: Repository<ClientApproval>,
  ) {}

  /**
   * Submits a new approval request.
   * @param createClientApprovalDto DTO for the approval request.
   * @returns The newly created approval request.
   */
  async createApproval(createClientApprovalDto: CreateClientApprovalDto): Promise<ClientApproval> {
    const approval = this.approvalRepository.create(createClientApprovalDto);
    return await this.approvalRepository.save(approval);
  }

  /**
   * Retrieves all approval requests.
   * @returns An array of all approval requests.
   */
  async findAllApprovals(): Promise<ClientApproval[]> {
    return this.approvalRepository.find();
  }

  /**
   * Retrieves approval requests for a specific client.
   * @param clientId The ID of the client.
   * @returns An array of approval requests.
   */
  async findApprovalsByClient(clientId: string): Promise<ClientApproval[]> {
    return this.approvalRepository.find({ where: { clientId } });
  }

  /**
   * Retrieves a single approval request by its ID.
   * @param id The ID of the approval request.
   * @returns The approval request.
   */
  async findApprovalById(id: string): Promise<ClientApproval> {
    const approval = await this.approvalRepository.findOne({ where: { id } });

    if (!approval) {
      throw new NotFoundException(`Client Approval with ID ${id} not found.`);
    }

    return approval;
  }

  /**
   * Allows a client to respond to an approval request.
   * @param id The ID of the approval request.
   * @param updateClientApprovalDto The client's response (status and notes).
   * @returns The updated approval request.
   */
  async respondToApproval(id: string, updateClientApprovalDto: UpdateClientApprovalDto): Promise<ClientApproval> {
    const approval = await this.findApprovalById(id);

    // Ensure the request is still pending before updating
    if (approval.status !== ApprovalStatus.PENDING) {
      throw new NotFoundException('Cannot respond to an approval request that is not pending.');
    }

    // Set the response time
    approval.respondedAt = new Date();
    this.approvalRepository.merge(approval, updateClientApprovalDto);
    return await this.approvalRepository.save(approval);
  }

  /**
   * Deletes an approval request.
   * @param id The ID of the approval request to delete.
   */
  async deleteApproval(id: string): Promise<void> {
    const result = await this.approvalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client Approval with ID ${id} not found.`);
    }
  }
}