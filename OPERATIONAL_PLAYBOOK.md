# 📚 PLAYBOOK OPERACIONAL
## Orquestrador de IAs V3.4.0

**Objetivo**: Guia completo para operação, manutenção e excelência do sistema

---

## 🎯 VISÃO GERAL

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE ACESSO                          │
│  http://192.168.192.164:3001                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE FRONTEND                          │
│  React 18.2 + TypeScript 5.3 + Vite 5                       │
│  Servido de: /home/flavio/webapp/dist/public                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE API                               │
│  tRPC 10.45 (168+ endpoints type-safe)                      │
│  Express 4.18 + WebSocket (Socket.IO)                       │
│  Processo: PM2 (orquestrador-v3)                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE DADOS                             │
│  MySQL 8.0.43 (48 tabelas)                                  │
│  Drizzle ORM 0.29.3                                         │
└─────────────────────────────────────────────────────────────┘
```

### Pontos Críticos de Monitoramento

1. **Porta 3001**: Deve estar aberta e acessível
2. **Processo PM2**: Deve estar "online" com 0 restarts
3. **Database**: Deve estar "connected"
4. **Memória**: < 400 MB é normal, > 500 MB requer atenção
5. **Health Endpoint**: Deve retornar HTTP 200 com "status": "ok"

---

## 📅 ROTINAS OPERACIONAIS

### Rotina Diária (5 minutos)

**Horário Recomendado**: 9:00 AM

```bash
cd /home/flavio/webapp

# 1. Verificar status do sistema
pm2 status

# 2. Executar health check
./health-monitor.sh

# 3. Verificar logs de erro
tail -50 logs/error.log

# 4. Validar acessibilidade
curl -s http://192.168.192.164:3001/api/health | jq

# 5. Verificar uso de recursos
pm2 info orquestrador-v3 | grep -A 5 "┌───────────────────"
```

**Resultado Esperado**:
- ✅ PM2 status: online
- ✅ Health check: SAUDÁVEL
- ✅ Logs: sem erros recentes
- ✅ API health: "status": "ok"
- ✅ Memória: < 400 MB

### Rotina Semanal (15 minutos)

**Horário Recomendado**: Sexta-feira 17:00

```bash
cd /home/flavio/webapp

# 1. Backup de logs
mkdir -p logs/archive
tar -czf logs/archive/logs-$(date +%Y%m%d).tar.gz logs/*.log
truncate -s 0 logs/*.log

# 2. Limpar cache do PM2
pm2 flush orquestrador-v3

# 3. Verificar atualizações de dependências
npm outdated | tee reports/npm-outdated-$(date +%Y%m%d).txt

# 4. Executar suite de testes completa
./teste-100pct-otimizado.sh | tee reports/tests-$(date +%Y%m%d).txt

# 5. Verificar integridade do git
git status
git log --oneline -5

# 6. Relatório de uptime
pm2 info orquestrador-v3 | grep "uptime\|restarts" | tee reports/uptime-$(date +%Y%m%d).txt

# 7. Health check completo com métricas
./health-monitor.sh > reports/health-$(date +%Y%m%d).txt
```

**Resultado Esperado**:
- ✅ Logs arquivados
- ✅ Cache limpo
- ✅ Testes: 28/28 passing
- ✅ Git: sem mudanças não commitadas
- ✅ Uptime: > 7 dias
- ✅ Health: SAUDÁVEL

### Rotina Mensal (30 minutos)

**Horário Recomendado**: Primeira sexta do mês, 14:00

```bash
cd /home/flavio/webapp

# 1. Backup completo de database
mkdir -p backups
mysqldump -u root -p orquestrador_ia > backups/db-$(date +%Y%m%d).sql

# 2. Backup de código e configuração
cd /home/flavio
tar -czf webapp/backups/code-$(date +%Y%m%d).tar.gz \
    webapp/ \
    --exclude='webapp/node_modules' \
    --exclude='webapp/dist' \
    --exclude='webapp/logs' \
    --exclude='webapp/backups'

cd /home/flavio/webapp

# 3. Otimizar database
mysql -u root -p -e "USE orquestrador_ia; OPTIMIZE TABLE conversation, message, aiModel, prompt, project;"

# 4. Atualizar dependências (se aprovado)
npm audit
# Se vulnerabilidades críticas: npm audit fix

# 5. Rebuild application
npm run build

# 6. Rolling restart (zero downtime)
pm2 reload orquestrador-v3

# 7. Validação pós-deploy
sleep 30
./teste-100pct-otimizado.sh

# 8. Limpar backups antigos (manter últimos 90 dias)
find backups/ -name "*.sql" -mtime +90 -delete
find backups/ -name "*.tar.gz" -mtime +90 -delete

# 9. Gerar relatório mensal
cat > reports/monthly-$(date +%Y%m).md << 'EOF'
# Relatório Mensal - $(date +%B/%Y)

## Métricas de Uptime
$(pm2 info orquestrador-v3 | grep "uptime\|restarts")

## Status de Saúde
$(./health-monitor.sh)

## Testes
$(./teste-100pct-otimizado.sh | tail -20)

## Logs de Erro (últimos 7 dias)
$(grep -c "ERROR" logs/error.log || echo "0") erros registrados

## Ações Tomadas
- Backup completo realizado
- Database otimizado
- Aplicação rebuilt
- Testes completos executados: PASS

## Próximas Ações
- [ ] Revisar logs de erro
- [ ] Planejar atualizações de dependências
- [ ] Avaliar performance e otimizações
EOF
```

**Resultado Esperado**:
- ✅ Backups criados e verificados
- ✅ Database otimizado
- ✅ Aplicação rebuilt sem erros
- ✅ Testes: 28/28 passing
- ✅ Relatório mensal gerado

---

## 🚨 PROCEDIMENTOS DE EMERGÊNCIA

### Alerta CRÍTICO: Sistema Offline

**Sintomas**:
- PM2 status: stopped/errored
- Porta 3001 não responde
- Health endpoint retorna erro

**Ação Imediata** (Tempo: 2 minutos):

```bash
cd /home/flavio/webapp

# 1. Diagnóstico rápido
pm2 status
netstat -tlnp | grep :3001
curl -I http://192.168.192.164:3001/api/health

# 2. Verificar logs
pm2 logs orquestrador-v3 --lines 20 --err

# 3. Restart forçado
pm2 stop orquestrador-v3
sleep 5
pm2 start ecosystem.config.cjs

# 4. Validação
sleep 15
./health-monitor.sh

# 5. Se não resolver, ver RECOVERY_PROCEDURES.md
```

### Alerta ALTO: Performance Degradada

**Sintomas**:
- Response time > 2 segundos
- CPU > 80%
- Memória > 500 MB

**Ação Imediata** (Tempo: 5 minutos):

```bash
# 1. Verificar recursos
./health-monitor.sh

# 2. Identificar processo pesado
pm2 monit

# 3. Verificar queries MySQL lentas
mysql -u root -p -e "SHOW PROCESSLIST;"

# 4. Flush cache e restart
pm2 flush orquestrador-v3
pm2 restart orquestrador-v3

# 5. Monitorar por 5 minutos
watch -n 10 './health-monitor.sh'
```

### Alerta MÉDIO: Database Connection Failed

**Sintomas**:
- Health endpoint: "database": "disconnected"
- Logs: "ECONNREFUSED" ou "Too many connections"

**Ação Imediata** (Tempo: 3 minutos):

```bash
# 1. Verificar MySQL
sudo systemctl status mysql

# 2. Se não estiver rodando:
sudo systemctl start mysql

# 3. Testar conexão
mysql -u root -p -e "SELECT 1"

# 4. Restart aplicação
pm2 restart orquestrador-v3

# 5. Validação
curl -s http://192.168.192.164:3001/api/health | jq '.database'
```

---

## 📊 MÉTRICAS E SLAs

### Service Level Agreements (SLAs)

| Métrica | Target | Medição | Ação se Abaixo |
|---------|--------|---------|----------------|
| Uptime | 99.9% | PM2 status | Recovery automático |
| Response Time | < 200ms | Health check | Investigar performance |
| Availability | 24/7 | Monitoramento | Alerta + recovery |
| Error Rate | < 0.1% | Logs | Análise de causa raiz |
| Recovery Time | < 5 min | Manual | Melhorar automação |

### Métricas de Sucesso

**Diárias**:
- Zero downtime não planejado
- Todos health checks: PASS
- Logs de erro: < 10 por dia

**Semanais**:
- Uptime: > 99.9%
- Testes automatizados: 100% pass
- Backup: executado com sucesso

**Mensais**:
- SLA de uptime: cumprido
- Dependências: atualizadas
- Documentação: revisada e atualizada

---

## 🔐 SEGURANÇA E COMPLIANCE

### Checklist de Segurança

- [ ] Logs não expõem dados sensíveis
- [ ] Credenciais em .env (não no código)
- [ ] Database backups são encriptados
- [ ] Acesso ao servidor é controlado
- [ ] PM2 roda com usuário não-root
- [ ] Dependências sem vulnerabilidades críticas

### Auditoria de Segurança (Trimestral)

```bash
# 1. Verificar vulnerabilidades npm
npm audit

# 2. Verificar permissões de arquivos
find /home/flavio/webapp -type f -perm /go+w

# 3. Verificar processos rodando
ps aux | grep node

# 4. Verificar portas abertas
netstat -tlnp

# 5. Gerar relatório
npm audit > reports/security-$(date +%Y%m%d).txt
```

---

## 📈 OTIMIZAÇÃO E PERFORMANCE

### Tuning de Performance

**Node.js Options**:
```bash
# Editar ecosystem.config.cjs:
node_args: [
  '--max-old-space-size=512',
  '--max-http-header-size=16384'
]
```

**PM2 Clustering** (Futuro):
```bash
# Para alta disponibilidade:
pm2 start ecosystem.config.cjs -i 2  # 2 instâncias
```

**Database Optimization**:
```sql
-- Criar índices para queries frequentes
CREATE INDEX idx_conversation_user ON conversation(userId);
CREATE INDEX idx_message_conversation ON message(conversationId);
CREATE INDEX idx_prompt_user ON prompt(userId);
```

### Monitoramento de Performance

```bash
# 1. Benchmark de APIs
ab -n 1000 -c 10 http://192.168.192.164:3001/api/health

# 2. Análise de queries lentas MySQL
mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"
mysql -u root -p -e "SET GLOBAL long_query_time = 1;"

# 3. Profile de aplicação Node.js
node --prof dist/server/index.js
```

---

## 📚 DOCUMENTAÇÃO DE REFERÊNCIA

### Estrutura de Diretórios

```
/home/flavio/webapp/
├── dist/                       # Build da aplicação
│   ├── public/                 # Frontend (React)
│   └── server/                 # Backend (Node.js)
├── server/                     # Código-fonte backend
│   ├── index.ts                # Entry point (BIND 0.0.0.0)
│   ├── routes/                 # tRPC routers
│   └── db/                     # Database schemas
├── src/                        # Código-fonte frontend
├── logs/                       # Logs da aplicação
│   ├── out.log                 # Stdout
│   ├── error.log               # Stderr
│   └── health-monitor.log      # Health checks
├── backups/                    # Backups de DB e config
├── reports/                    # Relatórios operacionais
├── ecosystem.config.cjs        # Configuração PM2
├── health-monitor.sh           # Monitor de saúde
├── teste-100pct-otimizado.sh   # Suite de testes
└── package.json                # Dependências npm
```

### Arquivos Críticos

| Arquivo | Propósito | Localização | Backup |
|---------|-----------|-------------|--------|
| ecosystem.config.cjs | Config PM2 | /home/flavio/webapp/ | Diário |
| .env | Variáveis de ambiente | /home/flavio/webapp/ | Diário |
| server/index.ts | Entry point | /home/flavio/webapp/server/ | Git |
| dump.pm2 | Estado PM2 | ~/.pm2/ | Após mudanças |

### Comandos Úteis de Referência Rápida

```bash
# PM2
pm2 status                           # Ver status
pm2 logs orquestrador-v3            # Ver logs
pm2 monit                           # Monitor em tempo real
pm2 restart orquestrador-v3         # Restart
pm2 reload orquestrador-v3          # Reload sem downtime
pm2 info orquestrador-v3            # Informações detalhadas
pm2 save                            # Salvar estado
pm2 resurrect                       # Restaurar estado

# Health Check
./health-monitor.sh                  # Check único
./health-monitor.sh --continuous     # Monitoramento contínuo
curl http://192.168.192.164:3001/api/health | jq

# Network
netstat -tlnp | grep :3001          # Verificar porta
lsof -i :3001                       # Ver processo na porta
ss -tlnp | grep :3001               # Alternativa ao netstat

# Database
mysql -u root -p orquestrador_ia    # Conectar ao DB
mysqldump -u root -p orquestrador_ia > backup.sql  # Backup
mysql -u root -p orquestrador_ia < backup.sql      # Restore

# Logs
tail -f logs/out.log                # Seguir stdout
tail -f logs/error.log              # Seguir stderr
grep -i "error" logs/*.log          # Buscar erros
```

---

## 🎓 TREINAMENTO E ONBOARDING

### Para Novos Operadores

**Dia 1**: Fundamentos
1. Ler este playbook completo
2. Executar rotina diária supervisionada
3. Executar health monitor e interpretar resultados
4. Praticar restart de serviço

**Dia 2**: Troubleshooting
1. Ler RECOVERY_PROCEDURES.md
2. Simular cenários de falha
3. Praticar recovery procedures
4. Executar rotina semanal

**Dia 3**: Autonomia
1. Executar rotina diária sem supervisão
2. Analisar logs e métricas
3. Gerar relatórios
4. Participar de revisão operacional

### Certificação de Operador

- [ ] Executa rotina diária com confiança
- [ ] Interpreta health checks corretamente
- [ ] Realiza recovery de falhas básicas
- [ ] Gera relatórios operacionais
- [ ] Conhece procedimentos de emergência
- [ ] Sabe quando escalar para nível superior

---

## ✅ CHECKLIST DE EXCELÊNCIA OPERACIONAL

### Diário
- [ ] Health check executado: PASS
- [ ] PM2 status: online
- [ ] Logs revisados: sem erros críticos
- [ ] API acessível: HTTP 200
- [ ] Database conectado: confirmed

### Semanal
- [ ] Logs arquivados
- [ ] Cache limpo
- [ ] Testes executados: 28/28 PASS
- [ ] Git sincronizado
- [ ] Relatório de uptime gerado

### Mensal
- [ ] Backup completo: realizado
- [ ] Database otimizado
- [ ] Dependências: auditadas
- [ ] Aplicação: rebuilt e testada
- [ ] Relatório mensal: publicado
- [ ] SLAs: cumpridos

### Trimestral
- [ ] Auditoria de segurança
- [ ] Revisão de documentação
- [ ] Avaliação de performance
- [ ] Planejamento de melhorias
- [ ] Treinamento de equipe

---

## 📞 ESCALAÇÃO E SUPORTE

### Matriz de Escalação

| Nível | Tempo de Resposta | Responsável | Contato |
|-------|-------------------|-------------|---------|
| L1 - Monitoring | Imediato | Health Monitor | Auto |
| L2 - Operator | 15 minutos | Operador | On-call |
| L3 - Developer | 1 hora | Dev Team | Email/Slack |
| L4 - Architect | 4 horas | Tech Lead | Phone |

### Quando Escalar

**Para L3 (Developer)**:
- Erro de código ou lógica de negócio
- Performance degradada persistente
- Necessidade de hotfix

**Para L4 (Architect)**:
- Falha de arquitetura
- Mudanças estruturais necessárias
- Capacidade esgotada

---

**Versão**: 1.0  
**Última Atualização**: 2025-11-01  
**Próxima Revisão**: 2025-12-01  
**Mantido por**: GenSpark AI Developer Team
