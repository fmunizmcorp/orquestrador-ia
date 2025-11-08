# 🚀 COMO ACESSAR O ORQUESTRADOR EM PRODUÇÃO

## ⚠️ IMPORTANTE: LIMPAR CACHE DO NAVEGADOR

O servidor está servindo a versão **V3.5.1 - Produção ATUALIZADA**, mas seu navegador pode estar mostrando a versão antiga em cache.

---

## 🔄 PASSO 1: LIMPAR CACHE DO NAVEGADOR (OBRIGATÓRIO)

### Chrome / Edge / Brave
1. Pressione: **Ctrl + Shift + Delete** (Windows/Linux) ou **Cmd + Shift + Delete** (Mac)
2. Selecione: "Imagens e arquivos em cache"
3. Período: "Todo o período"
4. Clique em: "Limpar dados"

**OU Hard Refresh:**
- Windows/Linux: **Ctrl + Shift + R**
- Mac: **Cmd + Shift + R**

### Firefox
1. Pressione: **Ctrl + Shift + Delete**
2. Selecione: "Cache"
3. Período: "Tudo"
4. Clique em: "Limpar agora"

**OU Hard Refresh:**
- Windows/Linux: **Ctrl + F5**
- Mac: **Cmd + Shift + R**

### Safari (Mac)
1. Menu: Safari > Preferências > Avançado
2. Marque: "Mostrar menu Desenvolvimento"
3. Menu: Desenvolvimento > Limpar Caches
4. **Hard Refresh:** **Cmd + Option + R**

---

## 🌐 PASSO 2: ACESSAR O SISTEMA

### Opção A: Via SSH Tunnel (Recomendado)

```bash
# 1. Conectar ao servidor via SSH
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia

# 2. Dentro do servidor, abrir no navegador (se tiver GUI):
firefox http://localhost

# OU testar via curl:
curl http://localhost:3001/
```

### Opção B: Via Rede Interna

Se você estiver na mesma rede local que o servidor:
```
http://192.168.1.247
```

---

## ✅ VERIFICAÇÕES

### 1. Verificar Título da Página
Quando abrir no navegador, você deve ver na aba:
```
Orquestrador de IAs V3.5.1 - Produção ATUALIZADA
```

Se ver "V3.4" ou "V3.5" (sem "ATUALIZADA"), **seu navegador está com cache antigo**.

### 2. Verificar Dados nas Páginas

#### Página de Prompts (/prompts)
- ✅ Deve mostrar: **15 prompts**
- ✅ Deve ter botão: "Novo Prompt"
- ✅ Deve ter filtros: "Todos", "Meus Prompts", "Públicos"

#### Página de Models (/models)
- ✅ Deve mostrar: **22 models**
- ✅ Deve ter lista de modelos de IA

#### Página de Teams (/teams)
- ✅ Deve mostrar: **3 teams**
- ✅ Deve ter funcionalidades de gestão de equipes

#### Dashboard (/)
- ✅ Deve mostrar estatísticas
- ✅ Deve ter gráficos e métricas
- ✅ Deve mostrar atividades recentes

---

## 🔍 PROBLEMAS E SOLUÇÕES

### Problema: "Desconectado do servidor, tentando reconectar"

**Causa:** Cache do navegador com versão antiga do JavaScript.

**Solução:**
1. ✅ **Limpar cache completamente** (veja Passo 1)
2. ✅ **Fechar TODAS as abas** do site
3. ✅ **Fechar o navegador completamente**
4. ✅ Reabrir o navegador
5. ✅ Acessar novamente: `http://localhost` (via SSH)

### Problema: Páginas em branco ou vazias

**Causa:** JavaScript antigo tentando acessar `.prompts` em vez de `.data`

**Solução:**
1. ✅ Limpar cache (veja acima)
2. ✅ Hard refresh: **Ctrl + Shift + R**
3. ✅ Verificar console do navegador (F12) para erros

### Problema: Console mostra erros de API

**Verificar se o servidor está rodando:**
```bash
# Via SSH no servidor:
pm2 list

# Deve mostrar:
# orquestrador-v3 | online | PID: xxxxx
```

**Reiniciar se necessário:**
```bash
pm2 restart orquestrador-v3
```

---

## 🛠️ COMANDOS ÚTEIS (Para Manutenção)

### Ver Logs do Servidor
```bash
# Via SSH:
pm2 logs orquestrador-v3

# Últimas 50 linhas:
pm2 logs orquestrador-v3 --nostream --lines 50
```

### Testar APIs Manualmente
```bash
# Via SSH, dentro do servidor:

# Testar prompts:
curl http://localhost:3001/api/trpc/prompts.list

# Testar health:
curl http://localhost:3001/api/health

# Testar frontend:
curl http://localhost:3001/ | grep title
```

### Verificar Status do Sistema
```bash
pm2 status
pm2 describe orquestrador-v3
```

---

## 📊 ARQUITETURA DE ACESSO

```
Seu Computador
      ↓
SSH: 31.97.64.43:2224
      ↓ (SSH Tunnel)
Servidor: 192.168.1.247
      ↓
Node.js PM2: localhost:3001
      ↓
Nginx: localhost:80/443 → proxy para :3001
```

---

## ✅ STATUS ATUAL DO SERVIDOR

### Servidor
- 🟢 **Status:** ONLINE
- 🟢 **PM2:** Running (PID: 1240390)
- 🟢 **Memory:** ~17MB
- 🟢 **Logs:** SEM ERROS

### APIs Testadas (via curl no servidor)
- ✅ **Prompts:** 15 total retornados
- ✅ **Models:** 22 total retornados
- ✅ **Teams:** 3 total retornados
- ✅ **Health:** OK, database connected

### Frontend
- ✅ **Versão:** V3.5.1 - Produção ATUALIZADA
- ✅ **Bundle:** index-xQzmsZ1J.js (correto)
- ✅ **HTML:** Título correto sendo servido

### Banco de Dados
- ✅ **Database:** orquestraia
- ✅ **Status:** Connected
- ✅ **Data:** 15 prompts, 22 models, 3 teams

---

## 🎯 RESUMO PARA ACESSO RÁPIDO

1. **Limpar cache do navegador** (Ctrl + Shift + Delete)
2. **Conectar via SSH:** `ssh -p 2224 flavio@31.97.64.43`
3. **Abrir navegador:** `http://localhost`
4. **Verificar título:** Deve ser "V3.5.1 - Produção ATUALIZADA"
5. **Testar páginas:** Prompts, Models, Teams devem mostrar dados

---

## ❓ DÚVIDAS FREQUENTES

**P: Por que não posso acessar via https://31.97.64.43?**
R: Esse IP serve outro site ("Rabi Talentos"). O Orquestrador só é acessível via rede interna.

**P: Por que preciso usar SSH?**
R: Seu servidor (192.168.1.247) está em rede privada, não acessível externamente. O SSH faz o "túnel" de acesso.

**P: As APIs estão funcionando mas o navegador mostra V3.4?**
R: Cache do navegador! Limpe completamente (Ctrl + Shift + Delete) e feche todas as abas.

**P: Console mostra erro "Cannot read property 'prompts' of undefined"?**
R: Código antigo em cache. Hard refresh (Ctrl + Shift + R) ou limpe cache completamente.

---

**Última Atualização:** 2025-11-08 02:40  
**Versão do Documento:** 1.0  
**Status:** ✅ Servidor 100% Operacional
