# 🚀 INSTRUÇÕES DE DEPLOY MANUAL - SPRINT 76

**Data**: 21 de novembro de 2025  
**Motivo**: Credenciais SSH não funcionam mais (expiradas/alteradas)  
**Build Validado**: ✅ Analytics-BBjfR7AZ.js (MD5: f9af257ef46ec009e2319d91423a88e0)

---

## ⚡ RESUMO RÁPIDO

O código está correto e o build local foi atualizado. Você precisa apenas fazer o deploy manual para o servidor de produção.

**Escolha UMA das opções abaixo** (recomendo Opção 1):

---

## 📦 OPÇÃO 1: Deploy via Git + Rebuild no Servidor (RECOMENDADO)

### Vantagens
- ✅ Mais seguro (usa source control)
- ✅ Rebuilda no servidor (garante compatibilidade)
- ✅ Mantém histórico completo

### Passo a Passo

```bash
# 1. Conectar no servidor
ssh flavio@191.252.92.251

# 2. Navegar para o diretório
cd /home/flavio/webapp

# 3. Verificar branch atual
git branch
# Deve estar em 'genspark_ai_developer' ou 'main'

# 4. Pull das mudanças (após o commit ser pusheado)
git fetch origin
git pull origin genspark_ai_developer  # ou 'main' se já foi merged

# 5. Limpar cache Vite
rm -rf node_modules/.vite .vite client/node_modules/.vite

# 6. Rebuild completo
npm run build

# 7. Verificar bundle gerado
ls -lh dist/client/assets/Analytics-*.js
md5sum dist/client/assets/Analytics-*.js
# Esperado: f9af257ef46ec009e2319d91423a88e0

# 8. Reiniciar PM2
pm2 restart all

# 9. Verificar status
pm2 status
pm2 logs --nostream --lines 20

# 10. Sair do SSH
exit
```

### Validação

Abrir navegador em: `http://191.252.92.251/analytics`

- ✅ Deve carregar sem erros
- ✅ Console do navegador (F12) não deve mostrar "Error #310"
- ✅ Dados devem aparecer corretamente

---

## 📤 OPÇÃO 2: Deploy via SCP (Upload Direto)

### Vantagens
- ✅ Rápido (não precisa rebuild no servidor)
- ✅ Usa build já validado localmente

### Desvantagens
- ⚠️ Não atualiza código fonte no servidor
- ⚠️ Pode haver incompatibilidade se versões de Node forem diferentes

### Passo a Passo

```bash
# NO SEU COMPUTADOR LOCAL (ou onde está o código)

# 1. Verificar que você tem o build atualizado
ls -lh /home/user/webapp/dist/client/assets/Analytics-*.js
md5sum /home/user/webapp/dist/client/assets/Analytics-*.js
# Deve mostrar: f9af257ef46ec009e2319d91423a88e0

# 2. Fazer backup do build atual no servidor
ssh flavio@191.252.92.251 "cd /home/flavio/webapp && cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)"

# 3. Copiar dist/client para o servidor
scp -r /home/user/webapp/dist/client/* flavio@191.252.92.251:/home/flavio/webapp/dist/client/

# 4. Copiar dist/server para o servidor
scp -r /home/user/webapp/dist/server/* flavio@191.252.92.251:/home/flavio/webapp/dist/server/

# 5. (OPCIONAL) Copiar código fonte também
scp -r /home/user/webapp/client/src/* flavio@191.252.92.251:/home/flavio/webapp/client/src/

# 6. Reiniciar PM2 no servidor
ssh flavio@191.252.92.251 "pm2 restart all"

# 7. Verificar status
ssh flavio@191.252.92.251 "pm2 status && pm2 logs --nostream --lines 20"
```

### Validação

Abrir navegador em: `http://191.252.92.251/analytics`

---

## 🔧 OPÇÃO 3: Deploy via SFTP (Interface Gráfica)

### Vantagens
- ✅ Visual (mais fácil para quem prefere GUI)
- ✅ Controle total sobre o que é enviado

### Ferramentas Recomendadas
- FileZilla (Windows, Mac, Linux)
- WinSCP (Windows)
- Cyberduck (Mac)

### Passo a Passo

1. **Abrir cliente SFTP**:
   - Host: `191.252.92.251`
   - User: `flavio`
   - Port: `22`
   - Protocolo: SFTP

2. **Navegar no servidor**:
   - Ir para `/home/flavio/webapp`

3. **Fazer backup** (opcional mas recomendado):
   - Renomear pasta `dist` para `dist.backup.YYYYMMDD`

4. **Upload dos arquivos**:
   - Upload LOCAL: `/home/user/webapp/dist/client/*`
   - Para SERVIDOR: `/home/flavio/webapp/dist/client/`
   
   - Upload LOCAL: `/home/user/webapp/dist/server/*`
   - Para SERVIDOR: `/home/flavio/webapp/dist/server/`

5. **Reiniciar aplicação** (via SSH):
   ```bash
   ssh flavio@191.252.92.251 "pm2 restart all"
   ```

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY (TODAS AS OPÇÕES)

### 1. Verificar Bundle no Servidor

```bash
ssh flavio@191.252.92.251 << 'SSHEOF'
echo "📊 Verificando bundle..."
ls -lh /home/flavio/webapp/dist/client/assets/Analytics-*.js
echo ""
echo "🔑 MD5 Hash:"
md5sum /home/flavio/webapp/dist/client/assets/Analytics-*.js
echo ""
echo "✅ Esperado: f9af257ef46ec009e2319d91423a88e0"
SSHEOF
```

### 2. Verificar PM2 Status

```bash
ssh flavio@191.252.92.251 "pm2 status"
```

**Esperado**:
```
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name       │ mode        │ ↺       │ status  │ cpu      │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ orquestr   │ fork        │ N       │ online  │ 0%       │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### 3. Verificar Logs (30 segundos)

```bash
ssh flavio@191.252.92.251 "timeout 30 pm2 logs --nostream | grep -i 'error\|exception' || echo '✅ Nenhum erro detectado'"
```

### 4. Teste no Navegador

1. **Limpar cache do navegador** (importante!):
   - Chrome/Edge: `Ctrl+Shift+Delete` → Limpar cache
   - Firefox: `Ctrl+Shift+Delete` → Limpar cache
   - Safari: `Cmd+Option+E`

2. **Acessar Analytics**:
   - URL: `http://191.252.92.251/analytics`

3. **Abrir Console (F12)**:
   - Aba "Console"
   - **NÃO deve aparecer**: 
     - ❌ "Error: Minified React error #310"
     - ❌ "Too many re-renders"
   - **Deve aparecer**:
     - ✅ Logs normais de carregamento
     - ✅ Dados do Analytics

4. **Navegar pela página**:
   - Trocar período (24h, 7d, 30d)
   - Verificar gráficos carregando
   - **NÃO deve travar** ou mostrar erro

### 5. Monitoramento Contínuo (5 minutos)

Deixar a página aberta por 5 minutos e observar:
- ✅ Página deve permanecer funcional
- ✅ Dados devem atualizar (auto-refresh a cada 10s)
- ✅ Console não deve mostrar erros React

---

## 🔍 TROUBLESHOOTING

### Problema: Bundle não mudou no servidor

**Sintoma**: MD5 hash diferente do esperado

**Solução**:
```bash
# 1. Verificar se upload foi completo
ssh flavio@191.252.92.251 "ls -lh /home/flavio/webapp/dist/client/assets/Analytics-*.js"

# 2. Forçar rebuild no servidor
ssh flavio@191.252.92.251 << 'SSHEOF'
cd /home/flavio/webapp
rm -rf dist node_modules/.vite .vite
npm run build
pm2 restart all
SSHEOF
```

### Problema: PM2 não reinicia

**Sintoma**: `pm2 restart all` falha

**Solução**:
```bash
# 1. Verificar status
ssh flavio@191.252.92.251 "pm2 status"

# 2. Se não houver processos, iniciar
ssh flavio@191.252.92.251 "pm2 start /home/flavio/webapp/dist/server/index.js --name orquestrador"

# 3. Salvar configuração
ssh flavio@191.252.92.251 "pm2 save"
```

### Problema: Erro persiste no navegador

**Sintoma**: Ainda vê "Error #310"

**Solução**:
1. **Limpar cache do navegador** (hard refresh):
   - Chrome: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)

2. **Verificar URL**:
   - ✅ Deve ser: `http://191.252.92.251/analytics`
   - ❌ NÃO: `http://localhost:3001/analytics`

3. **Modo incógnito**:
   - Abrir em aba anônima/privada
   - Testar novamente

### Problema: SSH não conecta

**Sintoma**: `Permission denied` ou timeout

**Solução**:
1. Verificar se servidor está acessível:
   ```bash
   ping 191.252.92.251
   ```

2. Verificar se SSH está rodando:
   ```bash
   telnet 191.252.92.251 22
   ```

3. Verificar credenciais:
   - Usuário: `flavio`
   - Senha: (a que você usa normalmente)
   - Chave SSH: Se configurada

---

## 📋 CHECKLIST FINAL

Após deploy, marque cada item:

- [ ] Bundle no servidor tem MD5: `f9af257ef46ec009e2319d91423a88e0`
- [ ] PM2 status mostra "online"
- [ ] Logs PM2 não mostram erros React
- [ ] `http://191.252.92.251/analytics` carrega sem erros
- [ ] Console do navegador (F12) sem "Error #310"
- [ ] Página funciona normalmente (gráficos, dados, etc.)
- [ ] Auto-refresh funciona (dados atualizam a cada 10s)
- [ ] Página não trava após 5 minutos

**Se TODOS os items estiverem marcados**: ✅ **DEPLOY BEM-SUCEDIDO!**

---

## 🎉 DEPLOY BEM-SUCEDIDO?

**Parabéns!** O Bug #3 (React Error #310) está finalmente resolvido após 17 sprints!

### Próximos Passos

1. ✅ Marcar Sprint 76 como concluído
2. ✅ Atualizar Pull Request com status de sucesso
3. ✅ Monitorar por 24-48h
4. ✅ Merge do PR após confirmação

### Reportar Sucesso

Se o deploy funcionou, por favor informe:
- ✅ Hora do deploy
- ✅ Método usado (Opção 1, 2 ou 3)
- ✅ Screenshot da página Analytics funcionando
- ✅ Screenshot do console sem erros

---

## ❌ DEPLOY FALHOU?

Se ainda houver problemas após seguir todas as instruções:

1. **Coletar informações**:
   ```bash
   # Logs PM2
   ssh flavio@191.252.92.251 "pm2 logs --nostream --lines 50" > logs_pm2.txt
   
   # Bundle no servidor
   ssh flavio@191.252.92.251 "ls -lh /home/flavio/webapp/dist/client/assets/Analytics-*.js && md5sum /home/flavio/webapp/dist/client/assets/Analytics-*.js" > bundle_info.txt
   
   # Screenshot do erro no navegador (F12 Console)
   ```

2. **Reportar**:
   - Arquivo `logs_pm2.txt`
   - Arquivo `bundle_info.txt`
   - Screenshot do erro
   - Qual opção de deploy foi usada
   - Passos exatos que foram seguidos

3. **Fallback**:
   - Restaurar backup (se criou):
     ```bash
     ssh flavio@191.252.92.251 "cd /home/flavio/webapp && rm -rf dist && cp -r dist.backup.* dist"
     ```

---

**Documento criado por**: GenSpark AI Developer  
**Data**: 21 de novembro de 2025  
**Sprint**: 76  
**Build MD5**: f9af257ef46ec009e2319d91423a88e0
