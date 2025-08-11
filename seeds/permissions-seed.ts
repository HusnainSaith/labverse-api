import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Role } from '../src/modules/roles/entities/role.entity';
import { Permission } from '../src/modules/permissions/entities/permission.entity';
import { RolePermission } from '../src/modules/role-permissions/entities/role-permission.entity';
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
      PermissionActionEnum.ASSIGN, 
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

  messaging: {
    description: 'Messaging system',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.MANAGE,
      PermissionActionEnum.EXPORT,
    ],
  },

  'blog-comments': {
    description: 'Blog comments management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.APPROVE,
      PermissionActionEnum.REJECT,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.MANAGE,
    ],
  },

  'project-technologies': {
    description: 'Project technologies management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.MANAGE,
    ],
  },

  'invoice-items': {
    description: 'Invoice items management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.EXPORT,
      PermissionActionEnum.VIEW_ALL,
    ],
  },

  'employee-profiles': {
    description: 'Employee profile management',
    actions: [
      PermissionActionEnum.CREATE,
      PermissionActionEnum.READ,
      PermissionActionEnum.UPDATE,
      PermissionActionEnum.DELETE,
      PermissionActionEnum.VIEW_ALL,
      PermissionActionEnum.VIEW_OWN,
      PermissionActionEnum.ASSIGN,
      PermissionActionEnum.ARCHIVE,
      PermissionActionEnum.RESTORE,
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
  try {
    console.log('Starting permissions seeding...');

    const roleRepo = AppDataSource.getRepository(Role);
    const permissionRepo = AppDataSource.getRepository(Permission);
    const rolePermissionRepo = AppDataSource.getRepository(RolePermission);

    console.log('🧹 Clearing existing permissions and role-permissions...');
    await rolePermissionRepo.query('TRUNCATE TABLE role_permissions CASCADE;');
    await permissionRepo.query('TRUNCATE TABLE permissions CASCADE;');

    console.log('🔍 Fetching roles...');
    const adminRole = await roleRepo.findOneBy({ name: RoleEnum.ADMIN });
    const clientRole = await roleRepo.findOneBy({ name: RoleEnum.CLIENT });
    const employeeRole = await roleRepo.findOneBy({ name: RoleEnum.EMPLOYEE });
    const supportRole = await roleRepo.findOneBy({ name: RoleEnum.SUPPORT }); // Don't forget to fetch the support role.
    const managerRole = await roleRepo.findOneBy({ name: RoleEnum.PROJECT_MANAGER });
    
    // Check if roles exist
    if (!adminRole || !clientRole || !employeeRole || !supportRole || !managerRole) {
      throw new Error('❌ One or more roles not found. Please ensure the main seed script runs correctly first.');
    }

    console.log('📜 Defining permissions...');
    const allPermissions = [];
    // ... (your permission creation logic) ...
    for (const resourceName in FEATURE_PERMISSIONS) {
      if (Object.prototype.hasOwnProperty.call(FEATURE_PERMISSIONS, resourceName)) {
        const feature = FEATURE_PERMISSIONS[resourceName];
        for (const action of feature.actions) {
          const permission = new Permission();
          permission.name = `${resourceName}.${action}`;
          permission.description = `${feature.description} - ${action}`;
          permission.resource = resourceName;
          permission.action = action;
          allPermissions.push(permission);
        }
      }
    }
    
    console.log('💾 Saving permissions...');
    const savedPermissions = await permissionRepo.save(allPermissions);

    console.log('🔗 Linking permissions to roles...');
    const rolePermissions = [
        ...savedPermissions.map((perm) => ({
            roleId: adminRole.id,
            permissionId: perm.id,
        })),
        ...savedPermissions
        .filter((perm) => perm.resource === 'projects' && perm.action === PermissionActionEnum.READ)
        .map((perm) => ({
            roleId: clientRole.id,
            permissionId: perm.id,
        })),
        ...savedPermissions
        .filter(
            (perm) =>
            (perm.resource === 'tasks' && (perm.action === PermissionActionEnum.READ || perm.action === PermissionActionEnum.VIEW_OWN)) ||
            (perm.resource === 'time-entries' && perm.action === PermissionActionEnum.CREATE)
        )
        .map((perm) => ({
            roleId: employeeRole.id,
            permissionId: perm.id,
        })),
        // Add more permissions for other roles if needed
    ];

    await rolePermissionRepo.save(rolePermissionRepo.create(rolePermissions));

    console.log('✅ Permissions and role-permissions seeded successfully!');
  } catch (err) {
    // You can remove the process.exit here since the main script handles it.
    throw new Error(`❌ Error seeding permissions: ${err.message}`);
  }
}
