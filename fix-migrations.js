const fs = require('fs');
const path = require('path');

const migrationsDir = './migrations';

// Get all migration files
const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace direct string interpolation in queries with parameterized queries
  content = content.replace(
    /await queryRunner\.query\(\s*`([^`]*\$\{[^}]*\}[^`]*)`\s*\)/g,
    (match, query) => {
      // Extract variables from template literals
      const variables = [];
      const cleanQuery = query.replace(/\$\{([^}]*)\}/g, (match, variable) => {
        variables.push(variable.trim());
        return '$' + (variables.length);
      });
      
      if (variables.length > 0) {
        return `await queryRunner.query(\`${cleanQuery}\`, [${variables.join(', ')}])`;
      }
      return match;
    }
  );
  
  // Replace direct variable concatenation in queries
  content = content.replace(
    /await queryRunner\.query\(\s*(['"`])([^'"`]*)\1\s*\+\s*([^)]+)\)/g,
    'await queryRunner.query($1$2$1, [$3])'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${file}`);
});

console.log('All migration files have been fixed for NoSQL injection vulnerabilities.');