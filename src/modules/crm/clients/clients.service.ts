import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-clients.dto';
import { UpdateClientDto } from './dto/update-clients.dto';
import { ValidationUtil } from '../../../common/utils/validation.util';
import { SafeLogger } from '../../../common/utils/logger.util';
import { SupabaseService } from 'src/common/services/supabase.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(
    dto: CreateClientDto,
    profile_photo?: Express.Multer.File,
  ): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateString(dto.name, 'name', 2, 100);
    if (dto.email) ValidationUtil.validateEmail(dto.email);
    if (dto.phone) ValidationUtil.validatePhone(dto.phone);
    if (dto.company) ValidationUtil.validateString(dto.company, 'company', 2, 100);
    if (dto.address) ValidationUtil.validateString(dto.address, 'address', 5, 255);
    if (dto.website) ValidationUtil.validateUrl(dto.website, 'website');

    if (dto.email) {
      const existingClient = await this.clientsRepository.findOne({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existingClient) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    let profilePhotoUrl: string | undefined;
    if (profile_photo) {
      profilePhotoUrl = await this.supabaseService.uploadImage(profile_photo, 'clients');
    }

    try {
      const client = this.clientsRepository.create({
        ...dto,
        name: ValidationUtil.sanitizeString(dto.name),
        email: dto.email ? ValidationUtil.sanitizeString(dto.email.toLowerCase()) : null,
        company: dto.company ? ValidationUtil.sanitizeString(dto.company) : undefined,
        address: dto.address ? ValidationUtil.sanitizeString(dto.address) : undefined,
        profilePhoto: profilePhotoUrl,
      });

      const savedClient = await this.clientsRepository.save(client);
      SafeLogger.log(`Client created: ${dto.name} (${dto.email})`, 'ClientsService');
      return ValidationUtil.createSuccessResponse('Client created successfully', savedClient);
    } catch (error) {
      if (profilePhotoUrl) {
        await this.supabaseService.deleteImage(profilePhotoUrl);
      }
      throw error;
    }
  }

  async findAll(): Promise<{ success: boolean; message: string; data: Client[] }> {
    const clients = await this.clientsRepository.find({
      order: { created_at: 'DESC' },
    });
    return ValidationUtil.createSuccessResponse(
      'Clients retrieved successfully',
      clients,
    );
  }

  async findOne(
    id: string,
  ): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateObjectId(id, 'clientId');

    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return ValidationUtil.createSuccessResponse(
      'Client retrieved successfully',
      client,
    );
  }

 async update(
    id: string,
    dto: UpdateClientDto,
    profile_photo?: Express.Multer.File,
  ): Promise<{ success: boolean; message: string; data: Client }> {
    ValidationUtil.validateObjectId(id, 'clientId');

    if (dto.name) ValidationUtil.validateString(dto.name, 'name', 2, 100);
    if (dto.email) ValidationUtil.validateEmail(dto.email);
    if (dto.phone) ValidationUtil.validatePhone(dto.phone);
    if (dto.company) ValidationUtil.validateString(dto.company, 'company', 2, 100);
    if (dto.address) ValidationUtil.validateString(dto.address, 'address', 5, 255);
    if (dto.website) ValidationUtil.validateUrl(dto.website, 'website');

    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (dto.email && dto.email.toLowerCase().trim() !== client.email) {
      const existingClient = await this.clientsRepository.findOne({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existingClient) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    let profilePhotoUrl: string | undefined;
    let oldPhotoUrl: string | undefined;
    
    if (profile_photo) {
      oldPhotoUrl = client.profilePhoto;
      profilePhotoUrl = await this.supabaseService.uploadImage(profile_photo, 'clients');
    }

    try {
      Object.assign(client, {
        ...dto,
        name: dto.name ? ValidationUtil.sanitizeString(dto.name) : client.name,
        email: dto.email ? ValidationUtil.sanitizeString(dto.email.toLowerCase()) : client.email,
        company: dto.company ? ValidationUtil.sanitizeString(dto.company) : client.company,
        address: dto.address ? ValidationUtil.sanitizeString(dto.address) : client.address,
        profilePhoto: profilePhotoUrl ?? client.profilePhoto,
      });

      const updatedClient = await this.clientsRepository.save(client);
      
      if (oldPhotoUrl && profilePhotoUrl) {
        await this.supabaseService.deleteImage(oldPhotoUrl);
      }

      SafeLogger.log(`Client updated: ${client.name} (ID: ${id})`, 'ClientsService');
      return ValidationUtil.createSuccessResponse('Client updated successfully', updatedClient);
    } catch (error) {
      if (profilePhotoUrl) {
        await this.supabaseService.deleteImage(profilePhotoUrl);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    ValidationUtil.validateObjectId(id, 'clientId');

    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // ✅ Delete from Supabase if profile photo exists
    if (client.profilePhoto) {
      await this.supabaseService.deleteImage(client.profilePhoto);
    }

    await this.clientsRepository.delete(id);
    SafeLogger.log(
      `Client deleted: ${client.name} (ID: ${id})`,
      'ClientsService',
    );

    return ValidationUtil.createSuccessResponse('Client deleted successfully');
  }
}
