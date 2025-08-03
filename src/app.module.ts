import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { ProjectUpdateModule } from './modules/project-management/project-updates/project-updates.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    EmployeeProfilesModule,
    ClientsModule,
    SkillsModule,
    EmployeeSkillsModule,
    TechnologiesModule,
    ProjectMilestoneModule,
    ProjectUpdateModule,
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
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
