# 🚀 SPRINT 77 - INSTRUÇÕES DE DEPLOY MANUAL

## 📋 STATUS ATUAL

**Data**: 2025-11-21  
**Sprint**: 77  
**Branch**: `genspark_ai_developer`  
**Commits**: 8e1317a, 5fd075d, e19f970  
**Status Code**: ✅ PRONTO PARA DEPLOY  
**Status Deploy**: ⏳ AGUARDANDO SERVIDOR SSH DISPONÍVEL

---

## 🔴 PROBLEMA DE CONECTIVIDADE

O servidor SSH gateway (`31.97.64.43:2224`) está temporariamente inacessível:

```
ssh: connect to host 31.97.64.43 port 2224: Connection timed out
```

**Possíveis causas**:
- Servidor SSH gateway offline
- Firewall bloqueando conexões
- Rede instável
- Manutenção do servidor

---

## ✅ O QUE JÁ ESTÁ PRONTO

1. ✅ **Correção implementada**: 6 arrays memoizados com `useMemo`
2. ✅ **Build validado localmente**: 28.49 KB, 9 useMemo detectados
3. ✅ **Commits no GitHub**: Tudo pushed para `genspark_ai_developer`
4. ✅ **Scripts de deploy criados**: 3 opções disponíveis
5. ✅ **Documentação completa**: 4 documentos técnicos
6. ✅ **PR #5 atualizado**: Com status correto

---

## 🎯 OPÇÕES DE DEPLOY

### **OPÇÃO 1: Script Automatizado (RECOMENDADO)**

Quando o servidor SSH estiver acessível, execute:

```bash
cd /home/user/webapp
./SPRINT_77_DEPLOY_AUTOMATIZADO.sh
```

**O que o script faz**:
- ✅ Testa conectividade com retry automático (3 tentativas)
- ✅ Conecta via SSH ao servidor de produção
- ✅ Faz backup do estado atual
- ✅ Atualiza código do GitHub
- ✅ Valida presença do Sprint 77 no código
- ✅ Limpa cache e builds anteriores
- ✅ Instala dependências
- ✅ Executa build de produção
- ✅ Verifica bundle e conta useMemo
- ✅ Reinicia PM2
- ✅ Testa endpoint HTTP
- ✅ Verifica logs por Error #310
- ✅ Gera relatório completo

---

### **OPÇÃO 2: Script Rápido via SSH**

Se você tiver acesso SSH manual:

```bash
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia

cd /home/flavio/orquestrador-ia
bash SPRINT_77_DEPLOY_RAPIDO.sh
```

---

### **OPÇÃO 3: Comandos Manuais Passo a Passo**

Se preferir executar manualmente:

#### 1. Conectar via SSH
```bash
ssh -p 2224 flavio@31.97.64.43
# Senha: sshflavioia
```

#### 2. Navegar para diretório
```bash
cd /home/flavio/orquestrador-ia
pwd  # Confirmar: /home/flavio/orquestrador-ia
```

#### 3. Atualizar código do GitHub
```bash
git fetch origin genspark_ai_developer
git reset --hard origin/genspark_ai_developer
git rev-parse --short HEAD  # Ver commit atual
```

#### 4. Verificar Sprint 77 no código
```bash
grep -n "SPRINT 77" client/src/components/AnalyticsDashboard.tsx | head -5
# Deve mostrar pelo menos 5 linhas com comentários Sprint 77
```

#### 5. Limpar cache
```bash
rm -rf node_modules/.vite .vite dist/client
```

#### 6. Instalar dependências
```bash
npm install
```

#### 7. Build de produção
```bash
NODE_ENV=production npm run build
```

#### 8. Verificar bundle
```bash
# Encontrar arquivo bundle Analytics
ls -lh dist/client/assets/Analytics-*.js

# Contar useMemo (deve ser >= 9)
grep -o "useMemo" dist/client/assets/Analytics-*.js | wc -l
```

#### 9. Reiniciar PM2
```bash
pm2 restart orquestrador-ia
pm2 list
```

#### 10. Aguardar e testar
```bash
sleep 10
curl -I http://localhost:3001
# Deve retornar HTTP/1.1 200 OK
```

#### 11. Verificar logs
```bash
pm2 logs orquestrador-ia --nostream --lines 50
```

#### 12. Verificar Error #310
```bash
pm2 logs orquestrador-ia --nostream --lines 200 | grep -i "error.*310"
# Não deve retornar nada (comando vazio = sucesso)
```

---

## 🧪 VALIDAÇÃO PÓS-DEPLOY

Após o deploy bem-sucedido, execute estes testes:

### **Teste 1: Endpoint HTTP**
```bash
curl http://localhost:3001
# Deve retornar HTML da aplicação
```

### **Teste 2: Health Check**
```bash
curl http://localhost:3001/api/health
# Deve retornar JSON com status "ok"
```

### **Teste 3: Analytics Dashboard**
```bash
curl -I http://localhost:3001/analytics
# Deve retornar 200 OK
```

### **Teste 4: Logs em Tempo Real**
```bash
pm2 logs orquestrador-ia
# Monitore por 5 minutos
# Não deve aparecer "Error #310"
```

### **Teste 5: Performance**
```bash
pm2 monit
# Verifique CPU e memória do processo
# Não deve ter picos constantes (indicaria loop)
```

---

## 📊 CRITÉRIOS DE SUCESSO

O deploy é considerado **BEM-SUCEDIDO** quando:

- ✅ **Código atualizado**: Commit do Sprint 77 presente
- ✅ **Build gerado**: Bundle com ~28-30 KB
- ✅ **useMemo no bundle**: >= 9 ocorrências
- ✅ **PM2 rodando**: Status "online"
- ✅ **HTTP 200**: Serviço respondendo
- ✅ **Logs limpos**: Sem Error #310 por 5 minutos
- ✅ **Performance estável**: CPU/memória normais

---

## 🚨 TROUBLESHOOTING

### Problema: Build falha
```bash
# Limpar tudo e tentar novamente
rm -rf node_modules dist .vite
npm install
npm run build
```

### Problema: PM2 não reinicia
```bash
# Verificar se processo existe
pm2 list

# Se não existir, iniciar
pm2 start ecosystem.config.js

# Se existir mas não responde
pm2 delete orquestrador-ia
pm2 start ecosystem.config.js
```

### Problema: Porta 3001 ocupada
```bash
# Ver o que está usando a porta
lsof -i :3001

# Matar processo se necessário
kill -9 <PID>

# Reiniciar PM2
pm2 restart orquestrador-ia
```

### Problema: Error #310 ainda aparece
```bash
# Verificar se código do Sprint 77 está presente
grep -c "useMemo" client/src/components/AnalyticsDashboard.tsx
# Deve retornar >= 9

# Verificar bundle
grep -c "useMemo" dist/client/assets/Analytics-*.js
# Deve retornar >= 9

# Se números estiverem errados, rebuild:
rm -rf dist
npm run build
pm2 restart orquestrador-ia
```

---

## 📞 INFORMAÇÕES TÉCNICAS

### Servidor SSH Gateway
- **Host**: 31.97.64.43
- **Port**: 2224
- **User**: flavio
- **Pass**: sshflavioia

### Servidor Produção (Interno)
- **IP**: 192.168.1.247
- **Dir**: /home/flavio/orquestrador-ia
- **PM2**: orquestrador-ia
- **Port**: 3001 (localhost only)

### Repositório GitHub
- **Repo**: fmunizmcorp/orquestrador-ia
- **Branch**: genspark_ai_developer
- **PR**: #5

### Arquivos Modificados
- `client/src/components/AnalyticsDashboard.tsx` (linhas 289-322)

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

1. ✅ Validar com 10 testes automatizados
2. ✅ Monitorar logs por 5 minutos
3. ✅ Confirmar ausência de Error #310
4. ✅ Solicitar merge do PR #5
5. ✅ Fechar Sprint 77 oficialmente
6. ✅ Documentar lições aprendidas

---

## 📝 NOTAS IMPORTANTES

- **Acesso**: Aplicação só é acessível via `localhost:3001` dentro do servidor
- **Rede interna**: Não é possível acessar de fora (192.168.1.247 é IP privado)
- **Outro site**: `31.97.64.43:3001` roda outro site, NÃO é este orquestrador
- **SSH gateway**: Único ponto de acesso ao servidor de produção

---

## 🔗 LINKS E REFERÊNCIAS

- **PR #5**: https://github.com/fmunizmcorp/orquestrador-ia/pull/5
- **Relatório Técnico**: `SPRINT_77_RELATORIO_TECNICO_COMPLETO.md`
- **Script Automatizado**: `SPRINT_77_DEPLOY_AUTOMATIZADO.sh`
- **Script Rápido**: `SPRINT_77_DEPLOY_RAPIDO.sh`
- **Credenciais SSH**: `.config/ssh_credentials.txt`

---

**📌 Última Atualização**: Sprint 77 - 2025-11-21  
**🎯 Status**: PRONTO PARA DEPLOY - Aguardando servidor SSH disponível
