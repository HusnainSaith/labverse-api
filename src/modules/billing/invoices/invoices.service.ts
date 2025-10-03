import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ValidationUtil } from '../../../common/utils/validation.util';
import { SafeLogger } from '../../../common/utils/logger.util';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ success: boolean; message: string; data: Invoice }> {
    if (createInvoiceDto.invoice_number) {
      ValidationUtil.validateString(
        createInvoiceDto.invoice_number,
        'invoice_number',
        3,
        50,
      );
    }
    ValidationUtil.validateDecimal(
      createInvoiceDto.total_amount,
      'total_amount',
    );
    ValidationUtil.validateDate(createInvoiceDto.issue_date, 'issue_date');
    ValidationUtil.validateDate(createInvoiceDto.due_date, 'due_date');
    ValidationUtil.validateUUID(createInvoiceDto.client_id, 'client_id');
    if (createInvoiceDto.project_id) {
      ValidationUtil.validateUUID(createInvoiceDto.project_id, 'project_id');
    }
    if (createInvoiceDto.quotation_id) {
      ValidationUtil.validateUUID(
        createInvoiceDto.quotation_id,
        'quotation_id',
      );
    }
    if (createInvoiceDto.status) {
      ValidationUtil.validateString(createInvoiceDto.status, 'status', 1, 50);
    }
    if (createInvoiceDto.description) {
      ValidationUtil.validateString(
        createInvoiceDto.description,
        'description',
        0,
        1000,
      );
    }

    // Validate date logic
    if (
      new Date(createInvoiceDto.issue_date) >
      new Date(createInvoiceDto.due_date)
    ) {
      throw new BadRequestException('Issue date cannot be after due date');
    }

    try {
      const invoice = this.invoicesRepository.create({
        ...createInvoiceDto,
        invoice_number: createInvoiceDto.invoice_number
          ? ValidationUtil.sanitizeString(createInvoiceDto.invoice_number)
          : undefined,
        description: createInvoiceDto.description
          ? ValidationUtil.sanitizeString(createInvoiceDto.description)
          : undefined,
      });

      const savedInvoice = await this.invoicesRepository.save(invoice);
      SafeLogger.log(
        `Invoice created: ${createInvoiceDto.invoice_number || 'Auto-generated'}`,
        'InvoicesService',
      );

      return {
        success: true,
        message: 'Invoice created successfully',
        data: savedInvoice,
      };
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundException(
          'Referenced client, project, or quotation not found',
        );
      }
      if (error.code === '23505') {
        throw new ConflictException('Invoice number already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<{
    success: boolean;
    message: string;
    data: Invoice[];
  }> {
    const invoices = await this.invoicesRepository.find({
      relations: ['client', 'project', 'quotation'],
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices,
    };
  }

  async findOne(
    id: string,
  ): Promise<{ success: boolean; message: string; data: Invoice }> {
    ValidationUtil.validateUUID(id, 'invoiceId');

    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['client', 'project', 'quotation'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }

    return {
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<{ success: boolean; message: string; data: Invoice }> {
    ValidationUtil.validateUUID(id, 'invoiceId');

    if (updateInvoiceDto.invoice_number) {
      ValidationUtil.validateString(
        updateInvoiceDto.invoice_number,
        'invoice_number',
        3,
        50,
      );
    }
    if (updateInvoiceDto.total_amount !== undefined) {
      ValidationUtil.validateDecimal(
        updateInvoiceDto.total_amount,
        'total_amount',
      );
    }
    if (updateInvoiceDto.issue_date) {
      ValidationUtil.validateDate(updateInvoiceDto.issue_date, 'issue_date');
    }
    if (updateInvoiceDto.due_date) {
      ValidationUtil.validateDate(updateInvoiceDto.due_date, 'due_date');
    }
    if (updateInvoiceDto.client_id) {
      ValidationUtil.validateUUID(updateInvoiceDto.client_id, 'client_id');
    }
    if (updateInvoiceDto.project_id) {
      ValidationUtil.validateUUID(updateInvoiceDto.project_id, 'project_id');
    }
    if (updateInvoiceDto.quotation_id) {
      ValidationUtil.validateUUID(
        updateInvoiceDto.quotation_id,
        'quotation_id',
      );
    }
    if (updateInvoiceDto.status) {
      ValidationUtil.validateString(updateInvoiceDto.status, 'status', 1, 50);
    }
    if (updateInvoiceDto.description !== undefined) {
      if (updateInvoiceDto.description) {
        ValidationUtil.validateString(
          updateInvoiceDto.description,
          'description',
          0,
          1000,
        );
      }
    }

    try {
      const invoiceResult = await this.findOne(id);
      const invoice = invoiceResult.data;

      // Validate date logic if both dates are provided or being updated
      const newIssueDate = updateInvoiceDto.issue_date || invoice.issue_date;
      const newDueDate = updateInvoiceDto.due_date || invoice.due_date;
      if (
        newIssueDate &&
        newDueDate &&
        new Date(newIssueDate) > new Date(newDueDate)
      ) {
        throw new BadRequestException('Issue date cannot be after due date');
      }

      const updateData = {
        ...updateInvoiceDto,
        ...(updateInvoiceDto.invoice_number && {
          invoice_number: ValidationUtil.sanitizeString(
            updateInvoiceDto.invoice_number,
          ),
        }),
        ...(updateInvoiceDto.description !== undefined && {
          description: updateInvoiceDto.description
            ? ValidationUtil.sanitizeString(updateInvoiceDto.description)
            : null,
        }),
      };

      this.invoicesRepository.merge(invoice, updateData);
      const updatedInvoice = await this.invoicesRepository.save(invoice);

      SafeLogger.log(`Invoice updated: ${id}`, 'InvoicesService');
      return {
        success: true,
        message: 'Invoice updated successfully',
        data: updatedInvoice,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error.code === '23503') {
        throw new NotFoundException(
          'Referenced client, project, or quotation not found',
        );
      }
      if (error.code === '23505') {
        throw new ConflictException('Invoice number already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateUUID(id, 'invoiceId');

    const result = await this.invoicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }

    SafeLogger.log(`Invoice deleted: ${id}`, 'InvoicesService');
    return {
      success: true,
      message: 'Invoice deleted successfully',
    };
  }
}
