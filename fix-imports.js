#!/usr/bin/env node
/**
 * Fix ESM imports - Add .js extensions to all relative imports
 * TypeScript compiler doesn't preserve .js extensions in output
 * This script fixes that issue automatically
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist', 'server');

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex para encontrar imports relativos sem extensão .js
  // Captura: from '../path' ou from "../../path"
  const fixedContent = content.replace(
    /from\s+['"](\.[^'"]+?)(?<!\.js)['"]/g,
    (match, importPath) => {
      // Já tem .js - não fazer nada
      if (importPath.endsWith('.js')) {
        return match;
      }
      
      // Simplesmente adicionar .js
      return `from '${importPath}.js'`;
    }
  );
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return true;
  }
  
  return false;
}

function walkDirectory(dir) {
  let filesFixed = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      filesFixed += walkDirectory(filePath);
    } else if (file.endsWith('.js')) {
      if (fixImportsInFile(filePath)) {
        filesFixed++;
        console.log(`✅ Fixed: ${path.relative(distDir, filePath)}`);
      }
    }
  }
  
  return filesFixed;
}

console.log('🔧 Fixing ESM imports in dist/server...\n');
const totalFixed = walkDirectory(distDir);
console.log(`\n✅ Fixed ${totalFixed} files with missing .js extensions`);
