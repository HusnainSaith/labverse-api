# LabVerse API - Development Guide

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Setup
```bash
# Clone and install
git clone <repository-url>
cd labverse-api
npm install

# Environment setup
cp .env.example .env
# Edit .env with your database credentials

# Database setup
npm run migration:run
npm run seed

# Start development server
npm run start:dev
```

## Development Workflow

### 1. Database Changes
```bash
# Create new migration
npm run migration:generate -- MigrationName

# Run migrations
npm run migration:run

# Revert if needed
npm run migration:revert
```

### 2. Adding New Features

#### Create a New Module
```bash
# Generate module structure
nest g module modules/feature-name
nest g controller modules/feature-name
nest g service modules/feature-name
```

#### Module Structure
```
src/modules/feature-name/
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
├── entities/
│   └── feature.entity.ts
├── feature-name.controller.ts
├── feature-name.service.ts
└── feature-name.module.ts
```

### 3. Entity Creation
```typescript
// entities/example.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### 4. DTO Creation
```typescript
// dto/create-example.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExampleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### 5. Service Implementation
```typescript
// example.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  async create(dto: CreateExampleDto): Promise<Example> {
    const example = this.exampleRepository.create(dto);
    return this.exampleRepository.save(example);
  }

  async findAll(): Promise<Example[]> {
    return this.exampleRepository.find();
  }

  async findOne(id: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({ where: { id } });
    if (!example) throw new NotFoundException('Example not found');
    return example;
  }
}
```

### 6. Controller Implementation
```typescript
// example.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('examples')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  create(@Body() dto: CreateExampleDto) {
    return this.exampleService.create(dto);
  }

  @Get()
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(id);
  }
}
```

## Code Standards

### 1. Naming Conventions
- **Files**: kebab-case (`user-profile.service.ts`)
- **Classes**: PascalCase (`UserProfileService`)
- **Variables/Functions**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Database**: snake_case (`user_profiles`)

### 2. Import Organization
```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Internal modules (absolute paths)
import { User } from '../users/entities/user.entity';

// 3. Relative imports
import { CreateExampleDto } from './dto/create-example.dto';
```

### 3. Error Handling
```typescript
// Use appropriate HTTP exceptions
import { NotFoundException, BadRequestException } from '@nestjs/common';

// In service methods
if (!user) {
  throw new NotFoundException('User not found');
}

if (email.includes('invalid')) {
  throw new BadRequestException('Invalid email format');
}
```

### 4. Validation
```typescript
// Always use class-validator decorators
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;
}
```

## Testing Guidelines

### 1. Unit Tests
```typescript
// example.service.spec.ts
describe('ExampleService', () => {
  let service: ExampleService;
  let repository: Repository<Example>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExampleService,
        {
          provide: getRepositoryToken(Example),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    repository = module.get<Repository<Example>>(getRepositoryToken(Example));
  });

  it('should create an example', async () => {
    const dto = { name: 'Test' };
    const example = { id: '1', ...dto };
    
    jest.spyOn(repository, 'create').mockReturnValue(example as any);
    jest.spyOn(repository, 'save').mockResolvedValue(example as any);

    const result = await service.create(dto);
    expect(result).toEqual(example);
  });
});
```

### 2. E2E Tests
```typescript
// example.e2e-spec.ts
describe('ExampleController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/examples (POST)', () => {
    return request(app.getHttpServer())
      .post('/examples')
      .send({ name: 'Test' })
      .expect(201);
  });
});
```

## Database Guidelines

### 1. Migration Best Practices
```typescript
// migrations/timestamp-CreateExampleTable.ts
export class CreateExampleTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'examples',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('examples');
  }
}
```

### 2. Entity Relationships
```typescript
// One-to-Many
@OneToMany(() => Task, task => task.project)
tasks: Task[];

// Many-to-One
@ManyToOne(() => Project, project => project.tasks)
@JoinColumn({ name: 'project_id' })
project: Project;

// Many-to-Many
@ManyToMany(() => Technology, technology => technology.projects)
@JoinTable({
  name: 'project_technologies',
  joinColumn: { name: 'project_id' },
  inverseJoinColumn: { name: 'technology_id' },
})
technologies: Technology[];
```

## Security Guidelines

### 1. Authentication
```typescript
// Protect routes with guards
@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {}

// Role-based access
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Get('admin-only')
adminOnlyEndpoint() {}
```

### 2. Input Validation
```typescript
// Always validate input
@Post()
create(@Body() dto: CreateUserDto) {
  // DTO validation happens automatically
  return this.userService.create(dto);
}

// Custom validation pipes
@Get(':id')
findOne(@Param('id', UuidValidationPipe) id: string) {
  return this.userService.findOne(id);
}
```

## Performance Guidelines

### 1. Database Queries
```typescript
// Use select to limit fields
const users = await this.userRepository.find({
  select: ['id', 'email', 'firstName'],
});

// Use relations efficiently
const user = await this.userRepository.findOne({
  where: { id },
  relations: ['profile', 'roles'],
});

// Use query builder for complex queries
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .where('user.isActive = :active', { active: true })
  .getMany();
```

### 2. Caching (Future Implementation)
```typescript
// Cache frequently accessed data
@Injectable()
export class UserService {
  @Cacheable('users', 300) // 5 minutes
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
```

## Debugging

### 1. Logging
```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  async create(dto: CreateExampleDto): Promise<Example> {
    this.logger.log(`Creating example: ${dto.name}`);
    // ... implementation
  }
}
```

### 2. Environment Variables
```typescript
// Use configuration service
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

const dbHost = this.configService.get<string>('DB_HOST');
```

## Common Issues & Solutions

### 1. Migration Issues
```bash
# If migration fails, check:
# 1. Database connection
# 2. Migration file syntax
# 3. Existing data conflicts

# Reset database (development only)
npm run migration:revert
npm run migration:run
```

### 2. Import Errors
```typescript
// Use absolute imports from src
import { User } from 'src/modules/users/entities/user.entity';

// Not relative imports for cross-module dependencies
// import { User } from '../../../users/entities/user.entity'; // ❌
```

### 3. Circular Dependencies
```typescript
// Use forwardRef for circular dependencies
@Module({
  imports: [forwardRef(() => UserModule)],
})
export class ProfileModule {}
```

## Deployment Checklist

### Development
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] All tests passing
- [ ] Swagger documentation accessible

### Production
- [ ] Environment variables secured
- [ ] Database backup strategy
- [ ] SSL certificates configured
- [ ] Monitoring and logging setup
- [ ] Performance optimization applied

## Team Communication

### Code Reviews
- Create feature branches for new development
- Submit pull requests with clear descriptions
- Review code for standards compliance
- Test functionality before approval

### Issue Tracking
- Use descriptive commit messages
- Reference issue numbers in commits
- Update project status regularly
- Document any breaking changes

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Swagger/OpenAPI](https://swagger.io/)