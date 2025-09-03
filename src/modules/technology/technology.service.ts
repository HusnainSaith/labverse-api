import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from './entities/technology.entity';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { SecurityUtil } from '../../common/utils/security.util';
import { SupabaseService } from 'src/common/services/supabase.service';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(createTechnologyDto: CreateTechnologyDto, logoFile?: Express.Multer.File): Promise<Technology> {
    SecurityUtil.validateObject(createTechnologyDto);
    const { name } = createTechnologyDto;
    const sanitizedName = SecurityUtil.sanitizeString(name);

    // Check if technology name already exists
    const existingTechnology = await this.technologyRepository.findOne({
      where: { name: sanitizedName },
    });
    if (existingTechnology) {
      throw new ConflictException(
        `Technology with name "${name}" already exists.`,
      );
    }

    // Upload logo if provided
    if (logoFile) {
      const logoUrl = await this.supabaseService.uploadImage(logoFile, 'technologies');
      createTechnologyDto.logo = logoUrl;
    }

    const technology = this.technologyRepository.create(createTechnologyDto);
    return this.technologyRepository.save(technology);
  }

  async findAll(): Promise<Technology[]> {
    return this.technologyRepository.find();
  }

  async findOne(id: string): Promise<Technology> {
    const validId = SecurityUtil.validateId(id);
    const technology = await this.technologyRepository.findOne({
      where: { id: validId },
    });
    if (!technology) {
      throw new NotFoundException(`Technology with ID "${id}" not found.`);
    }
    return technology;
  }

  async update(
    id: string,
    updateTechnologyDto: UpdateTechnologyDto,
    logoFile?: Express.Multer.File,
  ): Promise<Technology> {
    SecurityUtil.validateObject(updateTechnologyDto);
    const technology = await this.findOne(id); // Reuses findOne to check existence

    if (
      updateTechnologyDto.name &&
      updateTechnologyDto.name !== technology.name
    ) {
      const sanitizedName = SecurityUtil.sanitizeString(updateTechnologyDto.name);
      // Check if the new name is unique
      const existingTechnology = await this.technologyRepository.findOne({
        where: { name: sanitizedName },
      });
      if (existingTechnology && existingTechnology.id !== id) {
        throw new ConflictException(
          `Technology with name "${updateTechnologyDto.name}" already exists.`,
        );
      }
    }

    // Upload new logo if provided
    if (logoFile) {
      const logoUrl = await this.supabaseService.uploadImage(logoFile, 'technologies');
      updateTechnologyDto.logo = logoUrl;
    }

    Object.assign(technology, updateTechnologyDto);
    return this.technologyRepository.save(technology);
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.technologyRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(`Technology with ID "${id}" not found.`);
    }
  }
}
