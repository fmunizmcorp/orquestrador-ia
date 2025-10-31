#!/usr/bin/env python3
"""
Script para corrigir automaticamente erros TypeScript repetitivos
"""
import re
import sys
from pathlib import Path

def fix_returning_insert(content):
    """Fix .returning() after insert operations"""
    # Pattern: const [var] = await db.insert(table).values({...}).returning();
    pattern = r'const \[(\w+)\] = await db\.insert\((\w+)\)\.values\((.*?)\)\.returning\(\);'
    
    def replacement(match):
        var_name = match.group(1)
        table = match.group(2)
        values = match.group(3)
        
        return f'''const result: any = await db.insert({table}).values({values});
      const {var_name}Id = result[0]?.insertId || result.insertId;
      const [{var_name}] = await db.select().from({table}).where(eq({table}.id, {var_name}Id)).limit(1);'''
    
    return re.sub(pattern, replacement, content, flags=re.DOTALL)

def fix_returning_update(content):
    """Fix .returning() after update operations"""
    # Pattern: const [var] = await db.update(table).set(...).where(...).returning();
    pattern = r'const \[(\w+)\] = await db\.update\((\w+)\)\s*\.set\((.*?)\)\s*\.where\((.*?)\)\s*\.returning\(\);'
    
    def replacement(match):
        var_name = match.group(1)
        table = match.group(2)
        set_clause = match.group(3)
        where_clause = match.group(4)
        
        return f'''await db.update({table}).set({set_clause}).where({where_clause});
      const [{var_name}] = await db.select().from({table}).where({where_clause}).limit(1);'''
    
    return re.sub(pattern, replacement, content, flags=re.DOTALL)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_typescript_errors.py <file_path>")
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    
    if not file_path.exists():
        print(f"Error: File {file_path} not found")
        sys.exit(1)
    
    print(f"Processing {file_path}...")
    
    content = file_path.read_text()
    original = content
    
    # Apply fixes
    content = fix_returning_insert(content)
    content = fix_returning_update(content)
    
    if content != original:
        file_path.write_text(content)
        print(f"✅ Fixed {file_path}")
    else:
        print(f"No changes needed in {file_path}")

if __name__ == "__main__":
    main()
