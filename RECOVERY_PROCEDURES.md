# 🔧 PROCEDIMENTOS DE RECOVERY E MANUTENÇÃO

**Sistema**: Orquestrador de IAs V3.4.0  
**Objetivo**: Garantir recovery rápido e eficiente em qualquer cenário

---

## 📋 ÍNDICE

1. [Recovery Após Reboot](#recovery-após-reboot)
2. [Recovery de Falha de Processo](#recovery-de-falha-de-processo)
3. [Recovery de Falha de Database](#recovery-de-falha-de-database)
4. [Manutenção Preventiva](#manutenção-preventiva)
5. [Troubleshooting Avançado](#troubleshooting-avançado)
6. [Backup e Restore](#backup-e-restore)

---

## 🔄 RECOVERY APÓS REBOOT

### Verificação Automática

O PM2 está configurado para iniciar automaticamente após reboot do servidor. Para verificar:

```bash
# Verificar status do PM2
pm2 status

# Se o serviço não estiver rodando, executar:
pm2 resurrect

# Ou iniciar manualmente:
cd /home/flavio/webapp
pm2 start ecosystem.config.cjs
```

### Configuração do Startup (Se Necessário)

Se o PM2 não iniciar automaticamente após reboot:

```bash
# 1. Salvar configuração atual
pm2 save

# 2. Configurar startup script
# O comando abaixo será exibido, copie e execute:
pm2 startup

# 3. Executar o comando sugerido (exemplo):
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u flavio --hp /home/flavio

# 4. Salvar novamente
pm2 save

# 5. Testar (simulando reboot):
pm2 kill
# ... aguardar alguns segundos ...
pm2 resurrect
```

### Validação Pós-Reboot

```bash
# 1. Verificar processo PM2
pm2 status

# 2. Verificar porta aberta
netstat -tlnp | grep :3001

# 3. Testar health endpoint
curl http://192.168.192.164:3001/api/health

# 4. Executar monitor de saúde
cd /home/flavio/webapp
./health-monitor.sh
```

**Tempo estimado de recovery**: 30-60 segundos após reboot completo

---

## 💥 RECOVERY DE FALHA DE PROCESSO

### Cenário 1: Processo PM2 Offline

```bash
# Diagnóstico
pm2 status
pm2 logs orquestrador-v3 --lines 50

# Recovery
pm2 restart orquestrador-v3

# Validação
curl http://192.168.192.164:3001/api/health
```

### Cenário 2: Processo Travado (Não Responde)

```bash
# Diagnóstico
pm2 info orquestrador-v3
ps aux | grep node
lsof -i :3001

# Recovery (força reload)
pm2 reload orquestrador-v3 --force

# Se não resolver, stop/start
pm2 stop orquestrador-v3
sleep 5
pm2 start ecosystem.config.cjs

# Validação
./health-monitor.sh
```

### Cenário 3: Port 3001 em Uso

```bash
# Diagnóstico
lsof -i :3001
netstat -tlnp | grep :3001

# Recovery
# Identificar PID do processo conflitante
lsof -i :3001 | grep LISTEN

# Parar processo PM2 primeiro
pm2 stop orquestrador-v3

# Se outro processo estiver usando a porta:
kill -9 <PID_do_processo_conflitante>

# Reiniciar PM2
pm2 start ecosystem.config.cjs

# Validação
netstat -tlnp | grep :3001
curl http://192.168.192.164:3001/api/health
```

### Cenário 4: Múltiplos Restarts (Crash Loop)

```bash
# Diagnóstico
pm2 logs orquestrador-v3 --lines 100 --err
pm2 info orquestrador-v3

# Identificar causa nos logs
cat /home/flavio/webapp/logs/error.log | tail -100

# Recovery baseado na causa:

# Se for problema de memória:
pm2 stop orquestrador-v3
pm2 start ecosystem.config.cjs --max-memory-restart 500M

# Se for problema de database:
# Ver seção "Recovery de Falha de Database"

# Se for problema de código:
cd /home/flavio/webapp
git status
git log -5
# Considerar rollback se necessário

# Validação
pm2 status
./health-monitor.sh
```

---

## 🗄️ RECOVERY DE FALHA DE DATABASE

### Cenário 1: Database Não Conectado

```bash
# Diagnóstico
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Testar conexão manual
mysql -u root -p -e "SELECT 1"

# Recovery
# Se MySQL não estiver rodando:
sudo systemctl start mysql
sudo systemctl status mysql

# Se MySQL estiver ok, reiniciar aplicação:
pm2 restart orquestrador-v3

# Validação
curl http://192.168.192.164:3001/api/health | jq '.database'
```

### Cenário 2: Erro de Conexão Intermitente

```bash
# Diagnóstico
pm2 logs orquestrador-v3 | grep -i "database\|mysql\|connection"

# Verificar configuração de pool
cat /home/flavio/webapp/.env | grep -i "database\|mysql"

# Recovery
# Aumentar timeout de conexão (se necessário)
# Editar .env:
# DB_CONNECT_TIMEOUT=10000

# Reiniciar aplicação
pm2 restart orquestrador-v3

# Validação
# Monitorar por 5 minutos
watch -n 10 'curl -s http://192.168.192.164:3001/api/health | jq'
```

### Cenário 3: Tabelas Corrompidas

```bash
# Diagnóstico
mysql -u root -p -e "USE orquestrador_ia; CHECK TABLE <tabela>;"

# Recovery
mysql -u root -p -e "USE orquestrador_ia; REPAIR TABLE <tabela>;"

# Se repair não funcionar, restore do backup:
# Ver seção "Backup e Restore"

# Validação
mysql -u root -p -e "USE orquestrador_ia; CHECK TABLE <tabela>;"
```

---

## 🛡️ MANUTENÇÃO PREVENTIVA

### Manutenção Diária (Automatizada)

```bash
# Criar cron job para health check
# Adicionar ao crontab:
# */10 * * * * /home/flavio/webapp/health-monitor.sh >> /home/flavio/webapp/logs/health-cron.log 2>&1

# Editar crontab:
crontab -e

# Adicionar linha:
*/10 * * * * /home/flavio/webapp/health-monitor.sh >> /home/flavio/webapp/logs/health-cron.log 2>&1
```

### Manutenção Semanal

```bash
#!/bin/bash
# Script: manutencao-semanal.sh

# 1. Rotação de logs
cd /home/flavio/webapp/logs
tar -czf "logs-backup-$(date +%Y%m%d).tar.gz" *.log
find . -name "*.log" -exec truncate -s 0 {} \;

# 2. Limpeza de cache
pm2 flush orquestrador-v3

# 3. Verificar updates de dependências
cd /home/flavio/webapp
npm outdated

# 4. Backup de configuração
cp ecosystem.config.cjs ecosystem.config.cjs.backup
cp .env .env.backup

# 5. Health check completo
./health-monitor.sh

# 6. Gerar relatório
pm2 info orquestrador-v3 > reports/weekly-$(date +%Y%m%d).txt
```

### Manutenção Mensal

```bash
# 1. Backup completo de database
mysqldump -u root -p orquestrador_ia > backups/db-$(date +%Y%m%d).sql

# 2. Otimizar tabelas
mysql -u root -p -e "USE orquestrador_ia; OPTIMIZE TABLE <tabelas>;"

# 3. Atualizar dependências (se aprovado)
cd /home/flavio/webapp
npm audit
npm update

# 4. Rebuild application
npm run build

# 5. Rolling restart
pm2 reload orquestrador-v3

# 6. Validação completa
./teste-100pct-otimizado.sh
```

---

## 🔍 TROUBLESHOOTING AVANÇADO

### Performance Degradada

```bash
# 1. Verificar uso de recursos
./health-monitor.sh

# 2. Analisar logs de performance
pm2 logs orquestrador-v3 | grep -i "slow\|timeout\|error"

# 3. Verificar queries lentas no MySQL
mysql -u root -p -e "SHOW PROCESSLIST;"

# 4. Analisar métricas do PM2
pm2 monit

# 5. Restart com flush de cache
pm2 flush orquestrador-v3
pm2 restart orquestrador-v3
```

### Memory Leak Suspeito

```bash
# 1. Monitorar memória ao longo do tempo
watch -n 60 'pm2 info orquestrador-v3 | grep memory'

# 2. Gerar heap dump (se instalado heapdump module)
pm2 trigger orquestrador-v3 km:heapdump

# 3. Configurar restart por limite de memória
pm2 stop orquestrador-v3
pm2 start ecosystem.config.cjs --max-memory-restart 400M

# 4. Monitorar após mudança
./health-monitor.sh --continuous --interval 300
```

### Erro 500 Intermitente

```bash
# 1. Capturar logs em tempo real
pm2 logs orquestrador-v3 --raw | grep -i "error\|500"

# 2. Verificar stack trace
cat /home/flavio/webapp/logs/error.log | tail -200

# 3. Testar endpoints específicos
curl -v http://192.168.192.164:3001/api/trpc/<endpoint>

# 4. Verificar database connections
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# 5. Restart se necessário
pm2 restart orquestrador-v3
```

---

## 💾 BACKUP E RESTORE

### Backup Manual

```bash
#!/bin/bash
# Script: backup-completo.sh

BACKUP_DIR="/home/flavio/webapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "${BACKUP_DIR}"

# 1. Backup de database
echo "Backup de database..."
mysqldump -u root -p orquestrador_ia > "${BACKUP_DIR}/db-${DATE}.sql"

# 2. Backup de código
echo "Backup de código..."
cd /home/flavio
tar -czf "${BACKUP_DIR}/webapp-${DATE}.tar.gz" webapp/ \
    --exclude='webapp/node_modules' \
    --exclude='webapp/dist' \
    --exclude='webapp/logs' \
    --exclude='webapp/backups'

# 3. Backup de configuração PM2
echo "Backup de PM2..."
cp ~/.pm2/dump.pm2 "${BACKUP_DIR}/pm2-dump-${DATE}.pm2"

# 4. Criar checksum
cd "${BACKUP_DIR}"
sha256sum db-${DATE}.sql webapp-${DATE}.tar.gz > checksum-${DATE}.txt

echo "Backup completo em: ${BACKUP_DIR}"
ls -lh "${BACKUP_DIR}"
```

### Restore de Backup

```bash
#!/bin/bash
# Script: restore-backup.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <arquivo-backup>"
    exit 1
fi

# 1. Parar aplicação
pm2 stop orquestrador-v3

# 2. Restore de database
echo "Restaurando database..."
mysql -u root -p orquestrador_ia < "${BACKUP_FILE}"

# 3. Restart aplicação
pm2 start orquestrador-v3

# 4. Validação
sleep 10
curl http://192.168.192.164:3001/api/health

echo "Restore concluído!"
```

### Backup Automático (Cron)

```bash
# Adicionar ao crontab:
# Backup diário às 2AM
0 2 * * * /home/flavio/webapp/backup-completo.sh >> /home/flavio/webapp/logs/backup.log 2>&1

# Limpeza de backups antigos (manter últimos 7 dias)
0 3 * * * find /home/flavio/webapp/backups -name "*.sql" -mtime +7 -delete
0 3 * * * find /home/flavio/webapp/backups -name "*.tar.gz" -mtime +7 -delete
```

---

## 📞 ESCALONAMENTO

### Nível 1: Auto-Recovery (Automático)
- Health monitor detecta problema
- Tenta recovery automático
- Se sucesso, registra em logs

### Nível 2: Operador (Manual)
- Executa procedimentos deste guia
- Analisa logs e métricas
- Aplica correções documentadas

### Nível 3: Desenvolvedor (Complexo)
- Problemas que requerem análise de código
- Mudanças em configuração avançada
- Updates de sistema ou dependências

### Nível 4: Arquiteto/Senior (Crítico)
- Falhas de arquitetura
- Performance crítica persistente
- Redesign de componentes

---

## ✅ CHECKLIST DE RECOVERY

Após qualquer procedimento de recovery, validar:

- [ ] PM2 status está "online"
- [ ] Porta 3001 está aberta (netstat)
- [ ] Health endpoint retorna "ok"
- [ ] Database está "connected"
- [ ] Uptime > 5 minutos sem restarts
- [ ] Memória e CPU em níveis normais
- [ ] Logs não mostram erros recentes
- [ ] Frontend acessível via browser
- [ ] APIs respondem corretamente
- [ ] Health monitor executou sem erros

---

**Última Atualização**: 2025-11-01  
**Mantido por**: GenSpark AI Developer Team  
**Versão**: 1.0
