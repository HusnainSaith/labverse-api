import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Role } from '../src/modules/roles/entities/role.entity';
import { Permission } from '../src/modules/roles/entities/permission.entity';
import { RolePermission } from '../src/modules/roles/entities/role-permission.entity';
import { RoleEnum } from '../src/modules/roles/role.enum';
import { PermissionActionEnum } from '../src/common/enums/permission-actions.enum';

// Define features with their specific available actions
const FEATURE_PERMISSIONS = {
  users: {
    description: 'User management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.IMPORT,
      PermissionActionEnum.ASSIGN, // Assign roles/permissions
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.RESTORE,
    ],
  },

  roles: {
    description: 'Role management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN, // Assign permissions to roles
      PermissionActionEnum.MANAGE,
    ],
  },

  permissions: {
    description: 'Permission management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  clients: {
    description: 'Client management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.IMPORT,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.RESTORE,
    ],
  },

  employees: {
    description: 'Employee management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.ARCHIVE,
    ],
  },

  skills: {
    description: 'Skills management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  'employee-skills': {
    description: 'Employee skills assignment',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
    ],
  },

  projects: {
    description: 'Project management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.RESTORE,
      PermissionActionEnum.ASSIGN, // Assign team members
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.REPORT,
      PermissionActionEnum.ANALYZE,
    ],
  },

  'project-members': {
    description: 'Project team member management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.UNASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.MANAGE,
    ],
  },

  'project-milestones': {
    description: 'Project milestone management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.REPORT,
    ],
  },

  'project-updates': {
    description: 'Project updates management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
    ],
  },

  tasks: {
    description: 'Task management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.UNASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.EXPORT,
    ],
  },

  'task-comments': {
    description: 'Task comments system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
    ],
  },

  'time-entries': {
    description: 'Time tracking system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.REPORT,
      PermissionActionEnum.ANALYZE,
      PermissionActionEnum.APPROVE,
    ],
  },

  services: {
    description: 'Service management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.EXPORT,
    ],
  },

  'development-plans': {
    description: 'Development plans management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.EXPORT,
    ],
  },

  'plan-features': {
    description: 'Plan features management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.MANAGE,
    ],
  },

  'development-plan-features': {
    description: 'Development plan features assignment',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  'development-plan-services': {
    description: 'Development plan services assignment',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  'development-plan-technologies': {
    description: 'Development plan technologies assignment',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  technologies: {
    description: 'Technology management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.ARCHIVE,
    ],
  },

  'client-notes': {
    description: 'Client notes management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.EXPORT,
    ],
  },

  'client-approvals': {
    description: 'Client approval management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.MANAGE,
    ],
  },

  leads: {
    description: 'Lead management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.IMPORT,
      PermissionActionEnum.CONVERT, // Convert lead to client
    ],
  },

  'contact-inquiries': {
    description: 'Contact inquiry management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.RESPOND, // Respond to inquiry
    ],
  },

  invoices: {
    description: 'Invoice management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH, // Send invoice
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.REPORT,
      PermissionActionEnum.ANALYZE,
    ],
  },

  payments: {
    description: 'Payment management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.REPORT,
      PermissionActionEnum.ANALYZE,
    ],
  },

  'client-plan-quotations': {
    description: 'Client plan quotation management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.EXPORT,
    ],
  },

  'support-tickets': {
    description: 'Support ticket system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.RESOLVE, // Resolve ticket
      PermissionActionEnum.CLOSE, // Close ticket
      PermissionActionEnum.ESCALATE, // Escalate ticket
    ],
  },

  categories: {
    description: 'Category management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.MANAGE,
    ],
  },

  questions: {
    description: 'Question management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.VIEW_ALL,
    ],
  },

  answers: {
    description: 'Answer management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.VIEW_ALL,
    ],
  },

  'blog-posts': {
    description: 'Blog post management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.MANAGE,
    ],
  },

  testimonials: {
    description: 'Testimonial management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.MANAGE,
    ],
  },

  'case-studies': {
    description: 'Case study management system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.PUBLISH,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.EXPORT,
    ],
  },

  // System-level permissions
  system: {
    description: 'System administration',
    actions: [
      PermissionActionEnum.CONFIGURE,
      PermissionActionEnum.BACKUP,
      PermissionActionEnum.RESTORE_BACKUP,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.MONITOR, // System monitoring
      PermissionActionEnum.AUDIT, // Audit logs
    ],
  },

  // Reporting and analytics
  reports: {
    description: 'Reporting and analytics system',
    actions: [
      PermissionActionEnum.READ,
      PermissionActionEnum.CREATE,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.REPORT,
      PermissionActionEnum.ANALYZE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.CONFIGURE,
    ],
  },

  // Dashboard permissions
  dashboard: {
    description: 'Dashboard access and management',
    actions: [
      PermissionActionEnum.READ,
      PermissionActionEnum.CONFIGURE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_TEAM,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.ANALYZE,
    ],
  },
};

export async function seedPermissions() {
  await AppDataSource.initialize();

  const permissionRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);
  const rolePermissionRepo = AppDataSource.getRepository(RolePermission);

  console.log('🌱 Starting comprehensive permissions seeding...');

  // Clear existing permissions first
  console.log('🧹 Clearing existing permissions...');
  await rolePermissionRepo.delete({});
  await permissionRepo.delete({});

  const allPermissions = [];
  let totalPermissionsCreated = 0;

  // Create permissions for each feature
  for (const [feature, config] of Object.entries(FEATURE_PERMISSIONS)) {
    console.log(`\n📋 Processing feature: ${feature}`);
    console.log(`   Description: ${config.description}`);
    console.log(`   Actions: ${config.actions.length}`);

    const featurePermissions = [];

    for (const action of config.actions) {
      const permissionName = `${feature.toUpperCase().replace(/-/g, '_')}_${action.toUpperCase()}`;

      const permission = permissionRepo.create({
        name: permissionName,
        description: `${action} permission for ${feature} - ${config.description}`,
        resource: feature,
        action: action,
      });

      const savedPermission = await permissionRepo.save(permission);
      allPermissions.push(savedPermission);
      featurePermissions.push(savedPermission);
      totalPermissionsCreated++;

      console.log(`   ✅ ${permissionName}`);
    }

    console.log(
      `   🎯 Created ${featurePermissions.length} permissions for ${feature}`,
    );
  }

  console.log(`\n🎉 Total permissions created: ${totalPermissionsCreated}`);

  // Assign ALL permissions to ADMIN role
  console.log('\n👑 Assigning permissions to ADMIN role...');
  const adminRole = await roleRepo.findOne({
    where: { name: RoleEnum.ADMIN },
  });

  if (adminRole) {
    let adminPermissionsAssigned = 0;

    for (const permission of allPermissions) {
      const rolePermission = rolePermissionRepo.create({
        roleId: adminRole.id,
        permissionId: permission.id,
      });

      await rolePermissionRepo.save(rolePermission);
      adminPermissionsAssigned++;
    }

    console.log(
      `🔥 Assigned ${adminPermissionsAssigned} permissions to ADMIN role`,
    );
  } else {
    console.log(
      '⚠️  ADMIN role not found. Please ensure roles are seeded first.',
    );
  }

  // Summary by feature
  console.log('\n📊 PERMISSION SUMMARY BY FEATURE:');
  console.log('='.repeat(50));

  Object.entries(FEATURE_PERMISSIONS).forEach(([feature, config]) => {
    console.log(
      `${feature.padEnd(25)} | ${config.actions.length.toString().padStart(2)} actions`,
    );
  });

  console.log('='.repeat(50));
  console.log(`TOTAL FEATURES: ${Object.keys(FEATURE_PERMISSIONS).length}`);
  console.log(`TOTAL PERMISSIONS: ${totalPermissionsCreated}`);

  await AppDataSource.destroy();
  console.log('\n🎉 Comprehensive permissions seeding completed successfully!');
}

// Run if called directly
if (require.main === module) {
  seedPermissions().catch((error) => {
    console.error('❌ Error seeding permissions:', error);
    process.exit(1);
  });
}
