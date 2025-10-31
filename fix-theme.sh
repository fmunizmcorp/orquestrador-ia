#!/bin/bash

# Script para corrigir classes Tailwind para suportar tema dark
# Orquestrador V3.1

echo "🔧 Corrigindo tema dark/light nas páginas..."

# Padrões mais comuns para corrigir
declare -A replacements=(
    ["bg-white "]="bg-white dark:bg-gray-800 "
    ["bg-white\""]="bg-white dark:bg-gray-800\""
    ["text-gray-900 "]="text-gray-900 dark:text-white "
    ["text-gray-900\""]="text-gray-900 dark:text-white\""
    ["text-gray-800 "]="text-gray-800 dark:text-gray-100 "
    ["text-gray-700 "]="text-gray-700 dark:text-gray-200 "
    ["text-gray-600 "]="text-gray-600 dark:text-gray-300 "
    ["text-gray-500 "]="text-gray-500 dark:text-gray-400 "
    ["bg-gray-50 "]="bg-gray-50 dark:bg-gray-900 "
    ["bg-gray-100 "]="bg-gray-100 dark:bg-gray-900 "
    ["border-gray-200 "]="border-gray-200 dark:border-gray-700 "
    ["border-gray-300 "]="border-gray-300 dark:border-gray-600 "
)

# Contador de arquivos modificados
modified=0

# Processar todos os arquivos .tsx em client/src
for file in client/src/**/*.tsx; do
    if [ -f "$file" ]; then
        # Verificar se o arquivo precisa de correção
        needs_fix=false
        for pattern in "${!replacements[@]}"; do
            if grep -q "$pattern" "$file" 2>/dev/null; then
                needs_fix=true
                break
            fi
        done
        
        if [ "$needs_fix" = true ]; then
            echo "  📝 Corrigindo: $file"
            # Criar backup
            cp "$file" "$file.bak"
            
            # Aplicar todas as substituições
            for pattern in "${!replacements[@]}"; do
                replacement="${replacements[$pattern]}"
                # Usar sed para substituir (macOS/Linux compatible)
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/${pattern}/${replacement}/g" "$file"
                else
                    sed -i "s/${pattern}/${replacement}/g" "$file"
                fi
            done
            
            ((modified++))
        fi
    fi
done

echo ""
echo "✅ Correção concluída!"
echo "📊 Arquivos modificados: $modified"
echo ""
echo "💡 Dica: Se algo não estiver correto, os backups estão em *.bak"

