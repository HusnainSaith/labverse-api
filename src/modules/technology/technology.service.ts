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

  async create(
    createTechnologyDto: CreateTechnologyDto,
    logoFile?: Express.Multer.File,
  ): Promise<Technology> {
    SecurityUtil.validateObject(createTechnologyDto);
    const { name } = createTechnologyDto;
    const sanitizedName = SecurityUtil.sanitizeString(name);

    const existingTechnology = await this.technologyRepository.findOne({
      where: { name: sanitizedName },
    });
    if (existingTechnology) {
      throw new ConflictException(
        `Technology with name "${name}" already exists.`,
      );
    }

    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = await this.supabaseService.uploadImage(
        logoFile,
        'technologies',
      );
    }

    try {
      const technology = this.technologyRepository.create({
        ...createTechnologyDto,
        logo: logoUrl,
      });
      return await this.technologyRepository.save(technology);
    } catch (error) {
      if (logoUrl) {
        await this.supabaseService.deleteImage(logoUrl);
      }
      throw error;
    }
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
    const technology = await this.findOne(id);

    if (
      updateTechnologyDto.name &&
      updateTechnologyDto.name !== technology.name
    ) {
      const sanitizedName = SecurityUtil.sanitizeString(
        updateTechnologyDto.name,
      );
      const existingTechnology = await this.technologyRepository.findOne({
        where: { name: sanitizedName },
      });
      if (existingTechnology && existingTechnology.id !== id) {
        throw new ConflictException(
          `Technology with name "${updateTechnologyDto.name}" already exists.`,
        );
      }
    }

    let logoUrl: string | undefined;
    let oldLogoUrl: string | undefined;

    if (logoFile) {
      oldLogoUrl = technology.logo;
      logoUrl = await this.supabaseService.uploadImage(
        logoFile,
        'technologies',
      );
    }

    try {
      Object.assign(technology, {
        ...updateTechnologyDto,
        logo: logoUrl ?? technology.logo,
      });
      const savedTechnology = await this.technologyRepository.save(technology);

      if (oldLogoUrl && logoUrl) {
        await this.supabaseService.deleteImage(oldLogoUrl);
      }

      return savedTechnology;
    } catch (error) {
      if (logoUrl) {
        await this.supabaseService.deleteImage(logoUrl);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const validId = SecurityUtil.validateId(id);
    const result = await this.technologyRepository.delete(validId);
    if (result.affected === 0) {
      throw new NotFoundException(`Technology with ID "${id}" not found.`);
    }
  }
}
