# 📋 SPRINT 28 - ANÁLISE E PLANEJAMENTO

**Título**: Otimização de Bundle Frontend e Correção de Playwright Timeout  
**Data de Criação**: 15 de novembro de 2025, 00:20 -03:00  
**Metodologia**: SCRUM + PDCA  
**Sprint Origem**: Sprint 26 (Rodada 33)  
**Problema Identificado**: #2 - Frontend Playwright Timeout

---

## 🎯 OBJETIVO DA SPRINT

**Meta Principal**: Reduzir tamanho do bundle JavaScript e melhorar tempo de carregamento da página

**Critérios de Sucesso**:
- ✅ Bundle JS < 500 KB (atual: 855 KB)
- ✅ Página carrega em < 3 segundos (FCP - First Contentful Paint)
- ✅ Playwright testes aprovados sem timeout
- ✅ Core Web Vitals aprovados (LCP, FID, CLS)
- ✅ Code splitting implementado

---

## 📊 ANÁLISE DO PROBLEMA (PLAN - PDCA)

### Situação Atual

**Problema Detectado na Rodada 33**:
```
Teste: Frontend Console Logs
Status: FALHADO (Playwright timeout)
Erro: Page.goto: Timeout 30000ms exceeded

Métricas Atuais:
  Bundle JS: 855 KB (873.46 kB real, gzip: 209.63 kB)
  Bundle CSS: 53 KB (gzip: 9.36 kB)
  HTML: 689 bytes
  
  Tempo de carregamento: > 30 segundos
  First Contentful Paint: Desconhecido
  Time to Interactive: Desconhecido
```

### Causa Raiz

**Análise dos 5 Porquês**:
1. **Por que Playwright timeout?** → Página não carregou em 30s
2. **Por que não carregou?** → Bundle JS muito grande (855 KB)
3. **Por que bundle é grande?** → Sem code splitting ou lazy loading
4. **Por que não há splitting?** → Vite build default sem otimizações
5. **Por que sem otimizações?** → Configuração inicial focada em funcionalidade

**Causa Raiz**: Build configuration não otimizada para produção

### Impacto

**Usuário Final**:
- ⚠️ Experiência lenta ao acessar pela primeira vez
- ⚠️ Alto consumo de dados móveis (855 KB)
- ⚠️ Tempo de carregamento > 30s em redes lentas

**Sistema**:
- ⚠️ Testes automatizados falhando
- ⚠️ Lighthouse score baixo
- ⚠️ SEO prejudicado (Core Web Vitals)

---

## 🎯 SOLUÇÃO PROPOSTA (PLAN - PDCA)

### Estratégia

**Abordagem Multi-Etapas**:

1. **Análise de Bundle** (Bundle Analyzer)
   - Identificar maiores dependências
   - Encontrar código duplicado
   - Verificar imports desnecessários

2. **Code Splitting** (React.lazy)
   - Lazy loading de rotas
   - Lazy loading de componentes pesados
   - Dynamic imports para bibliotecas grandes

3. **Tree Shaking** (Vite optimization)
   - Eliminar código não utilizado
   - Otimizar imports de bibliotecas (lodash, date-fns)
   - Remover comentários e console.log

4. **Compression** (Brotli + Gzip)
   - Adicionar compressão Brotli no Express
   - Configurar cache headers
   - Habilitar HTTP/2

5. **Asset Optimization**
   - Minificar CSS
   - Otimizar imagens (se houver)
   - Carregar fonts localmente

### Arquitetura da Solução

```typescript
// vite.config.ts - OTIMIZADO
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@heroicons/react', '@headlessui/react'],
          'trpc-vendor': ['@trpc/client', '@trpc/react-query'],
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  }
});

// client/src/App.tsx - LAZY LOADING
const Prompts = lazy(() => import('./pages/Prompts'));
const Models = lazy(() => import('./pages/Models'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// client/src/components/StreamingPromptExecutor.tsx - DYNAMIC IMPORT
const loadMarkdownParser = () => import('marked');
```

---

## 📝 BACKLOG SCRUM - SPRINT 28

### User Stories

**US-28.1**: Como usuário, quero que a página carregue rapidamente para não ficar esperando

**Critérios de Aceite**:
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle JS < 500 KB
- Lighthouse Performance > 90

---

**US-28.2**: Como desenvolvedor, quero identificar gargalos no bundle para otimizar eficientemente

**Critérios de Aceite**:
- Bundle analyzer configurado
- Relatório visual de dependências
- Top 10 maiores dependências identificadas
- Plano de ação documentado

---

**US-28.3**: Como usuário mobile, quero consumir menos dados ao carregar a aplicação

**Critérios de Aceite**:
- Bundle gzip < 150 KB
- Compressão Brotli habilitada
- Cache headers configurados (1 ano para assets)
- Service worker opcional (PWA)

---

### Tarefas Técnicas (35 tarefas)

#### FASE 1: Análise e Planejamento (5 tarefas)

**T-28.1** - Instalar e configurar rollup-plugin-visualizer  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `vite.config.ts`

**T-28.2** - Gerar relatório de análise de bundle  
**Complexidade**: 1 ponto | **Tempo**: 10 min  
**Comando**: `npm run build && open stats.html`

**T-28.3** - Identificar top 10 maiores dependências  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Output**: Lista documentada

**T-28.4** - Identificar imports desnecessários  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Ferramenta**: depcheck, grep

**T-28.5** - Criar plano de ação priorizado  
**Complexidade**: 1 ponto | **Tempo**: 20 min  
**Output**: BUNDLE_OPTIMIZATION_PLAN.md

---

#### FASE 2: Vite Configuration Optimization (8 tarefas)

**T-28.6** - Adicionar manualChunks para vendor splitting  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `vite.config.ts`

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['@heroicons/react', '@headlessui/react'],
  'trpc-vendor': ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'],
  'utils': ['date-fns', 'clsx'],
}
```

**T-28.7** - Configurar Terser minification avançada  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `vite.config.ts`

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info'],
    }
  }
}
```

**T-28.8** - Adicionar chunkSizeWarningLimit  
**Complexidade**: 1 ponto | **Tempo**: 10 min  
**Arquivo**: `vite.config.ts`

**T-28.9** - Habilitar CSS code splitting  
**Complexidade**: 2 pontos | **Tempo**: 20 min  
**Arquivo**: `vite.config.ts`

**T-28.10** - Configurar resolve.alias para tree shaking  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `vite.config.ts`

**T-28.11** - Adicionar @rollup/plugin-replace para env vars  
**Complexidade**: 2 pontos | **Tempo**: 20 min  
**Arquivo**: `vite.config.ts`

**T-28.12** - Build e validar tamanho dos chunks  
**Complexidade**: 1 ponto | **Tempo**: 10 min  

**T-28.13** - Comparar bundle size antes/depois  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Output**: Relatório de redução

---

#### FASE 3: React Code Splitting (8 tarefas)

**T-28.14** - Implementar React.lazy() em App.tsx para rotas  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `client/src/App.tsx`

```typescript
const Prompts = lazy(() => import('./pages/Prompts'));
const Models = lazy(() => import('./pages/Models'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Agents = lazy(() => import('./pages/Agents'));
const Providers = lazy(() => import('./pages/Providers'));
```

**T-28.15** - Adicionar Suspense com fallback spinner  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `client/src/App.tsx`

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

**T-28.16** - Criar componente LoadingSpinner  
**Complexidade**: 2 pontos | **Tempo**: 20 min  
**Arquivo**: `client/src/components/LoadingSpinner.tsx`

**T-28.17** - Dynamic import para HealthCheckWidget (opcional)  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: Componentes que usam HealthCheckWidget

**T-28.18** - Dynamic import para ModelWarmup (opcional)  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: Componentes que usam ModelWarmup

**T-28.19** - Lazy load de bibliotecas pesadas (marked, highlight.js)  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivos**: Componentes que usam markdown/syntax highlight

**T-28.20** - Testar lazy loading em desenvolvimento  
**Complexidade**: 1 ponto | **Tempo**: 15 min  

**T-28.21** - Build e validar chunks separados  
**Complexidade**: 1 ponto | **Tempo**: 10 min  

---

#### FASE 4: Dependency Optimization (6 tarefas)

**T-28.22** - Otimizar imports de @heroicons/react  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Antes**: `import { Icon } from '@heroicons/react/24/outline'`  
**Depois**: `import Icon from '@heroicons/react/24/outline/Icon'`

**T-28.23** - Substituir bibliotecas pesadas por alternativas leves  
**Complexidade**: 3 pontos | **Tempo**: 60 min  
**Candidatos**: moment → date-fns, lodash → lodash-es

**T-28.24** - Remover dependências não utilizadas  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Ferramenta**: `npm prune`, `depcheck`

**T-28.25** - Configurar package.json sideEffects: false  
**Complexidade**: 1 ponto | **Tempo**: 15 min  
**Arquivo**: `client/package.json`

**T-28.26** - Audit npm packages e remover duplicatas  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Comando**: `npm dedupe`

**T-28.27** - Build e comparar bundle size  
**Complexidade**: 1 ponto | **Tempo**: 10 min  

---

#### FASE 5: Server-Side Optimization (4 tarefas)

**T-28.28** - Adicionar compressão Brotli no Express  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/index.ts`

```typescript
import compression from 'compression';
app.use(compression({ level: 6 }));
```

**T-28.29** - Configurar cache headers para assets  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `server/index.ts`

```typescript
app.use('/assets', express.static('dist/client/assets', {
  maxAge: '1y',
  immutable: true,
}));
```

**T-28.30** - Habilitar HTTP/2 (se possível)  
**Complexidade**: 3 pontos | **Tempo**: 45 min  
**Arquivo**: `server/index.ts`

**T-28.31** - Configurar service worker (PWA - opcional)  
**Complexidade**: 5 pontos | **Tempo**: 90 min  
**Arquivo**: `client/src/service-worker.ts`

---

#### FASE 6: Testes e Deploy (4 tarefas)

**T-28.32** - Criar testes Playwright com waitUntil: 'domcontentloaded'  
**Complexidade**: 2 pontos | **Tempo**: 30 min  
**Arquivo**: `/tmp/test_frontend_optimized.js`

**T-28.33** - Executar Lighthouse audit  
**Complexidade**: 2 pontos | **Tempo**: 20 min  
**Ferramenta**: `lighthouse http://localhost:3001 --view`

**T-28.34** - Build produção completo (client + server)  
**Complexidade**: 2 pontos | **Tempo**: 15 min  

**T-28.35** - Deploy PM2 e validação Core Web Vitals  
**Complexidade**: 2 pontos | **Tempo**: 20 min  

---

## 📈 ESTIMATIVAS

### Complexidade Total: **70 pontos** (Fibonacci)

### Tempo Estimado: **14-16 horas**

**Distribuição**:
- FASE 1 (Análise): 1.5h
- FASE 2 (Vite Config): 3h
- FASE 3 (Code Splitting): 3.5h
- FASE 4 (Dependencies): 3h
- FASE 5 (Server): 2.5h
- FASE 6 (Testes): 1.5h

### Velocity Esperada: **8-10 tarefas/dia**

---

## 🧪 ESTRATÉGIA DE TESTES (CHECK - PDCA)

### Performance Testing

**Teste 1**: Bundle Size Validation
```bash
Expected: Total bundle < 500 KB
Expected: Gzip bundle < 150 KB
Expected: Largest chunk < 200 KB
```

**Teste 2**: Load Time Validation
```bash
Tool: Playwright
Expected: Page.goto success < 10s
Expected: #root rendered
Expected: No console errors
```

**Teste 3**: Lighthouse Audit
```bash
Tool: Google Lighthouse
Expected: Performance > 90
Expected: FCP < 1.5s
Expected: LCP < 2.5s
Expected: TBT < 200ms
```

### Functional Testing

**Teste 4**: Lazy Loading Works
```bash
Expected: Routes load dynamically
Expected: Suspense fallback shows
Expected: Components load on demand
```

---

## 📊 MÉTRICAS DE SUCESSO (CHECK - PDCA)

### Quantitativas

| Métrica | Antes (Sprint 26) | Meta (Sprint 28) |
|---------|-------------------|------------------|
| Bundle JS size | 855 KB | **< 500 KB (-42%)** |
| Bundle gzip | 210 KB | **< 150 KB (-29%)** |
| Page load time | > 30s | **< 3s (-90%)** |
| Playwright success | 0% (timeout) | **100% (< 10s)** |
| Lighthouse Performance | Desconhecido | **> 90** |
| FCP | Desconhecido | **< 1.5s** |
| LCP | Desconhecido | **< 2.5s** |

### Qualitativas

- ✅ Experiência de carregamento rápida e fluida
- ✅ Código modularizado e manutenível
- ✅ Build configuration profissional
- ✅ Core Web Vitals aprovados

---

## 🚀 RISCOS E MITIGAÇÕES

### Risco #1: Code splitting quebra rotas
**Probabilidade**: MÉDIA  
**Impacto**: ALTO  
**Mitigação**: Testes funcionais completos, Suspense fallback robusto

### Risco #2: Lazy loading piora perceived performance
**Probabilidade**: BAIXA  
**Impacto**: MÉDIO  
**Mitigação**: Prefetch de rotas críticas, loading spinner elegante

### Risco #3: Terser minification quebra código
**Probabilidade**: BAIXA  
**Impacto**: ALTO  
**Mitigação**: Testes end-to-end, feature flags

---

## 📚 DOCUMENTAÇÃO NECESSÁRIA (ACT - PDCA)

1. **BUNDLE_OPTIMIZATION_PLAN.md** - Plano de ação detalhado
2. **BUNDLE_ANALYSIS_REPORT.md** - Relatório de análise antes/depois
3. **PERFORMANCE_GUIDE.md** - Guia de otimização de performance
4. **SPRINT_28_FINAL_REPORT.md** - Relatório PDCA completo

---

## ✅ DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os 35 tarefas completadas
- [ ] Bundle JS < 500 KB
- [ ] Bundle gzip < 150 KB
- [ ] Playwright testes aprovados (< 10s)
- [ ] Lighthouse Performance > 90
- [ ] Build frontend sem erros
- [ ] Build backend sem erros
- [ ] Deploy PM2 bem-sucedido
- [ ] Documentação completa
- [ ] Commit e push para GitHub
- [ ] Pull Request criada e aprovada

---

## 🎯 METAS ESTICAR (STRETCH GOALS)

Se tempo permitir:

1. **PWA Implementation** (T-28.31)
   - Service worker
   - Offline support
   - Add to home screen

2. **Font Optimization**
   - Preload critical fonts
   - Font-display: swap
   - Subset fonts

3. **Image Optimization** (se houver)
   - WebP format
   - Lazy loading
   - Responsive images

4. **CDN Setup** (opcional)
   - CloudFlare CDN
   - Asset caching
   - Global edge network

---

**Planejamento Criado**: 15 de novembro de 2025, 00:20 -03:00  
**Responsável**: AI Developer (Automated Execution)  
**Aprovador**: Product Owner (Usuário Final)  
**Próximo Passo**: Executar Sprint 28 (14-16 horas)
