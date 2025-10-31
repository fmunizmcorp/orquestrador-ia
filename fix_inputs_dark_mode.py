#!/usr/bin/env python3
"""
Script para corrigir dark mode em inputs, textareas e selects
Adiciona classes dark: para todos os campos de formulário
"""

import os
import re

def fix_input_fields(content):
    """
    Corrige inputs, textareas e selects para suportar dark mode
    """
    
    # Padrão 1: input com className que não tem dark:bg
    pattern1 = r'<input\s+([^>]*?)className="([^"]*?)"([^>]*?)/?>'
    
    def replace_input(match):
        before = match.group(1)
        classes = match.group(2)
        after = match.group(3)
        
        # Se já tem dark:, não mexer
        if 'dark:' in classes:
            return match.group(0)
        
        # Adicionar classes dark mode
        new_classes = classes
        
        # Background
        if 'bg-white' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-white', 'bg-white dark:bg-gray-700')
        elif 'bg-gray-50' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-gray-50', 'bg-gray-50 dark:bg-gray-800')
        elif 'bg-' not in new_classes:
            new_classes += ' bg-white dark:bg-gray-700'
        
        # Text color
        if 'text-gray-900' in classes and 'dark:text-' not in classes:
            new_classes = new_classes.replace('text-gray-900', 'text-gray-900 dark:text-white')
        elif 'text-gray-700' in classes and 'dark:text-' not in classes:
            new_classes = new_classes.replace('text-gray-700', 'text-gray-700 dark:text-gray-200')
        elif 'text-gray-' in classes and 'dark:text-' not in classes:
            # Adicionar dark:text-white se tem algum text-gray
            new_classes += ' dark:text-white'
        elif 'text-' not in new_classes:
            new_classes += ' text-gray-900 dark:text-white'
        
        # Border
        if 'border-gray-300' in classes and 'dark:border-' not in classes:
            new_classes = new_classes.replace('border-gray-300', 'border-gray-300 dark:border-gray-600')
        elif 'border' in classes and 'dark:border-' not in classes:
            new_classes += ' dark:border-gray-600'
        
        # Placeholder
        if 'placeholder-' in classes and 'dark:placeholder-' not in classes:
            new_classes += ' dark:placeholder-gray-400'
        
        return f'<input {before}className="{new_classes}"{after}>'
    
    content = re.sub(pattern1, replace_input, content)
    
    # Padrão 2: textarea
    pattern2 = r'<textarea\s+([^>]*?)className="([^"]*?)"([^>]*?)>'
    
    def replace_textarea(match):
        before = match.group(1)
        classes = match.group(2)
        after = match.group(3)
        
        if 'dark:' in classes:
            return match.group(0)
        
        new_classes = classes
        
        if 'bg-white' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-white', 'bg-white dark:bg-gray-700')
        elif 'bg-gray-50' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-gray-50', 'bg-gray-50 dark:bg-gray-800')
        elif 'bg-' not in new_classes:
            new_classes += ' bg-white dark:bg-gray-700'
        
        if 'text-gray-900' in classes and 'dark:text-' not in classes:
            new_classes = new_classes.replace('text-gray-900', 'text-gray-900 dark:text-white')
        elif 'text-' not in new_classes:
            new_classes += ' text-gray-900 dark:text-white'
        
        if 'border-gray-300' in classes and 'dark:border-' not in classes:
            new_classes = new_classes.replace('border-gray-300', 'border-gray-300 dark:border-gray-600')
        
        return f'<textarea {before}className="{new_classes}"{after}>'
    
    content = re.sub(pattern2, replace_textarea, content)
    
    # Padrão 3: select
    pattern3 = r'<select\s+([^>]*?)className="([^"]*?)"([^>]*?)>'
    
    def replace_select(match):
        before = match.group(1)
        classes = match.group(2)
        after = match.group(3)
        
        if 'dark:' in classes:
            return match.group(0)
        
        new_classes = classes
        
        if 'bg-white' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-white', 'bg-white dark:bg-gray-700')
        elif 'bg-gray-50' in classes and 'dark:bg-' not in classes:
            new_classes = new_classes.replace('bg-gray-50', 'bg-gray-50 dark:bg-gray-800')
        elif 'bg-' not in new_classes:
            new_classes += ' bg-white dark:bg-gray-700'
        
        if 'text-gray-900' in classes and 'dark:text-' not in classes:
            new_classes = new_classes.replace('text-gray-900', 'text-gray-900 dark:text-white')
        elif 'text-' not in new_classes:
            new_classes += ' text-gray-900 dark:text-white'
        
        if 'border-gray-300' in classes and 'dark:border-' not in classes:
            new_classes = new_classes.replace('border-gray-300', 'border-gray-300 dark:border-gray-600')
        
        return f'<select {before}className="{new_classes}"{after}>'
    
    content = re.sub(pattern3, replace_select, content)
    
    return content

def process_file(filepath):
    """Processa um arquivo TSX"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = fix_input_fields(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False

def main():
    """Processa todos os arquivos"""
    base_dir = 'client/src'
    files_to_process = []
    
    # Encontrar todos os arquivos .tsx
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx'):
                files_to_process.append(os.path.join(root, file))
    
    print(f"Encontrados {len(files_to_process)} arquivos .tsx")
    
    modified_count = 0
    for filepath in files_to_process:
        if process_file(filepath):
            modified_count += 1
            print(f"✓ Modificado: {filepath}")
    
    print(f"\n✅ Concluído! {modified_count} arquivos modificados")

if __name__ == '__main__':
    main()
