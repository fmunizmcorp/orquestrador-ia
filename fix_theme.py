#!/usr/bin/env python3
"""
Script para corrigir classes Tailwind para suportar tema dark
Orquestrador V3.1
"""

import os
import re
from pathlib import Path

# Padrões de substituição
REPLACEMENTS = {
    r'className="([^"]*)\bbg-white\b([^"]*)"': lambda m: f'className="{m.group(1)}bg-white dark:bg-gray-800{m.group(2)}"',
    r'className="([^"]*)\btext-gray-900\b([^"]*)"': lambda m: f'className="{m.group(1)}text-gray-900 dark:text-white{m.group(2)}"',
    r'className="([^"]*)\btext-gray-800\b([^"]*)"': lambda m: f'className="{m.group(1)}text-gray-800 dark:text-gray-100{m.group(2)}"',
    r'className="([^"]*)\btext-gray-700\b([^"]*)"': lambda m: f'className="{m.group(1)}text-gray-700 dark:text-gray-200{m.group(2)}"',
    r'className="([^"]*)\btext-gray-600\b([^"]*)"': lambda m: f'className="{m.group(1)}text-gray-600 dark:text-gray-300{m.group(2)}"',
    r'className="([^"]*)\btext-gray-500\b([^"]*)"': lambda m: f'className="{m.group(1)}text-gray-500 dark:text-gray-400{m.group(2)}"',
    r'className="([^"]*)\bbg-gray-50\b([^"]*)"': lambda m: f'className="{m.group(1)}bg-gray-50 dark:bg-gray-900{m.group(2)}"',
    r'className="([^"]*)\bbg-gray-100\b([^"]*)"': lambda m: f'className="{m.group(1)}bg-gray-100 dark:bg-gray-800{m.group(2)}"',
    r'className="([^"]*)\bborder-gray-200\b([^"]*)"': lambda m: f'className="{m.group(1)}border-gray-200 dark:border-gray-700{m.group(2)}"',
    r'className="([^"]*)\bborder-gray-300\b([^"]*)"': lambda m: f'className="{m.group(1)}border-gray-300 dark:border-gray-600{m.group(2)}"',
}

def fix_file(filepath):
    """Corrige um arquivo adicionando classes dark: quando necessário"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        for pattern, replacement in REPLACEMENTS.items():
            # Só aplica se ainda não tem dark: na mesma className
            matches = list(re.finditer(pattern, content))
            for match in matches:
                class_str = match.group(0)
                # Verifica se já tem dark: nessa className
                if 'dark:' not in class_str:
                    new_class = replacement(match)
                    content = content.replace(class_str, new_class, 1)
                    modified = True
        
        if modified and content != original_content:
            # Salvar backup
            backup_path = str(filepath) + '.bak'
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original_content)
            
            # Salvar arquivo corrigido
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
        
        return False
        
    except Exception as e:
        print(f"  ❌ Erro ao processar {filepath}: {e}")
        return False

def main():
    print("🔧 Corrigindo tema dark/light nas páginas TSX...")
    print("")
    
    # Diretórios para processar
    dirs_to_process = [
        'client/src/pages',
        'client/src/components',
    ]
    
    total_modified = 0
    
    for dir_path in dirs_to_process:
        if not os.path.exists(dir_path):
            continue
            
        print(f"📁 Processando: {dir_path}")
        
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.tsx'):
                    filepath = Path(root) / file
                    if fix_file(filepath):
                        print(f"  ✅ {filepath}")
                        total_modified += 1
    
    print("")
    print("=" * 60)
    print(f"✅ Correção concluída!")
    print(f"📊 Arquivos modificados: {total_modified}")
    print("")
    print("💡 Dica: Backups salvos em *.bak")
    print("=" * 60)

if __name__ == '__main__':
    main()
