const fs = require('fs');
const path = require('path');

// Define role mappings for different modules
const roleMapping = {
  // HR modules
  'employees': ['ADMIN', 'PROJECT_MANAGER'],
  'skills': ['ADMIN', 'PROJECT_MANAGER'],
  'employee-skills': ['ADMIN', 'PROJECT_MANAGER'],
  
  // Project management
  'projects': ['ADMIN', 'PROJECT_MANAGER', 'CLIENT'],
  'project-members': ['ADMIN', 'PROJECT_MANAGER'],
  'project-milestones': ['ADMIN', 'PROJECT_MANAGER', 'CLIENT'],
  'project-updates': ['ADMIN', 'PROJECT_MANAGER', 'CLIENT'],
  'project-technologies': ['ADMIN', 'PROJECT_MANAGER'],
  'tasks': ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'],
  'task-comments': ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'],
  'time-entries': ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'],
  
  // CRM
  'clients': ['ADMIN'],
  'client-notes': ['ADMIN', 'PROJECT_MANAGER'],
  'client-interactions': ['ADMIN', 'PROJECT_MANAGER'],
  'client-approvals': ['ADMIN', 'PROJECT_MANAGER', 'CLIENT'],
  'leads': ['ADMIN', 'PROJECT_MANAGER'],
  'contact-inquiries': ['ADMIN', 'PROJECT_MANAGER'],
  
  // Billing
  'invoices': ['ADMIN', 'PROJECT_MANAGER'],
  'invoice-items': ['ADMIN', 'PROJECT_MANAGER'],
  'payments': ['ADMIN', 'PROJECT_MANAGER'],
  'client-plan-quotations': ['ADMIN', 'PROJECT_MANAGER', 'CLIENT'],
  
  // Development
  'services': ['ADMIN'],
  'development-plans': ['ADMIN', 'PROJECT_MANAGER'],
  'plan-features': ['ADMIN'],
  'development-plan-features': ['ADMIN'],
  'development-plan-services': ['ADMIN'],
  'development-plan-technologies': ['ADMIN'],
  
  // Technology
  'technology': ['ADMIN', 'PROJECT_MANAGER'],
  
  // Support
  'support-tickets': ['ADMIN', 'SUPPORT', 'CLIENT'],
  
  // Messaging
  'messaging': ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE', 'CLIENT'],
  
  // Content
  'categories': ['ADMIN'],
  'blog-posts': ['ADMIN'],
  'blog-comments': ['ADMIN'],
  'questions': ['ADMIN'],
  'answers': ['ADMIN'],
  'case-studies': ['ADMIN'],
  'testimonials': ['ADMIN'],
};

// Function to get controller files recursively
function getControllerFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getControllerFiles(fullPath));
    } else if (item.endsWith('.controller.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to update controller file
function updateController(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has proper imports
  if (content.includes('UuidValidationPipe') && content.includes('@Roles(')) {
    console.log(`Skipping ${filePath} - already updated`);
    return;
  }
  
  // Add imports if not present
  if (!content.includes('UuidValidationPipe')) {
    const importIndex = content.lastIndexOf("} from '@nestjs/common';");
    if (importIndex !== -1) {
      const beforeImport = content.substring(0, importIndex + "} from '@nestjs/common';".length);
      const afterImport = content.substring(importIndex + "} from '@nestjs/common';".length);
      
      const newImports = `
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleEnum } from '../../roles/role.enum';
import { UuidValidationPipe } from '../../../common/pipes/uuid-validation.pipe';`;
      
      content = beforeImport + afterImport + newImports;
    }
  }
  
  // Update route methods
  content = content.replace(
    /@Get\(':id'\)\s*\n\s*(\w+)\(@Param\('id'\)\s+id:\s+string\)/g,
    "@Get(':id')\n  @Roles(RoleEnum.ADMIN, RoleEnum.PROJECT_MANAGER)\n  $1(@Param('id', UuidValidationPipe) id: string)"
  );
  
  content = content.replace(
    /@Patch\(':id'\)\s*\n\s*(\w+)\(@Param\('id'\)\s+id:\s+string/g,
    "@Patch(':id')\n  @Roles(RoleEnum.ADMIN)\n  $1(@Param('id', UuidValidationPipe) id: string"
  );
  
  content = content.replace(
    /@Delete\(':id'\)\s*\n\s*(\w+)\(@Param\('id'\)\s+id:\s+string/g,
    "@Delete(':id')\n  @Roles(RoleEnum.ADMIN)\n  $1(@Param('id', UuidValidationPipe) id: string"
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Main execution
const srcDir = path.join(__dirname, 'src', 'modules');
const controllerFiles = getControllerFiles(srcDir);

console.log(`Found ${controllerFiles.length} controller files`);

controllerFiles.forEach(updateController);

console.log('Controller update completed');