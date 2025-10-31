#!/bin/bash
# Bulk fix .returning() errors
# This script assists in fixing remaining .returning() errors

echo "📝 Arquivos com .returning() restantes:"
echo ""
echo "models.ts: 5 ocorrências (linhas 81, 109, 138, 188, 216)"
echo "prompts.ts: 4 ocorrências"
echo "services.ts: 3 ocorrências"
echo "modelTrainingService.ts: 2 ocorrências"
echo ""
echo "Total: 14 erros de .returning() restantes"
echo ""
echo "Execute as correções manualmente seguindo o padrão:"
echo ""
echo "PADRÃO PARA INSERT:"
echo "  const result: any = await db.insert(table).values({...});"
echo "  const id = result[0]?.insertId || result.insertId;"
echo "  const [item] = await db.select().from(table).where(eq(table.id, id)).limit(1);"
echo ""
echo "PADRÃO PARA UPDATE:"
echo "  await db.update(table).set({...}).where(eq(table.id, id));"
echo "  const [updated] = await db.select().from(table).where(eq(table.id, id)).limit(1);"
