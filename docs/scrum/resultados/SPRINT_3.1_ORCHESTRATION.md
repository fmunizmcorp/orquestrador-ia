# 🎯 SPRINT 3.1: ORCHESTRATION SERVICE - Criar e Executar Tarefa Simples

## 📋 Objetivo
Validar orquestração básica funcionando de ponta a ponta

## ✅ Critérios de Aceitação
- [ ] Criar tarefa manual
- [ ] Tarefa é decomposta em subtarefas
- [ ] Subtarefas são atribuídas a modelos
- [ ] Subtarefas são executadas
- [ ] Resultados aparecem
- [ ] Status de tarefa atualiza

## 🔧 Tarefas Técnicas
1. [ ] Verificar router `orchestration` existe
2. [ ] Endpoint `orchestration.createTask` funcional
3. [ ] Endpoint `orchestration.decomposeTask` funcional
4. [ ] Endpoint `orchestration.executeSubtask` funcional
5. [ ] Endpoint `orchestration.getTaskStatus` funcional
6. [ ] Testar criação de tarefa: "Escreva um hello world em Python"
7. [ ] Verificar decomposição automática
8. [ ] Verificar atribuição de modelo (coding)
9. [ ] Executar subtask e validar resultado
10. [ ] Validar logs de execução

## 🧪 Testes Obrigatórios
```bash
# 1. Criar tarefa
curl -X POST http://localhost:3001/api/trpc/orchestration.createTask \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World em Python","description":"Escreva um hello world em Python"}'

# 2. Verificar decomposição
curl -X POST http://localhost:3001/api/trpc/orchestration.getTaskStatus \
  -H "Content-Type: application/json" \
  -d '{"taskId":1}'

# 3. Listar subtasks
curl -X POST http://localhost:3001/api/trpc/subtasks.listByTask \
  -H "Content-Type: application/json" \
  -d '{"taskId":1}'

# 4. Executar subtask
curl -X POST http://localhost:3001/api/trpc/orchestration.executeSubtask \
  -H "Content-Type: application/json" \
  -d '{"subtaskId":1}'

# 5. Verificar resultado
curl -X POST http://localhost:3001/api/trpc/orchestration.getSubtaskResult \
  -H "Content-Type: application/json" \
  -d '{"subtaskId":1}'
```

## 📊 Status Atual

### Backend Status
- [ ] Router `orchestration` implementado
- [ ] Procedimentos no banco de dados criados
- [ ] Lógica de decomposição implementada
- [ ] Execução de subtasks funcional

### Frontend Status
- [ ] Página de criação de tasks
- [ ] Visualização de decomposição
- [ ] Monitoramento de execução
- [ ] Exibição de resultados

## 🐛 Issues Encontrados
_Nenhum ainda - sprint iniciando_

## 📝 Notas de Implementação
_A ser preenchido durante implementação_

## 🎯 Resultado Esperado
Ao final deste sprint, deve ser possível:
1. Criar uma tarefa manualmente via interface ou API
2. Ver a tarefa sendo decomposta em subtarefas automaticamente
3. Ver as subtarefas sendo atribuídas a modelos de IA apropriados
4. Executar as subtarefas e ver os resultados
5. Ver o status da tarefa principal atualizar conforme subtarefas completam

---

**Status**: 🟡 EM ANDAMENTO
**Iniciado em**: 2025-11-02
**Responsável**: GenSpark AI Developer
