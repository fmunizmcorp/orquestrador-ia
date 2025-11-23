# 🚀 PLANO DE EXECUÇÃO HIPERFRACIONADO - ORQUESTRADOR DE IAs V3.7.0

**Data**: 22 de Novembro de 2025  
**Versão**: 1.0  
**Metodologia**: SCRUM Hiperfracionado + PDCA  
**Total de Micro-Tarefas**: 122 tarefas distribuídas em 20 Sprints

---

## 📊 RESUMO EXECUTIVO

### Distribuição de Tarefas por Fase

- **Fase 1 - Fundação e Estabilidade** (Sprints 1-5): 38 micro-tarefas
- **Fase 2 - Implementação Funcionalidades** (Sprints 6-15): 60 micro-tarefas
- **Fase 3 - Funcionalidades Avançadas** (Sprints 16-20): 24 micro-tarefas

### Tempo Estimado Total
- **Fase 1**: ~6-8 horas
- **Fase 2**: ~15-20 horas
- **Fase 3**: ~10-15 horas
- **TOTAL**: ~31-43 horas de desenvolvimento puro

---

## 🏗️ FASE 1: FUNDAÇÃO E ESTABILIDADE

### Sprint 1: Bug #3 Analytics ✅ CONCLUÍDA
- Status: Resolvida em 22/11/2025
- Resultado: Bundle correto, 0 erros em 120s monitoramento

---

### Sprint 2: Páginas com Tela Preta (9 páginas)
**Micro-Tarefas (9 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 2.1 | Investigar páginas quebradas | 15 min | Lista completa das 9 páginas |
| 2.2 | Criar componente Credenciais | 10 min | Página carrega sem tela preta |
| 2.3 | Criar componente Instruções | 10 min | Página carrega sem tela preta |
| 2.4 | Criar componente Base Conhecimento | 10 min | Página carrega sem tela preta |
| 2.5 | Criar componente Serviços Externos | 10 min | Página carrega sem tela preta |
| 2.6 | Criar componente Contas API | 10 min | Página carrega sem tela preta |
| 2.7 | Criar componente Logs | 10 min | Página carrega sem tela preta |
| 2.8 | Criar componente Treinamento | 10 min | Página carrega sem tela preta |
| 2.9 | Build, Deploy e Validação | 30 min | Todas 9 páginas carregando |

**Critério Geral**: Todas as 9 páginas devem carregar e exibir mensagem "Página em construção"

---

### Sprint 3: Bug #4 Provedores
**Micro-Tarefas (6 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 3.1 | Localizar componente Providers.tsx | 5 min | Arquivo identificado |
| 3.2 | Analisar formulário de criação | 10 min | Campos atuais mapeados |
| 3.3 | Adicionar campo select type | 15 min | Campo type com 4 opções |
| 3.4 | Implementar validação do type | 10 min | Validação funcionando |
| 3.5 | Build e Deploy | 15 min | Código deployado |
| 3.6 | Testar criação de provedor | 15 min | Provedor criado com sucesso |

**Critério Geral**: Conseguir criar novo provedor com campo type (openai, anthropic, google, custom)

---

### Sprint 4: Bug #12 Métrica de Memória
**Micro-Tarefas (8 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 4.1 | Localizar systemMonitorService.ts | 5 min | Arquivo identificado |
| 4.2 | Analisar cálculo atual de memória | 15 min | Problema identificado |
| 4.3 | Instalar os-utils ou systeminformation | 10 min | Biblioteca instalada |
| 4.4 | Implementar cálculo correto | 20 min | Cálculo (usado/total)*100 |
| 4.5 | Testar valores localmente | 10 min | Valores coerentes |
| 4.6 | Build e Deploy | 15 min | Código deployado |
| 4.7 | Validar no servidor com free -h | 10 min | Diferença <2% |
| 4.8 | Monitorar por 5 minutos | 5 min | Valores estáveis |

**Critério Geral**: Métrica de memória deve estar ±2% do valor real (comparar com `free -h`)

---

### Sprint 5: Testes de Regressão
**Micro-Tarefas (15 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 5.1 | Testar Dashboard | 5 min | Carrega e exibe métricas |
| 5.2 | Testar Chat | 5 min | Envia mensagem |
| 5.3 | Testar Projetos | 5 min | CRUD funcionando |
| 5.4 | Testar Tarefas | 5 min | CRUD funcionando |
| 5.5 | Testar Workflows | 5 min | CRUD funcionando |
| 5.6 | Testar Templates | 5 min | CRUD funcionando |
| 5.7 | Testar Prompts | 5 min | CRUD funcionando |
| 5.8 | Testar Equipes | 5 min | CRUD funcionando |
| 5.9 | Testar Modelos | 5 min | CRUD funcionando |
| 5.10 | Testar Provedores | 5 min | Lista e cria |
| 5.11 | Testar IAs Especializadas | 5 min | CRUD funcionando |
| 5.12 | Testar Analytics | 5 min | Carrega sem Error #310 |
| 5.13 | Testar Configurações | 5 min | Abre e salva |
| 5.14 | Testar Terminal | 5 min | Executa comandos |
| 5.15 | Documentar resultados | 15 min | Relatório completo |

**Critério Geral**: Todas as 14 páginas funcionais devem continuar funcionando sem regressões

---

## 🚀 FASE 2: IMPLEMENTAÇÃO DE FUNCIONALIDADES

### Sprint 6: CRUD Completo Equipes
**Micro-Tarefas (6 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 6.1 | Implementar modal de criação | 30 min | Modal abre e fecha |
| 6.2 | Implementar modal de edição | 30 min | Modal pré-preenchido |
| 6.3 | Implementar confirmação exclusão | 20 min | Confirmação funciona |
| 6.4 | Implementar busca | 30 min | Busca filtra resultados |
| 6.5 | Build e Deploy | 15 min | Código deployado |
| 6.6 | Testar CRUD completo | 20 min | Criar, editar, buscar, deletar |

---

### Sprint 7: CRUD Completo Projetos
**Micro-Tarefas (6 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 7.1 | Implementar modal de criação | 30 min | Modal abre e fecha |
| 7.2 | Implementar modal de edição | 30 min | Modal pré-preenchido |
| 7.3 | Implementar confirmação exclusão | 20 min | Confirmação funciona |
| 7.4 | Implementar busca e filtro por status | 40 min | Busca e filtro funcionam |
| 7.5 | Build e Deploy | 15 min | Código deployado |
| 7.6 | Testar CRUD completo | 20 min | Todas operações OK |

---

### Sprint 8: CRUD Completo Tarefas
**Micro-Tarefas (6 tarefas)**:
- 8.1 a 8.6: Mesma estrutura das Sprints 6-7
- **Adicionais**: Filtro por status, prioridade, projeto

---

### Sprint 9: CRUD Completo Workflows
**Micro-Tarefas (6 tarefas)**:
- 9.1 a 9.6: Mesma estrutura
- **Adicionais**: Ativar/Desativar workflow

---

### Sprint 10: CRUD Completo Modelos (corrigir bug modal)
**Micro-Tarefas (7 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 10.1 | Identificar bug do modal | 15 min | Bug documentado |
| 10.2 | Corrigir bug do modal | 30 min | Modal abre corretamente |
| 10.3 | Implementar modal de edição | 30 min | Modal pré-preenchido |
| 10.4 | Implementar confirmação exclusão | 20 min | Confirmação funciona |
| 10.5 | Implementar busca | 30 min | Busca funciona |
| 10.6 | Build e Deploy | 15 min | Código deployado |
| 10.7 | Testar CRUD completo | 20 min | Todas operações OK |

---

### Sprint 11: CRUD Completo IAs Especializadas
**Micro-Tarefas (6 tarefas)**:
- 11.1 a 11.6: Mesma estrutura
- **Adicionais**: Filtro por categoria

---

### Sprint 12: CRUD Completo Templates
**Micro-Tarefas (6 tarefas)**:
- 12.1 a 12.6: Mesma estrutura
- **Adicionais**: Duplicar template

---

### Sprint 13: Implementar Página Credenciais
**Micro-Tarefas (9 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 13.1 | Criar interface de listagem | 40 min | Lista credenciais |
| 13.2 | Criar modal de criação | 45 min | Campos corretos |
| 13.3 | Implementar criptografia no backend | 30 min | AES-256-GCM |
| 13.4 | Criar modal de edição | 40 min | Edição funciona |
| 13.5 | Implementar exclusão | 20 min | Deleta seguramente |
| 13.6 | Implementar busca | 25 min | Busca funciona |
| 13.7 | Adicionar validações | 30 min | Validações OK |
| 13.8 | Build e Deploy | 15 min | Código deployado |
| 13.9 | Testar CRUD completo | 25 min | Todas operações OK |

---

### Sprint 14: Implementar Página Instruções
**Micro-Tarefas (7 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 14.1 | Criar interface de listagem | 35 min | Lista instruções |
| 14.2 | Criar modal de criação | 40 min | Campos corretos |
| 14.3 | Criar editor de texto rico | 45 min | Editor Markdown/Rich text |
| 14.4 | Criar modal de edição | 35 min | Edição funciona |
| 14.5 | Implementar exclusão | 20 min | Deleta corretamente |
| 14.6 | Build e Deploy | 15 min | Código deployado |
| 14.7 | Testar CRUD completo | 20 min | Todas operações OK |

---

### Sprint 15: Implementar Página Base de Conhecimento
**Micro-Tarefas (8 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 15.1 | Criar interface de listagem | 40 min | Lista documentos |
| 15.2 | Criar modal de criação | 45 min | Campos corretos |
| 15.3 | Implementar upload de arquivos | 50 min | Upload funciona |
| 15.4 | Criar preview de documentos | 40 min | Preview funciona |
| 15.5 | Criar modal de edição | 35 min | Edição funciona |
| 15.6 | Implementar busca e categorização | 40 min | Busca e categorias |
| 15.7 | Build e Deploy | 15 min | Código deployado |
| 15.8 | Testar CRUD completo | 25 min | Todas operações OK |

---

## 🎯 FASE 3: FUNCIONALIDADES AVANÇADAS E REFINAMENTO

### Sprint 16: Execução de Workflows
**Micro-Tarefas (6 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 16.1 | Criar endpoint backend /execute | 60 min | Endpoint funcional |
| 16.2 | Implementar lógica de execução | 90 min | Workflow executa |
| 16.3 | Criar botão "Executar" no frontend | 30 min | Botão chama API |
| 16.4 | Implementar modal de resultados | 45 min | Mostra logs/resultados |
| 16.5 | Build e Deploy | 15 min | Código deployado |
| 16.6 | Testar execução completa | 30 min | Workflow executado OK |

---

### Sprint 17: Terminal SSH Funcional
**Micro-Tarefas (7 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 17.1 | Instalar xterm.js no frontend | 15 min | Biblioteca instalada |
| 17.2 | Criar componente de terminal | 45 min | Terminal renderiza |
| 17.3 | Criar endpoint WebSocket /terminal | 60 min | WebSocket conecta |
| 17.4 | Implementar comunicação bidirecional | 60 min | Comandos enviados/recebidos |
| 17.5 | Implementar criação de sessões SSH | 45 min | Sessões criadas |
| 17.6 | Build e Deploy | 15 min | Código deployado |
| 17.7 | Testar comandos básicos | 30 min | ls, cd, cat funcionam |

---

### Sprint 18: Implementar Páginas Restantes
**Micro-Tarefas (4 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 18.1 | Implementar Serviços Externos | 90 min | Página completa |
| 18.2 | Implementar Contas API | 90 min | Página completa |
| 18.3 | Implementar Logs | 90 min | Página completa |
| 18.4 | Implementar Treinamento | 90 min | Página completa |

---

### Sprint 19: Melhorar UI/UX e Validações
**Micro-Tarefas (4 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 19.1 | Adicionar validações de formulários | 120 min | Validações em todos forms |
| 19.2 | Implementar mensagens de feedback | 60 min | Toasts/Notificações |
| 19.3 | Melhorar responsividade mobile | 90 min | Mobile funcionando |
| 19.4 | Refinar estilos e animações | 60 min | UI polida |

---

### Sprint 20: Testes E2E e Produção Final
**Micro-Tarefas (3 tarefas)**:

| ID | Tarefa | Tempo | Critério de Aceite |
|----|--------|-------|-------------------|
| 20.1 | Testes completos de ponta a ponta | 180 min | Todas features testadas |
| 20.2 | Otimizar performance (bundle, queries) | 90 min | Tempo carregamento <3s |
| 20.3 | Documentação final e deploy | 90 min | Sistema 100% pronto |

---

## ✅ CRITÉRIOS DE ACEITE GERAIS

### Para Cada Sprint

1. **Código**:
   - [ ] TypeScript sem erros
   - [ ] ESLint sem warnings críticos
   - [ ] Build completo sem erros

2. **Deploy**:
   - [ ] Código deployado em /home/flavio/webapp
   - [ ] PM2 reiniciado com sucesso
   - [ ] HTTP 200 OK
   - [ ] Logs limpos (sem erros críticos)

3. **Funcionalidade**:
   - [ ] Todas as micro-tarefas concluídas
   - [ ] Critérios de aceite específicos atendidos
   - [ ] Testes manuais aprovados

4. **Regressão**:
   - [ ] Páginas funcionais continuam funcionando
   - [ ] Nenhuma funcionalidade quebrada

5. **Git**:
   - [ ] Commit realizado
   - [ ] Push para genspark_ai_developer
   - [ ] PR atualizada

---

## 🔄 WORKFLOW DE DEPLOY PADRÃO

```bash
# 1. SSH no servidor
ssh -p 2224 flavio@31.97.64.43

# 2. Navegar para diretório git
cd /home/flavio/orquestrador-ia

# 3. Atualizar código (se necessário)
git pull origin genspark_ai_developer

# 4. Build (se necessário)
npm run build

# 5. Parar PM2
pm2 stop orquestrador-v3

# 6. Backup
cd /home/flavio
mv webapp webapp.OLD-$(date +%Y%m%d-%H%M%S)

# 7. Copiar código atualizado
cp -r orquestrador-ia webapp

# 8. Reiniciar PM2
cd webapp
pm2 delete orquestrador-v3
NODE_ENV=production pm2 start dist/server/index.js --name orquestrador-v3 --update-env
pm2 save --force

# 9. Validar
curl -s -o /dev/null -w "HTTP %{http_code}
" http://localhost:3001/
pm2 logs orquestrador-v3 --lines 50 --nostream
```

---

## 📊 RESUMO DE MICRO-TAREFAS POR SPRINT

| Sprint | Tema | Micro-Tarefas | Tempo Estimado |
|--------|------|---------------|----------------|
| 1 | Bug #3 Analytics | - | ✅ Concluída |
| 2 | Páginas Tela Preta | 9 | 2h |
| 3 | Bug #4 Provedores | 6 | 1h 10min |
| 4 | Bug #12 Memória | 8 | 1h 40min |
| 5 | Testes Regressão | 15 | 1h 30min |
| 6 | CRUD Equipes | 6 | 2h 25min |
| 7 | CRUD Projetos | 6 | 2h 35min |
| 8 | CRUD Tarefas | 6 | 2h 30min |
| 9 | CRUD Workflows | 6 | 2h 25min |
| 10 | CRUD Modelos | 7 | 2h 40min |
| 11 | CRUD IAs Espec. | 6 | 2h 25min |
| 12 | CRUD Templates | 6 | 2h 25min |
| 13 | Página Credenciais | 9 | 4h 10min |
| 14 | Página Instruções | 7 | 3h 30min |
| 15 | Página Base Conhec. | 8 | 4h 30min |
| 16 | Exec Workflows | 6 | 4h 30min |
| 17 | Terminal SSH | 7 | 4h 30min |
| 18 | Páginas Restantes | 4 | 6h |
| 19 | UI/UX Validações | 4 | 5h 30min |
| 20 | Testes E2E Produção | 3 | 6h |
| **TOTAL** | **20 Sprints** | **129** | **~64h** |

---

## 🎉 ENTREGA FINAL ESPERADA

### Critérios de Aceite Finais

- ✅ **100% das páginas funcionais** (23/23)
- ✅ **Zero bugs críticos**
- ✅ **Funcionalidades CRUD completas** em todas as entidades
- ✅ **Funcionalidades avançadas implementadas** (Workflows, Terminal SSH)
- ✅ **Sistema estável e performático** (CPU <80%, RAM <90%)
- ✅ **Documentação completa e atualizada**
- ✅ **Testes de regressão passando** 100%
- ✅ **PM2 estável** (uptime >99%)
- ✅ **HTTP 200 OK** consistente
- ✅ **Logs limpos** sem erros

### Resultado Esperado

Ao final das 20 Sprints, o sistema Orquestrador de IAs estará **verdadeiramente pronto para produção** com 100% de funcionalidade, estabilidade e qualidade.

---

**FIM DO PLANO DE EXECUÇÃO HIPERFRACIONADO**
