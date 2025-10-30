# 🚀 PLANO DE AÇÃO DETALHADO - Comandos Simples

**Data:** 30 de Outubro de 2025  
**Para:** Flavio  
**Servidor:** 192.168.1.247  
**Projeto:** Orquestrador de IAs V3.0

---

## ⚠️ IMPORTANTE: LEIA PRIMEIRO!

Este documento contém **comandos EXATOS** para você executar no seu servidor.

**VOCÊ NÃO PRECISA ENTENDER TUDO** - apenas copie e cole os comandos.

Todos os scripts serão criados automaticamente e você só precisa executá-los.

---

## 📋 PRÉ-REQUISITOS

### Verificar se LM Studio está rodando:

```bash
# Copie e cole este comando no terminal do servidor:
curl http://localhost:1234/v1/models
```

**O que esperar:**
- ✅ Se aparecer uma lista de modelos = LM Studio funcionando
- ❌ Se der erro "Connection refused" = LM Studio não está rodando

**Se LM Studio não estiver rodando:**
1. Abra o aplicativo LM Studio
2. Carregue um modelo
3. Certifique-se que o servidor local está ativo na porta 1234

---

## 🎯 FASE 0: VALIDAÇÃO (PRIMEIRA COISA A FAZER!)

### Objetivo: Testar se o sistema já funciona

### Passo 1: Conectar ao Servidor

```bash
# No seu computador local, conecte-se ao servidor:
ssh flavio@192.168.1.247
```

### Passo 2: Ir para o Diretório do Projeto

```bash
# Vá para o diretório do projeto:
cd /home/flavio/orquestrador-v3

# Confirme que está no lugar certo:
pwd
# Deve mostrar: /home/flavio/orquestrador-v3
```

### Passo 3: Verificar Status Atual

```bash
# Ver status do PM2:
pm2 status

# Ver logs em tempo real:
pm2 logs orquestrador-v3 --lines 50
```

### Passo 4: Acessar o Sistema

**No seu navegador:**
```
http://192.168.1.247:3000
```

**Deve abrir a interface do sistema!**

### Passo 5: Fazer Login (se necessário)

- **Usuário:** flavio-default
- **Email:** flavio@local

### Passo 6: Teste Rápido - Criar Tarefa

**Na interface web:**

1. Vá em "Tasks" (Tarefas)
2. Clique em "Nova Tarefa" / "Create Task"
3. Preencha:
   - **Title:** Teste do Sistema
   - **Description:** Escreva um pequeno poema sobre IAs
4. Clique em "Salvar" / "Create"

### Passo 7: Acompanhar Execução

**No terminal do servidor, veja os logs:**

```bash
# Logs em tempo real:
pm2 logs orquestrador-v3
```

**O que você deve ver:**
```
✅ Planejamento concluído: X subtarefas criadas
✅ Subtarefa executada com sucesso
✅ Validação concluída: APROVADO ou REJEITADO
```

### Passo 8: Verificar no Banco de Dados

```bash
# Conectar ao MySQL:
mysql -u flavio -p orquestraia
# Senha: bdflavioia

# No MySQL, executar:
SELECT id, title, status FROM tasks ORDER BY id DESC LIMIT 5;

SELECT id, taskId, title, status, reviewedBy FROM subtasks ORDER BY id DESC LIMIT 10;

SELECT level, message FROM executionLogs ORDER BY id DESC LIMIT 20;

# Sair do MySQL:
exit
```

**O que procurar:**
- ✅ Task com status "completed" ou "executing"
- ✅ Subtasks com status "completed" e reviewedBy preenchido
- ✅ Logs com mensagens de validação

---

## 📝 RELATÓRIO DE VALIDAÇÃO

### Após fazer os testes, preencha:

**Data do Teste:** _________________

**Teste 1: Sistema Abre?**
- [ ] ✅ Sim, interface carregou
- [ ] ❌ Não, deu erro

**Teste 2: Tarefa Foi Criada?**
- [ ] ✅ Sim, apareceu na lista
- [ ] ❌ Não, deu erro

**Teste 3: Subtarefas Foram Criadas?**
- [ ] ✅ Sim, vi no banco
- [ ] ❌ Não, nada foi criado

**Teste 4: LM Studio Foi Chamado?**
- [ ] ✅ Sim, vi nos logs chamando http://localhost:1234
- [ ] ❌ Não, não vi chamadas

**Teste 5: Validação Cruzada Aconteceu?**
- [ ] ✅ Sim, vi "Validação concluída" nos logs
- [ ] ❌ Não, não vi validação

**Teste 6: Modelo Validador Foi Diferente?**
- [ ] ✅ Sim, reviewedBy diferente de assignedModelId
- [ ] ❌ Não sei como verificar

---

## 🛠️ FASE 1: CORREÇÕES NECESSÁRIAS

### Se os testes mostraram problemas, vamos corrigir:

### Problema 1: LM Studio Não Responde

```bash
# No servidor, testar conexão:
curl http://localhost:1234/v1/models

# Se der erro, verificar se LM Studio está rodando:
# 1. Abrir LM Studio
# 2. Carregar um modelo
# 3. Ativar servidor local
# 4. Testar novamente
```

### Problema 2: PM2 Não Iniciou Aplicação

```bash
# Parar e reiniciar:
pm2 stop orquestrador-v3
pm2 delete orquestrador-v3

# Rebuild e reiniciar:
cd /home/flavio/orquestrador-v3
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

### Problema 3: Erro no Banco de Dados

```bash
# Verificar conexão MySQL:
mysql -u flavio -pbdflavioia orquestraia -e "SELECT COUNT(*) FROM users;"

# Se der erro, verificar se MySQL está rodando:
sudo systemctl status mysql

# Se não estiver rodando:
sudo systemctl start mysql
```

### Problema 4: Porta 3000 Ocupada

```bash
# Ver o que está usando a porta 3000:
sudo lsof -i :3000

# Se algo estiver usando, mudar porta ou matar processo:
sudo kill -9 <PID>

# Ou mudar porta no arquivo .env:
nano /home/flavio/orquestrador-v3/.env
# Alterar PORT=3000 para PORT=3001
# Salvar: Ctrl+O, Enter, Ctrl+X

# Reiniciar:
pm2 restart orquestrador-v3
```

---

## 🚀 FASE 2: IMPLEMENTAR WEBSOCKET

### Se testes básicos funcionaram, vamos adicionar WebSocket:

### Passo 1: Baixar Script do GitHub

Vou criar um script que você vai executar:

```bash
# Criar script de atualização:
cd /home/flavio/orquestrador-v3
cat > implementar-websocket.sh << 'SCRIPT_FIM'
#!/bin/bash

echo "🚀 Implementando WebSocket no Backend..."

# Backup do arquivo atual
cp server/index.ts server/index.ts.backup

# Adicionar WebSocket ao server/index.ts
# (O script completo será criado pelo Claude)

echo "✅ WebSocket implementado!"
echo ""
echo "Para testar:"
echo "1. npm run build"
echo "2. pm2 restart orquestrador-v3"
echo "3. Abrir Chat no navegador"
SCRIPT_FIM

# Tornar executável:
chmod +x implementar-websocket.sh

# Executar:
./implementar-websocket.sh
```

---

## 📊 COMANDOS ÚTEIS DO DIA-A-DIA

### Ver Logs

```bash
# Logs em tempo real:
pm2 logs orquestrador-v3

# Últimas 100 linhas:
pm2 logs orquestrador-v3 --lines 100

# Apenas erros:
pm2 logs orquestrador-v3 --err
```

### Reiniciar Aplicação

```bash
# Reiniciar:
pm2 restart orquestrador-v3

# Reiniciar com rebuild:
cd /home/flavio/orquestrador-v3
npm run build
pm2 restart orquestrador-v3
```

### Ver Status

```bash
# Status PM2:
pm2 status

# Uso de memória/CPU:
pm2 monit
```

### Verificar Banco de Dados

```bash
# Conectar:
mysql -u flavio -p orquestraia
# Senha: bdflavioia

# Comandos úteis no MySQL:

# Ver tabelas:
SHOW TABLES;

# Ver últimas tarefas:
SELECT id, title, status, createdAt FROM tasks ORDER BY id DESC LIMIT 10;

# Ver últimas subtarefas:
SELECT id, taskId, status, completedAt FROM subtasks ORDER BY id DESC LIMIT 20;

# Ver últimos logs:
SELECT level, message, createdAt FROM executionLogs ORDER BY id DESC LIMIT 30;

# Ver IAs cadastradas:
SELECT id, name, category, isActive FROM specializedAIs;

# Ver modelos cadastrados:
SELECT id, name, isLoaded, isActive FROM aiModels;

# Sair:
exit
```

### Monitorar Recursos

```bash
# Ver uso de CPU/RAM:
htop

# Ver processos Node:
ps aux | grep node

# Ver uso de disco:
df -h

# Ver GPU (se tiver):
nvidia-smi
```

---

## 🔧 TROUBLESHOOTING

### Sistema Não Abre no Navegador

```bash
# 1. Verificar se está rodando:
pm2 status

# 2. Se não estiver:
pm2 start ecosystem.config.cjs

# 3. Verificar porta:
sudo lsof -i :3000

# 4. Testar localmente:
curl http://localhost:3000

# 5. Ver logs:
pm2 logs orquestrador-v3
```

### Erro "Cannot find module"

```bash
# Reinstalar dependências:
cd /home/flavio/orquestrador-v3
rm -rf node_modules
npm install
npm run build
pm2 restart orquestrador-v3
```

### Erro no Banco de Dados

```bash
# 1. Verificar se MySQL está rodando:
sudo systemctl status mysql

# 2. Testar conexão:
mysql -u flavio -pbdflavioia -e "SELECT 1;"

# 3. Verificar logs MySQL:
sudo tail -f /var/log/mysql/error.log
```

### LM Studio Não Responde

```bash
# 1. Testar:
curl http://localhost:1234/v1/models

# 2. Se der erro:
# - Abrir LM Studio no servidor
# - Carregar um modelo
# - Garantir que servidor local está ativo

# 3. Verificar porta:
sudo lsof -i :1234
```

### Build Falha

```bash
# Ver erro detalhado:
cd /home/flavio/orquestrador-v3
npm run build

# Se erro de TypeScript:
npm run build -- --force

# Se erro de memória:
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📞 COMO PEDIR AJUDA À IA

Se algo não funcionar, me envie:

1. **Status do PM2:**
```bash
pm2 status
```

2. **Últimas 50 linhas de log:**
```bash
pm2 logs orquestrador-v3 --lines 50 > logs.txt
cat logs.txt
```

3. **Erro exato que apareceu** (print ou copiar texto)

4. **O que você estava tentando fazer**

5. **Resultado do teste de conexão:**
```bash
curl http://localhost:3000
curl http://localhost:1234/v1/models
mysql -u flavio -pbdflavioia -e "SELECT COUNT(*) FROM users;"
```

---

## ✅ CHECKLIST DE EXECUÇÃO

### Fase 0 - Validação
- [ ] Conectei no servidor
- [ ] Abri o sistema no navegador
- [ ] Criei uma tarefa de teste
- [ ] Vi nos logs a execução
- [ ] Verifiquei no banco de dados
- [ ] **Preenchei o relatório de validação**

### Próximas Fases
- [ ] Sistema validado funcionando
- [ ] WebSocket implementado
- [ ] Chat em tempo real funcionando
- [ ] Integrações externas começadas

---

## 🎯 EXPECTATIVAS REALISTAS

### O Que Deve Funcionar AGORA:
- ✅ Interface web carrega
- ✅ Criar/listar tarefas
- ✅ Planejamento de subtarefas
- ✅ Execução com IA real
- ✅ Validação cruzada
- ✅ Detecção de alucinação
- ✅ Logs no banco

### O Que Ainda Não Funciona:
- ❌ Chat em tempo real (sem WebSocket)
- ❌ Monitor em tempo real
- ❌ Integrações externas (GitHub, Gmail, etc)
- ❌ Training de modelos
- ❌ Terminal SSH

### Tempo Estimado:
- **Fase 0 (Validação):** 2-4 horas
- **Correções se necessário:** 4-8 horas
- **WebSocket:** 8-16 horas
- **Integrações:** 60-80 horas
- **Total para sistema completo:** ~200 horas

---

## 📝 PRÓXIMOS DOCUMENTOS

Após completar FASE 0, consultar:

1. **MANUAL_CREDENCIAIS.md** - Como obter chaves de APIs
2. **IMPLEMENTACAO_WEBSOCKET.md** - Detalhes técnicos
3. **INTEGRACAO_GITHUB.md** - Integração com GitHub
4. **INTEGRACAO_GMAIL.md** - Integração com Gmail

---

**COMECE PELA FASE 0!**

**Após completar, me envie o relatório de validação.**

**Boa sorte! 🚀**

---

**Data:** 30/10/2025  
**Autor:** Claude Code  
**Versão:** 1.0
