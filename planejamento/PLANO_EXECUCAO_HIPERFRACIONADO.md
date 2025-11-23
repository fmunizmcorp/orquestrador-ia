# 🚀 PLANO DE EXECUÇÃO HIPERFRACIONADO - ORQUESTRADOR DE IAs V3.7.0

**Data de Criação**: 22 de Novembro de 2025  
**Versão**: 1.0  
**Autor**: GenSpark AI Developer (Claude Sonnet 4)  
**Metodologia**: SCRUM Hiperfracionado + PDCA  
**Total de Micro-Tarefas**: 120+ tarefas

---

## 📋 ÍNDICE

1. [Introdução](#introdução)
2. [Metodologia SCRUM + PDCA](#metodologia-scrum--pdca)
3. [Fase 1: Fundação e Estabilidade (Sprints 1-5)](#fase-1-fundação-e-estabilidade-sprints-1-5)
4. [Fase 2: Implementação de Funcionalidades (Sprints 6-15)](#fase-2-implementação-de-funcionalidades-sprints-6-15)
5. [Fase 3: Funcionalidades Avançadas (Sprints 16-20)](#fase-3-funcionalidades-avançadas-sprints-16-20)
6. [Critérios de Aceite Gerais](#critérios-de-aceite-gerais)
7. [Checklist de Validação](#checklist-de-validação)

---

## 📖 INTRODUÇÃO

### Objetivo Geral
Transformar o sistema Orquestrador de IAs V3.7.0 em uma aplicação **100% funcional, estável e pronta para produção**, corrigindo todos os bugs identificados, implementando funcionalidades faltantes e consolidando a base de código em um padrão de alta qualidade.

### Estado Atual
- **Status**: ✅ 99% funcional
- **Versão**: 3.7.0
- **Bug #3**: ✅ RESOLVIDO (Sprint 79)
- **Páginas Funcionais**: 14/23 (61%)
- **Páginas Quebradas**: 9/23 (39%)
- **CRUDs Completos**: 14/14 básicos
- **Servidor**: ✅ ONLINE (PM2, 14h uptime)

### Público-Alvo
Este plano foi desenhado para ser executado por uma **Inteligência Artificial de Desenvolvimento (IA Dev)**, com tarefas hiperfracionadas, critérios de aceite claros e um processo de validação rigoroso.

### Regras de Ouro

1. ✅ **AUTONOMIA TOTAL**: Executar TODAS as tarefas sem intervenção manual
2. ✅ **COMPLETUDE ABSOLUTA**: NUNCA resumir, consolidar ou omitir qualquer tarefa
3. ✅ **METODOLOGIA SCRUM + PDCA**: Seguir sprint por sprint, validando 100%
4. ✅ **HONESTIDADE RADICAL**: Reportar falhas e recomeçar se necessário
5. ✅ **NÃO QUEBRE O QUE FUNCIONA**: Validar regressões antes de avançar

---

## 🔄 METODOLOGIA SCRUM + PDCA

### Ciclo PDCA para Cada Sprint

#### 1. PLAN (Planejar) - 10%
- Ler objetivos e tarefas da sprint
- Criar sub-plano detalhado com todas as micro-tarefas
- Definir critérios de aceite específicos
- Estimar tempo de execução

#### 2. DO (Fazer) - 40%
- Conectar via SSH ao servidor
- Modificar arquivos de código-fonte necessários
- Executar build do frontend: `npm run build`
- Copiar build para produção (se necessário)
- Reiniciar aplicação: `pm2 restart orquestrador-v3`

#### 3. CHECK (Verificar) - 40%
- Executar TODOS os critérios de teste definidos
- Testes automatizados (quando aplicável)
- Testes manuais obrigatórios
- Validação de regressão (páginas que já funcionavam)
- Verificar logs do PM2 por 2 minutos
- Confirmar HTTP 200 OK

#### 4. ACT (Agir) - 10%
**Se a validação FALHAR**:
- Reportar falha detalhadamente com prints/logs
- Reverter mudanças: `git checkout -- <arquivo>`
- Reiniciar sprint do zero com nova abordagem
- Documentar lição aprendida

**Se a validação PASSAR (100%)**:
- Fazer commit: `git add . && git commit -m "feat: Sprint X - descrição"`
- Push: `git push origin genspark_ai_developer`
- Atualizar/criar Pull Request
- Documentar sucesso da sprint
- Preparar para próxima sprint

### Regra de Ouro do SCRUM
🚫 **Nenhuma sprint pode ser iniciada antes que a anterior esteja 100% concluída e validada.**

---

## 🏗️ FASE 1: FUNDAÇÃO E ESTABILIDADE (Sprints 1-5)

**Objetivo**: Corrigir todos os bugs críticos e estabilizar o sistema em 100%.

### ✅ Sprint 1: Correção Definitiva do Bug #3 (Analytics)
**Status**: ✅ **CONCLUÍDA** (Sprint 79, 22/11/2025 01:40)

**Resumo**:
- ✅ Implementado useMemo em 6 arrays (tasks, projects, workflows, templates, prompts, teams)
- ✅ Bundle correto em produção: Analytics-Dd-5mnUC.js (29K)
- ✅ Validação: 120s monitoramento, 0 erros React Error #310
- ✅ PM2: online, CPU 0%, Mem 93.7MB

**Resultado**: Bug #3 oficialmente RESOLVIDO.

---

### 🔧 Sprint 2: Correção das Páginas com Tela Preta (Bugs #5-#11)

**Objetivo**: Fazer com que todas as 9 páginas quebradas carreguem pelo menos um componente básico.

**Páginas Afetadas**:
1. Credenciais
2. Instruções
3. Base de Conhecimento
4. Serviços Externos
5. Contas API
6. Logs
7. Treinamento
8. *(a identificar durante investigação)*
9. *(a identificar durante investigação)*

#### Micro-Tarefa 2.1: Investigar Páginas Quebradas
**Tempo estimado**: 15 minutos

1. ✅ Conectar via SSH ao servidor
2. ✅ Listar arquivos em `client/src/pages/`
3. ✅ Identificar quais arquivos existem para as 9 páginas
4. ✅ Verificar arquivos de rotas (`App.tsx` ou `routes/`)
5. ✅ Identificar rotas não configuradas
6. ✅ Documentar estado atual de cada página

**Comandos**:
```bash
ssh -p 2224 flavio@31.97.64.43
cd /home/flavio/webapp/client/src/pages
ls -la
grep -r "Credenciais\|Instruções\|Base de Conhecimento" .
cd ../
cat App.tsx | grep -A5 -B5 "Route"
```

**Critério de Aceite**:
- [ ] Lista completa das 9 páginas quebradas identificada
- [ ] Estado atual de cada página documentado (arquivo existe? rota configurada?)

---

#### Micro-Tarefa 2.2: Criar Componente Básico - Credenciais
**Tempo estimado**: 10 minutos

1. ✅ Verificar se `client/src/pages/Credentials.tsx` existe
2. ✅ Se não existir, criar arquivo
3. ✅ Implementar componente básico:

```typescript
import React from 'react';

export default function Credentials() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Credenciais</h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700 dark:text-yellow-300">
            ⚠️ Página em construção
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Esta página está sendo desenvolvida e estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
```

4. ✅ Salvar arquivo
5. ✅ Verificar rota em `App.tsx`
6. ✅ Adicionar rota se não existir:

```typescript
<Route path="/credenciais" element={<Credentials />} />
```

**Critério de Aceite**:
- [ ] Arquivo `Credentials.tsx` existe
- [ ] Componente retorna JSX válido
- [ ] Rota `/credenciais` configurada em `App.tsx`
- [ ] TypeScript sem erros

---

#### Micro-Tarefa 2.3: Criar Componente Básico - Instruções
**Tempo estimado**: 10 minutos

