# 🚀 Orquestrador de IAs V3.0

Sistema COMPLETO de orquestração de múltiplas IAs com validação cruzada obrigatória e detecção de alucinação.

## 📋 Características Principais

### ✅ Funcionalidades Implementadas (100%)

- **23 Tabelas MySQL** - Banco de dados completo
- **14 CRUDs Completos** - Todas as entidades gerenciáveis
- **7 Serviços Completos** - LM Studio, Orquestrador, Detecção de Alucinação, Puppeteer, etc
- **18 Páginas Frontend** - Interface completa
- **Integração LM Studio** - Leitura sob demanda com cache de 5 minutos
- **Orquestração Inteligente** - Validação cruzada OBRIGATÓRIA
- **Detecção de Alucinação** - Recuperação automática com ZERO perda
- **Automação Web** - Puppeteer para acesso inteligente à internet
- **Serviços Externos** - GitHub, Drive, Gmail, Sheets, Notion, Slack, Discord
- **Monitoramento Completo** - CPU, RAM, GPU/VRAM, Disco, Rede
- **Terminal SSH** - Terminal integrado
- **Chat em Tempo Real** - WebSocket
- **Dashboard** - Dados reais do banco

### 🎯 Orquestração Inteligente

#### Validação Cruzada Obrigatória
1. **IA1 executa** a subtarefa completamente
2. **IA2 (diferente) valida** o resultado
3. **IA3 desempata** se divergência > 20%
4. **NUNCA** a mesma IA valida seu próprio trabalho
5. **ZERO perda** de trabalho anterior

#### Detecção de Alucinação
- Valida respostas com checagem cruzada
- Detecta repetições e loops infinitos
- Identifica informações contraditórias
- Score de confiança 0-100%
- **Recuperação automática** com modelo diferente
- Salva progresso antes de recovery

### 💾 Banco de Dados (23 Tabelas)

1. `users` - Usuários do sistema
2. `aiProviders` - Provedores de IA (LM Studio, OpenAI, etc)
3. `aiModels` - Modelos de IA disponíveis
4. `specializedAIs` - IAs especializadas por categoria
5. `credentials` - Credenciais criptografadas (AES-256-GCM)
6. `externalAPIAccounts` - Contas de APIs externas
7. `tasks` - Tarefas principais
8. `subtasks` - Subtarefas com validação
9. `chatConversations` - Conversas de chat
10. `chatMessages` - Mensagens do chat
11. `aiTemplates` - Templates reutilizáveis
12. `aiWorkflows` - Workflows automatizados
13. `instructions` - Instruções para IAs
14. `knowledgeBase` - Base de conhecimento
15. `knowledgeSources` - Fontes de conhecimento
16. `modelDiscovery` - Descoberta de modelos
17. `modelRatings` - Avaliações de modelos
18. `storage` - Armazenamento de arquivos
19. `taskMonitoring` - Monitoramento de recursos
20. `executionLogs` - Logs de execução
21. `creditUsage` - Uso de créditos APIs
22. `credentialTemplates` - Templates de credenciais
23. `aiQualityMetrics` - Métricas de qualidade das IAs

## 📦 Instalação

### Requisitos

- Ubuntu 22.04 ou superior
- Usuário com privilégios sudo
- LM Studio rodando localmente (opcional)
- Mínimo 4GB RAM
- Mínimo 10GB espaço em disco

### Instalação Automática (Recomendado)

```bash
# 1. Extrair arquivos
tar -xzf orquestrador-v3.tar.gz

# 2. Entrar no diretório
cd orquestrador-v3

# 3. Executar instalador
./instalar.sh
```

O instalador irá:
- ✅ Instalar todas as dependências
- ✅ Configurar MySQL
- ✅ Criar banco de dados (23 tabelas)
- ✅ Instalar Node.js 20.x e pnpm
- ✅ Fazer build do projeto
- ✅ Configurar PM2
- ✅ Iniciar aplicação
- ✅ Validar instalação
- ✅ Criar scripts de manutenção

**Tempo estimado:** 10-15 minutos

## 🎮 Uso

### Acessar Sistema

```
http://192.168.1.247:3000
```

### Comandos Úteis

```bash
# Iniciar
~/orquestrador-start.sh

# Parar
~/orquestrador-stop.sh

# Reiniciar
~/orquestrador-restart.sh

# Ver logs
~/orquestrador-logs.sh

# Status
pm2 status
```

### Criar Nova Tarefa

1. Acesse **Tarefas** no menu
2. Clique em **Adicionar**
3. Preencha título e descrição completa
4. O orquestrador irá:
   - Criar checklist COMPLETO
   - Dividir em subtarefas (TODAS)
   - Executar com validação cruzada
   - Monitorar recursos
   - Detectar alucinações
   - Recuperar automaticamente se necessário

## 🔧 Configuração

### Arquivo .env

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=flavio
DB_PASSWORD=bdflavioia
DB_NAME=orquestraia

# Server
PORT=3001
NODE_ENV=production

# LM Studio
LM_STUDIO_URL=http://localhost:1234/v1

# Encryption
ENCRYPTION_KEY=your-32-character-key
```

### LM Studio

1. Instale LM Studio
2. Carregue um modelo
3. Inicie servidor local (porta 1234)
4. O Orquestrador detectará automaticamente

## 📊 Arquitetura

### Backend (Node.js + TypeScript)

```
server/
├── db/              # Schema Drizzle ORM
├── routers/         # 14 routers tRPC
├── services/        # 7 serviços
├── utils/           # Utilitários
└── index.ts         # Servidor principal
```

### Frontend (React + TypeScript)

```
client/src/
├── pages/           # 18 páginas
├── components/      # Componentes reutilizáveis
├── lib/             # tRPC client
└── App.tsx          # App principal
```

### Serviços

1. **lmstudioService** - Integração LM Studio completa
2. **orchestratorService** - Orquestração inteligente
3. **hallucinationDetectorService** - Detecção de alucinação
4. **puppeteerService** - Automação web
5. **externalServicesService** - Integração serviços externos
6. **systemMonitorService** - Monitoramento de recursos
7. **modelTrainingService** - Treinamento de modelos

## 🔒 Segurança

- **Credenciais criptografadas** - AES-256-GCM
- **OAuth2 automático** - Refresh automático de tokens
- **Single-user** - Usuário fixo ID=1
- **Logs completos** - Auditoria de todas as ações

## 📈 Monitoramento

### Recursos Monitorados

- **CPU** - Uso, temperatura, cores
- **RAM** - Total, usado, livre, %
- **GPU/VRAM** - Compatível com NVIDIA, AMD, Intel, Apple Silicon
- **Disco** - Total, usado, livre, %
- **Rede** - RX/TX em tempo real

### Limites Automáticos

- CPU máximo: 80%
- RAM máximo: 90%
- VRAM máximo: 95%
- Disco máximo: 85%

### Balanceamento Automático

- Se CPU > 80%: pausa novas tarefas
- Se RAM > 90%: descarrega modelos não usados
- Se VRAM > 95%: usa modelo menor ou API externa
- Se Disco > 85%: limpa logs e cache

## 🐛 Troubleshooting

### Erro ao conectar banco

```bash
sudo systemctl restart mysql
mysql -u flavio -p
# Verificar se banco existe
SHOW DATABASES;
USE orquestraia;
SHOW TABLES;
```

### Porta já em uso

```bash
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
pm2 restart orquestrador-v3
```

### LM Studio não detectado

1. Verificar se LM Studio está rodando
2. Verificar porta (padrão: 1234)
3. Testar: `curl http://localhost:1234/v1/models`

### Logs

```bash
# Logs da aplicação
pm2 logs orquestrador-v3

# Logs do instalador
cat /tmp/orquestrador-install.log

# Logs do sistema
cd /home/flavio/orquestrador-v3/logs
tail -f out.log
tail -f error.log
```

## 🔄 Atualização

```bash
# 1. Parar aplicação
pm2 stop orquestrador-v3

# 2. Fazer backup
cp -r /home/flavio/orquestrador-v3 /home/flavio/orquestrador-v3-backup

# 3. Atualizar arquivos
# (copiar novos arquivos)

# 4. Reinstalar dependências
cd /home/flavio/orquestrador-v3
pnpm install

# 5. Rebuild
pnpm build

# 6. Reiniciar
pm2 restart orquestrador-v3
```

## 📝 Desenvolvimento

### Estrutura de Desenvolvimento

```bash
# Modo desenvolvimento
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Testes
pnpm test
```

### Adicionar Nova IA Especializada

1. Acesse **IAs Especializadas**
2. Clique em **Adicionar**
3. Configure:
   - Nome
   - Categoria
   - System Prompt COMPLETO
   - Modelo padrão
   - Modelos fallback
   - Capacidades

### Adicionar Credencial Externa

1. Acesse **Credenciais**
2. Clique em **Adicionar**
3. Selecione serviço
4. Preencha dados (serão criptografados)
5. Vincule em **APIs Externas**

## 📄 Licença

MIT License - Livre para uso comercial e pessoal

## 👥 Suporte

- **Email:** suporte@orquestrador.local
- **Documentação:** http://192.168.1.247:3000/docs
- **Issues:** GitHub Issues

## ✨ Funcionalidades Futuras

- [ ] Suporte multi-usuário
- [ ] Interface de treinamento de modelos
- [ ] Marketplace de templates
- [ ] Integração com mais serviços
- [ ] API pública documentada
- [ ] Sistema de plugins
- [ ] Dashboard analytics avançado

---

**Desenvolvido com ❤️ para orquestração inteligente de IAs**

**Versão:** 3.0.0  
**Data:** $(date +%Y-%m-%d)  
**Status:** ✅ Produção
