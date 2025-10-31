#!/usr/bin/env python3
"""
Script completo para corrigir TODOS os formulários com dark mode
Processa TODOS os arquivos .tsx e garante visibilidade em dark mode
"""

import os
import re
from pathlib import Path

# Classes necessárias para dark mode em inputs
DARK_MODE_CLASSES = {
    'bg': 'bg-white dark:bg-gray-700',
    'text': 'text-gray-900 dark:text-white',
    'border': 'border-gray-300 dark:border-gray-600',
    'placeholder': 'placeholder-gray-400 dark:placeholder-gray-500',
    'focus': 'focus:border-blue-500 dark:focus:border-blue-400',
    'disabled': 'disabled:bg-gray-100 dark:disabled:bg-gray-800',
}

def has_dark_mode_classes(class_string):
    """Verifica se já tem classes dark mode"""
    return 'dark:' in class_string

def add_dark_mode_to_classes(class_string):
    """Adiciona classes dark mode ao className existente"""
    if has_dark_mode_classes(class_string):
        return class_string
    
    classes = class_string.split()
    new_classes = []
    
    # Adicionar classes dark mode
    has_bg = any('bg-' in c for c in classes)
    has_text = any('text-' in c and 'text-' in c for c in classes)
    has_border = any('border-' in c for c in classes)
    
    if not has_bg or not has_dark_mode_classes(' '.join(classes)):
        new_classes.append('bg-white dark:bg-gray-700')
    if not has_text or not has_dark_mode_classes(' '.join(classes)):
        new_classes.append('text-gray-900 dark:text-white')
    if not has_border or not has_dark_mode_classes(' '.join(classes)):
        new_classes.append('border-gray-300 dark:border-gray-600')
    
    new_classes.append('placeholder-gray-400 dark:placeholder-gray-500')
    new_classes.append('focus:border-blue-500 dark:focus:border-blue-400')
    
    all_classes = classes + new_classes
    return ' '.join(all_classes)

def fix_input_element(match):
    """Corrige um elemento input/textarea/select"""
    full_match = match.group(0)
    element_type = match.group(1)
    
    # Extrair className existente
    class_pattern = r'className=["\']([^"\']*)["\']'
    class_match = re.search(class_pattern, full_match)
    
    if class_match:
        old_classes = class_match.group(1)
        new_classes = add_dark_mode_to_classes(old_classes)
        fixed = full_match.replace(f'className="{old_classes}"', f'className="{new_classes}"')
        fixed = fixed.replace(f"className='{old_classes}'", f'className="{new_classes}"')
    else:
        # Não tem className, adicionar
        dark_classes = 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500'
        # Adicionar antes do fechamento da tag
        if full_match.endswith('/>'):
            fixed = full_match[:-2] + f' className="{dark_classes}" />'
        elif full_match.endswith('>'):
            fixed = full_match[:-1] + f' className="{dark_classes}">'
        else:
            fixed = full_match + f' className="{dark_classes}"'
    
    return fixed

def process_file(file_path):
    """Processa um arquivo TSX"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Padrões para capturar inputs, textareas e selects
        # Captura tags completas incluindo props
        patterns = [
            # Input tags
            r'<input\s+[^>]*?>',
            r'<input\s+[^>]*/?>',
            # Textarea tags
            r'<textarea\s+[^>]*>',
            r'<textarea\s+[^>]*/?>',
            # Select tags
            r'<select\s+[^>]*>',
            r'<select\s+[^>]*/?>',
        ]
        
        modified = False
        for pattern in patterns:
            matches = list(re.finditer(pattern, content, re.DOTALL))
            if matches:
                for match in reversed(matches):  # Reverso para não afetar índices
                    if 'dark:' not in match.group(0):
                        fixed = fix_input_element(match)
                        content = content[:match.start()] + fixed + content[match.end():]
                        modified = True
        
        if modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
            
    except Exception as e:
        print(f"❌ Erro em {file_path}: {e}")
    
    return False

def main():
    """Função principal"""
    base_path = Path('/home/flavio/webapp/client/src')
    
    # Encontrar TODOS os arquivos .tsx
    tsx_files = list(base_path.rglob('*.tsx'))
    
    print(f"🔍 Encontrados {len(tsx_files)} arquivos .tsx")
    print("🚀 Iniciando correção de formulários...\n")
    
    fixed_count = 0
    for tsx_file in tsx_files:
        if process_file(tsx_file):
            fixed_count += 1
            print(f"✅ Corrigido: {tsx_file.relative_to(base_path)}")
    
    print(f"\n✨ Processo concluído!")
    print(f"📝 Arquivos modificados: {fixed_count}/{len(tsx_files)}")

if __name__ == '__main__':
    main()
