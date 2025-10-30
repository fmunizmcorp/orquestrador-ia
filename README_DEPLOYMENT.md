# 🚀 Guia de Deploy - Orquestrador de IAs V3.0

## Para Usuários Não-Técnicos

Este guia foi criado para que você possa fazer o deploy do sistema **sem precisar conhecer programação**.

---

## ⚡ Deploy em 1 Comando

**O jeito mais fácil de fazer deploy:**

```bash
curl -fsSL https://raw.githubusercontent.com/fmunizmcorp/orquestrador-ia/main/deploy.sh | bash
```

Copie o comando acima, cole no terminal do seu servidor (192.168.1.247) e pressione ENTER.

**Pronto!** O script vai fazer TUDO automaticamente:
- ✅ Verificar se tudo está instalado
- ✅ Baixar o código
- ✅ Instalar dependências
- ✅ Configurar banco de dados
- ✅ Compilar aplicação
- ✅ Iniciar sistema
- ✅ Configurar servidor web
- ✅ Corrigir problemas automaticamente

---

## 📋 Pré-requisitos (o script verifica automaticamente)

Seu servidor precisa ter:
- ✅ Ubuntu 22.04 ou superior
- ✅ Node.js 20+ (o script instala se não tiver)
- ✅ MySQL (o script verifica se está rodando)
- ✅ Conexão com internet

**Não se preocupe!** O script verifica tudo e instala o que estiver faltando.

---

## 🎯 O que acontece durante o deploy?

### Etapa 1: Verificação (1 minuto)
```
📋 Verificando pré-requisitos...
✓ Node.js instalado: v20.x.x
✓ npm instalado: 10.x.x
✓ MySQL instalado: 8.x.x
✓ PM2 instalado
```

### Etapa 2: Download do Código (1 minuto)
```
📥 Baixando código do GitHub...
✓ Código atualizado
```

### Etapa 3: Instalação (2-3 minutos)
```
📦 Instalando dependências...
✓ Dependências instaladas
```

### Etapa 4: Banco de Dados (1 minuto)
```
🗄️ Configurando banco de dados...
✓ Banco criado: orquestraia
✓ 28 tabelas criadas
✓ Dados iniciais inseridos
```

### Etapa 5: Compilação (2-3 minutos)
```
🔨 Compilando aplicação...
✓ Build concluído
```

### Etapa 6: Inicialização (30 segundos)
```
🚀 Iniciando aplicação...
✓ Aplicação iniciada com PM2
✓ 2 instâncias rodando
```

### Etapa 7: Configuração Web (30 segundos)
```
🌐 Configurando Nginx...
✓ Nginx configurado
```

### Etapa 8: Verificação Final (30 segundos)
```
✅ Verificando status...
✓ Aplicação online
✓ Health check OK
✓ Todos endpoints funcionando
```

**TEMPO TOTAL: 8-12 minutos**

---

## ✅ Como saber se deu certo?

Depois que o script terminar, você verá:

```
╔════════════════════════════════════════════════════════════════╗
║                  DEPLOY CONCLUÍDO COM SUCESSO!                 ║
╚════════════════════════════════════════════════════════════════╝

📍 Aplicação disponível em: http://192.168.1.247:3000
📊 Status: online
✅ Sucessos: 45 | ⚠️  Avisos: 2 | ❌ Erros: 0

📂 Logs completos:
   - /home/flavio/orquestrador-v3/deployment-logs/deploy_20251030_143022.log
   - /home/flavio/orquestrador-v3/deployment-logs/report_20251030_143022.md

📚 Logs enviados para:
   https://github.com/fmunizmcorp/orquestrador-ia/tree/deployment-logs/deployment-logs

🎉 Sistema pronto para uso!
```

---

## 🌐 Acessando o Sistema

Depois do deploy, abra seu navegador e acesse:

**http://192.168.1.247:3000**

Você verá a página de login. Use as credenciais:
- **Email**: admin@orquestrador.com
- **Senha**: admin123

**IMPORTANTE**: Troque a senha após o primeiro login!

---

## 🔍 Verificando Status

Para ver se tudo está funcionando:

```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs orquestrador-ia

# Ver uso de CPU e memória
pm2 monit
```

---

## 🆘 Se algo der errado

### O script se autocorrige!

Se o script encontrar um problema, ele vai tentar corrigir automaticamente:

```
❌ Falha na etapa: npm_install
ℹ️  Tentando autocorrigir...
ℹ️  Limpando node_modules e package-lock.json...
ℹ️  Tentando npm install novamente...
✓ Corrigido com sucesso!
```

### Problemas Comuns e Soluções

#### 1. Porta 3000 já está em uso
```bash
# O script resolve automaticamente, mas se precisar fazer manual:
sudo lsof -ti:3000 | xargs kill -9
```

#### 2. MySQL não está rodando
```bash
# O script tenta iniciar, mas se precisar fazer manual:
sudo systemctl start mysql
sudo systemctl status mysql
```

#### 3. Aplicação não inicia
```bash
# Ver o que está acontecendo:
pm2 logs orquestrador-ia --lines 50

# Tentar reiniciar:
pm2 restart orquestrador-ia
```

#### 4. Health check falha
```bash
# Verificar se a aplicação está rodando:
curl http://localhost:3000/api/health

# Se não responder, ver logs:
pm2 logs orquestrador-ia
```

---

## 🔄 Fazendo Rollback (Voltar para Versão Anterior)

Se o novo deploy tiver problemas, você pode voltar:

```bash
# Baixar script de rollback
curl -O https://raw.githubusercontent.com/fmunizmcorp/orquestrador-ia/main/rollback.sh
chmod +x rollback.sh

# Executar rollback
./rollback.sh

# Ou especificar um timestamp específico (se souber):
./rollback.sh 20251030_143022
```

O rollback vai:
- ✅ Parar aplicação
- ✅ Voltar código para versão anterior
- ✅ Restaurar banco de dados
- ✅ Reiniciar aplicação

---

## 📊 Monitoramento

### Ver logs em tempo real
```bash
pm2 logs orquestrador-ia
```

### Ver status das instâncias
```bash
pm2 status
```

### Ver uso de recursos
```bash
pm2 monit
```

### Ver logs do sistema
```bash
# Logs da aplicação
tail -f /home/flavio/orquestrador-v3/logs/pm2-combined.log

# Logs de erro
tail -f /home/flavio/orquestrador-v3/logs/pm2-error.log

# Logs do Nginx
sudo tail -f /var/log/nginx/orquestrador_access.log
sudo tail -f /var/log/nginx/orquestrador_error.log
```

---

## 🔧 Comandos Úteis

### Reiniciar aplicação
```bash
pm2 restart orquestrador-ia
```

### Parar aplicação
```bash
pm2 stop orquestrador-ia
```

### Iniciar aplicação
```bash
pm2 start orquestrador-ia
```

### Ver informações detalhadas
```bash
pm2 show orquestrador-ia
```

### Limpar logs antigos
```bash
pm2 flush orquestrador-ia
```

---

## 📈 Logs no GitHub

**Todos os logs são automaticamente enviados para o GitHub!**

Você pode ver os logs em:
https://github.com/fmunizmcorp/orquestrador-ia/tree/deployment-logs/deployment-logs

Isso permite que outra IA analise os logs e sugira correções.

---

## 🎓 Perguntas Frequentes

### 1. Quanto tempo demora o deploy?
**Resposta**: Entre 8 e 12 minutos para deploy completo.

### 2. Preciso parar a aplicação antiga antes?
**Resposta**: Não! O script faz isso automaticamente.

### 3. Meus dados serão perdidos?
**Resposta**: Não! O script faz backup do banco antes de atualizar.

### 4. Como atualizar para uma nova versão?
**Resposta**: Execute o mesmo comando de deploy. Ele baixa a versão mais recente.

### 5. Como ver se está tudo funcionando?
**Resposta**: Acesse http://192.168.1.247:3000 e faça login.

### 6. Onde ficam os backups?
**Resposta**: Em `/home/flavio/orquestrador-v3/deployment-logs/backup_[TIMESTAMP].sql`

### 7. Como acessar o banco de dados?
```bash
mysql -uflavio -pbdflavioia orquestraia
```

### 8. Como atualizar apenas o código (sem recriar banco)?
```bash
cd /home/flavio/orquestrador-v3
git pull origin main
npm install
npm run build
pm2 restart orquestrador-ia
```

---

## 📞 Suporte

Se precisar de ajuda:

1. **Primeiro**: Verifique os logs
   ```bash
   pm2 logs orquestrador-ia --lines 50
   ```

2. **Segundo**: Veja o relatório de deploy
   ```bash
   cat /home/flavio/orquestrador-v3/deployment-logs/report_*.md | tail -100
   ```

3. **Terceiro**: Envie os logs para análise
   - Os logs já estão no GitHub automaticamente
   - Compartilhe o link: https://github.com/fmunizmcorp/orquestrador-ia/tree/deployment-logs/deployment-logs

4. **Quarto**: Tente rollback
   ```bash
   ./rollback.sh
   ```

---

## ✨ Recursos Avançados (Opcional)

### Deploy Automático com Webhook

Você pode configurar deploy automático quando houver push no GitHub:

1. Instalar webhook listener:
```bash
npm install -g webhook
```

2. Criar arquivo de configuração:
```bash
cat > /home/flavio/webhook.json << 'EOF'
[
  {
    "id": "orquestrador-deploy",
    "execute-command": "/home/flavio/orquestrador-v3/deploy.sh",
    "command-working-directory": "/home/flavio/orquestrador-v3",
    "trigger-rule": {
      "match": {
        "type": "payload-hmac-sha1",
        "secret": "seu-secret-aqui",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF
```

3. Iniciar webhook:
```bash
webhook -hooks /home/flavio/webhook.json -verbose
```

4. Configurar no GitHub:
   - Ir em Settings → Webhooks → Add webhook
   - URL: http://192.168.1.247:9000/hooks/orquestrador-deploy
   - Content type: application/json
   - Secret: seu-secret-aqui
   - Eventos: Just the push event

Agora toda vez que você fizer push no GitHub, o deploy acontece automaticamente!

---

## 🎉 Conclusão

O sistema está pronto para uso!

**URL de Acesso**: http://192.168.1.247:3000

**Credenciais Iniciais**:
- Email: admin@orquestrador.com
- Senha: admin123

**Próximos Passos**:
1. ✅ Fazer login
2. ✅ Trocar senha
3. ✅ Criar usuários
4. ✅ Começar a usar!

---

**Versão**: 3.0  
**Última Atualização**: 2025-10-30  
**Autor**: Orquestrador de IAs Team  
**Licença**: MIT
