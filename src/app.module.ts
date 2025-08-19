import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from './config/database.config';
import { ServicesModule } from './modules/services/services.module';
import { DevelopmentPlansModule } from './modules/development/development-plans/development-plans.module';
import { PlanFeaturesModule } from './modules/plan-features/plan-features.module';
import { DevelopmentPlanFeaturesModule } from './modules/development/development-plan-features/development-plan-features.module';
import { DevelopmentPlanServicesModule } from './modules/development/development-plan-services/development-plan-services.module';
import { DevelopmentPlanTechnologiesModule } from './modules/development/development-plan-technologies/development-plan-technologies.module';
import { ClientPlanQuotationsModule } from './modules/client-plan-quotations/client-plan-quotations.module';
import { InvoicesModule } from './modules/billing/invoices/invoices.module';
import { InvoiceItemsModule } from './modules/billing/invoice-items/invoice-items.module';
import { PaymentsModule } from './modules/billing/payments/payments.module';
import { EmployeeProfilesModule } from './modules/hr/employees/employee.module';
import { TechnologiesModule } from './modules/technology/technology.module';
import { ProjectMembersModule } from './modules/project-management/project-members/project-member.module';
import { ProjectsModule } from './modules/project-management/projects/projects.module';
import { ProjectTechnologiesModule } from './modules/project-management/project-technologies/project-technology.module';
import { SkillsModule } from './modules/hr/skills/skills.module';
import { EmployeeSkillsModule } from './modules/hr/employee-skills/employee-skills.module';
import { ProjectMilestoneModule } from './modules/project-management/project-milestones/project-milestones.module';
import { ProjectUpdatesModule } from './modules/project-management/project-updates/project-updates.module';
import { TaskCommentModule } from './modules/project-management/tasks/task-comments.module';
import { TaskModule } from './modules/project-management/tasks/tasks.module';
import { TimeEntryModule } from './modules/project-management/time-entries/time-entries.module';
import { ClientsModule } from './modules/crm/clients/clients.module';
import { ClientApprovalsModule } from './modules/crm/client-approvals/client-approvals.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { CategoriesModule } from './modules/content/categories/categories.module';
import { ClientNotesModule } from './modules/crm/client-notes/client-notes.module';
import { ClientInteractionsModule } from './modules/crm/client-interactions/client-interactions.module';
import { LeadsModule } from './modules/crm/leads/leads.module';
import { BlogPostsModule } from './modules/content/blog-posts/blog-posts.module';
import { BlogCommentsModule } from './modules/content/blog-comments/blog-comments.module';
import { QuestionsModule } from './modules/content/questions/questions.module';
import { AnswersModule } from './modules/content/answers/answers.module';
import { CaseStudiesModule } from './modules/content/case-studies/case-studies.module';
import { TestimonialsModule } from './modules/content/testimonials/testimonials.module';
import { ContactInquiriesModule } from './modules/crm/contact-inquiries/contact-inquiries.module';
import { PermissionsModule } from './modules/permissions/permissions.module';

// Global Guards and Interceptors

import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './modules/shared/shared.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: databaseConfig,
    // }),
    // Core Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000), // 1 minute
            limit: config.get<number>('THROTTLE_LIMIT', 100), // 100 requests
          },
        ],
      }),
    }),
    SharedModule,
    UsersModule,
    RolesModule,
    AuthModule,
    EmployeeProfilesModule,
    ClientsModule,
    SkillsModule,
    EmployeeSkillsModule,
    TechnologiesModule,
    ProjectMilestoneModule,
    ProjectUpdatesModule,
    TaskCommentModule,
    TaskModule,
    TimeEntryModule,
    ProjectMembersModule,
    ProjectsModule,
    ProjectTechnologiesModule,
    ServicesModule,
    DevelopmentPlansModule,
    PlanFeaturesModule,
    DevelopmentPlanFeaturesModule,
    DevelopmentPlanServicesModule,
    DevelopmentPlanTechnologiesModule,
    ClientPlanQuotationsModule,
    InvoicesModule,
    InvoiceItemsModule,
    PaymentsModule,
    SupportTicketsModule,
    MessagingModule,
    ClientApprovalsModule,
    CategoriesModule,
    ClientNotesModule,
    ClientInteractionsModule,
    LeadsModule,
    BlogPostsModule,
    BlogCommentsModule,
    QuestionsModule,
    AnswersModule,
    CaseStudiesModule,
    TestimonialsModule,
    ContactInquiriesModule,
    PermissionsModule,
    RolePermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // Global Authentication Guard (Optional - Uncomment if needed)
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },

    // Global Roles Guard (Optional - Uncomment if needed)
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },

    // Global Permissions Guard (Optional - Uncomment if needed)
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },

    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    // Global Exception Filters
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
