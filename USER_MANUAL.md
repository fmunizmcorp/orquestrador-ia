# Orquestrador de IAs V3.0 - Manual do Usuário

## 📚 Índice

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Configuração Inicial](#configuração-inicial)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Guia de Uso](#guia-de-uso)
6. [Solução de Problemas](#solução-de-problemas)
7. [FAQ](#faq)

---

## 🌟 Introdução

O **Orquestrador de IAs V3.0** é um sistema completo de orquestração de inteligências artificiais que permite:

- ✅ Execução paralela de múltiplas IAs
- 🔍 Validação cruzada automática (3 IAs)
- 🛡️ Detecção de alucinações
- 🔄 Recuperação automática de erros
- 📊 Treinamento de modelos personalizados
- 🌐 Integração com serviços externos
- 💬 Chat em tempo real
- 📈 Analytics avançado

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **MySQL/MariaDB** 10.5+
- **LM Studio** (ou servidor de AI compatível)
- **Git**

### Instalação Automática

```bash
# Clone o repositório
git clone https://github.com/fmunizmcorp/orquestrador-ia.git
cd orquestrador-ia

# Execute o instalador
sudo ./installer.sh
```

O instalador irá:
1. Verificar dependências
2. Instalar pacotes necessários
3. Configurar banco de dados
4. Criar arquivo .env
5. Executar migrações
6. Construir aplicação
7. Configurar serviço systemd

### Instalação Manual

```bash
# 1. Instalar dependências
npm install
cd client && npm install && cd ..

# 2. Configurar ambiente
./config-wizard.sh

# 3. Criar banco de dados
mysql -u root -p
CREATE DATABASE orquestraia;
CREATE USER 'orquestrador'@'localhost' IDENTIFIED BY 'orquestrador123';
GRANT ALL PRIVILEGES ON orquestraia.* TO 'orquestrador'@'localhost';
FLUSH PRIVILEGES;

# 4. Executar migrações
npm run db:push

# 5. Construir aplicação
cd client && npm run build && cd ..

# 6. Iniciar
npm start
```

---

## ⚙️ Configuração Inicial

### 1. Acessar o Sistema

Abra o navegador em: `http://localhost:3001`

### 2. Configurar LM Studio

1. Instale o LM Studio
2. Baixe um modelo (ex: Llama-2-7B)
3. Inicie o servidor local na porta 1234
4. No Orquestrador, vá em **Provedores** → **Novo Provedor**
5. Configure:
   - Nome: "LM Studio Local"
   - URL: `http://localhost:1234/v1`
   - Tipo: "lmstudio"

### 3. Adicionar Modelos

1. Acesse **Modelos** → **Novo Modelo**
2. Selecione o provedor criado
3. Configure:
   - Nome do Modelo: "llama-2-7b"
   - Context Window: 4096
   - Max Tokens: 2048
   - Temperature: 0.7

### 4. Criar IAs Especializadas

1. Acesse **IAs Especializadas** → **Nova IA**
2. Configure especialidades:
   - **Análise de Código**: Para revisar código
   - **Escrita Criativa**: Para conteúdo
   - **Validação**: Para validação cruzada
   - **Detecção de Erros**: Para identificar problemas

---

## 🎯 Funcionalidades Principais

### 1. Tarefas e Orquestração

#### Criar Tarefa

```
1. Dashboard → Tarefas → Nova Tarefa
2. Preencha:
   - Título: "Analisar código Python"
   - Descrição: "Revisar código e sugerir melhorias"
   - Prioridade: Alta
3. Salvar
4. Executar
```

O sistema irá:
- ✅ Dividir em subtarefas
- ✅ Atribuir IAs especializadas
- ✅ Executar com 3 IAs (executor + 2 validadores)
- ✅ Validar respostas (divergência < 20%)
- ✅ Decidir com 3ª IA se necessário

#### Status de Tarefas

- **Pending**: Aguardando execução
- **Running**: Em execução
- **Completed**: Concluída com sucesso
- **Failed**: Falhou (com opção de recuperação)

### 2. Chat Inteligente

1. Acesse **Chat**
2. Digite sua mensagem
3. O sistema:
   - Mantém contexto de 10 mensagens
   - Streaming em tempo real
   - Salva histórico

### 3. Workflows

#### Criar Workflow Visual

1. **Workflows** → **Novo Workflow**
2. Arraste componentes:
   - 🤖 **AI Task**: Execução com IA
   - ❓ **Condition**: Decisão condicional
   - ⚡ **Parallel**: Execução paralela
   - 🔄 **Loop**: Repetição
   - 🌐 **Webhook**: Chamada HTTP
   - 🔗 **Integration**: Integração externa

3. Conecte os componentes
4. Configure cada nó
5. Salve e execute

### 4. Treinamento de Modelos

#### Criar Dataset

```typescript
// 1. Preparar dados
const dataset = [
  { instruction: "Some instrução", response: "Resposta esperada" },
  { instruction: "Outra instrução", response: "Outra resposta" },
  // ... mais exemplos
];

// 2. Upload via interface
Model Training → Datasets → Novo Dataset
- Nome: "Meu Dataset"
- Tipo: "instruction"
- Upload: arquivo JSON
```

#### Iniciar Treinamento

```
1. Model Training → Novo Treinamento
2. Configure:
   - Modelo Base: llama-2-7b
   - Dataset: Meu Dataset
   - Hyperparâmetros:
     - Learning Rate: 0.0001
     - Batch Size: 8
     - Epochs: 3
     - LoRA Rank: 16
3. Iniciar
4. Acompanhar progresso em tempo real
```

### 5. Integrações

#### GitHub

```
1. Credentials → Nova Credencial
2. Serviço: GitHub
3. Token: seu_token_aqui
4. Salvar

// Uso
- Criar issues
- Fazer commits
- Criar PRs
- Review código
```

#### Slack

```
1. Credentials → Nova Credencial
2. Serviço: Slack
3. Token: xoxb-your-token
4. Salvar

// Uso
- Enviar mensagens
- Upload de arquivos
- Reações
```

#### Notion

```
1. Credentials → Nova Credencial
2. Serviço: Notion
3. Token: secret_token
4. Salvar

// Uso
- Criar páginas
- Atualizar databases
- Buscar conteúdo
```

#### Google Sheets

```
1. Credentials → Nova Credencial
2. Serviço: Google Sheets
3. Access Token: seu_token
4. Salvar

// Uso
- Ler/escrever células
- Criar planilhas
- Formatar dados
```

#### Discord

```
1. Credentials → Nova Credencial
2. Serviço: Discord
3. Bot Token: seu_bot_token
4. Salvar

// Uso
- Enviar mensagens
- Gerenciar canais
- Moderar servidor
```

### 6. Analytics

Acesse **Analytics** para visualizar:

- 📊 **Métricas de Sistema**:
  - CPU, Memória, Disco
  - Taxa de sucesso
  - Tempo médio de execução
  
- 📈 **Distribuições**:
  - Status de tarefas
  - Prioridades
  - Uso de modelos
  
- 📝 **Logs Recentes**:
  - Execuções
  - Erros
  - Performance

---

## 🔧 Guia de Uso

### Caso de Uso 1: Análise de Código

```
1. Criar Tarefa:
   Título: "Revisar código"
   Descrição: "Analisar arquivo main.py e sugerir melhorias"

2. O sistema irá:
   - Subtarefa 1: Análise de sintaxe (IA de Código)
   - Subtarefa 2: Análise de performance (IA de Otimização)
   - Subtarefa 3: Análise de segurança (IA de Segurança)
   
3. Validação Cruzada:
   - Cada resultado validado por 2 outras IAs
   - Desempate automático se divergência > 20%
   
4. Resultado Final:
   - Relatório consolidado
   - Sugestões priorizadas
   - Código otimizado
```

### Caso de Uso 2: Automação com Integrações

```
1. Criar Workflow:
   [GitHub] → [Análise IA] → [Slack Notificação] → [Notion Doc]
   
2. Fluxo:
   - Detecta novo commit no GitHub
   - IA analisa mudanças
   - Envia resumo no Slack
   - Cria documento no Notion
   
3. Configurar Triggers:
   - Webhook do GitHub
   - Executar a cada push
```

### Caso de Uso 3: Treinamento Personalizado

```
1. Coletar Dados:
   - 100+ exemplos de interações
   - Formato: pergunta-resposta
   
2. Criar Dataset:
   - Upload via interface
   - Validação automática
   
3. Treinar Modelo:
   - Base: Llama-2-7B
   - LoRA fine-tuning
   - 3 epochs
   
4. Avaliar:
   - Teste em dataset separado
   - Métricas: accuracy, perplexity
   
5. Usar:
   - Deploy automático
   - Integração com tarefas
```

---

## 🐛 Solução de Problemas

### Problema: "Database connection failed"

**Solução**:
```bash
# Verificar se MySQL está rodando
sudo systemctl status mariadb

# Reiniciar se necessário
sudo systemctl restart mariadb

# Testar conexão
mysql -u orquestrador -p orquestraia
```

### Problema: "LM Studio not responding"

**Solução**:
1. Abrir LM Studio
2. Verificar se modelo está carregado
3. Verificar porta 1234
4. Testar: `curl http://localhost:1234/v1/models`

### Problema: "WebSocket disconnected"

**Solução**:
```bash
# Reiniciar servidor
sudo systemctl restart orquestrador

# Verificar logs
sudo journalctl -u orquestrador -f
```

### Problema: "Task execution timeout"

**Solução**:
1. Aumentar timeout no modelo:
   - Modelos → Selecionar → Timeout: 600s
2. Verificar recursos do sistema:
   - CPU/Memory suficientes
3. Otimizar prompt:
   - Ser mais específico
   - Dividir em subtarefas menores

### Problema: "High CPU usage"

**Solução**:
```bash
# Executar otimizações
sudo ./optimize-performance.sh

# Limitar tarefas simultâneas
# No dashboard: Settings → Max Concurrent Tasks: 5
```

---

## ❓ FAQ

### Como funciona a validação cruzada?

1. **Execução**: IA1 processa a tarefa
2. **Validação**: IA2 valida o resultado de IA1
3. **Comparação**: Sistema calcula divergência
4. **Desempate**: Se > 20%, IA3 decide

### Posso usar múltiplos provedores?

Sim! Configure:
- LM Studio (local)
- OpenAI (cloud)
- Anthropic (cloud)
- Custom (seu servidor)

### Como proteger credenciais?

Todas as credenciais são:
- ✅ Criptografadas com AES-256
- ✅ Armazenadas em banco seguro
- ✅ Não expostas em logs
- ✅ Rotação automática opcional

### Quanto custa usar o sistema?

- **Software**: Gratuito e open-source
- **LM Studio**: Gratuito (modelos locais)
- **APIs externas**: Conforme uso
  - OpenAI: ~$0.002/1K tokens
  - Anthropic: ~$0.008/1K tokens

### Como fazer backup?

```bash
# Backup automático
./installer.sh --backup

# Backup manual
mysqldump -u orquestrador -p orquestraia > backup.sql
tar -czf backup.tar.gz /home/user/webapp

# Restaurar
mysql -u orquestrador -p orquestraia < backup.sql
```

### Suporte a Docker?

Em desenvolvimento. Por enquanto:
```bash
# Instalar em máquina virtual
# ou
# Usar installer.sh em servidor dedicado
```

---

## 📞 Suporte

- 📧 **Email**: suporte@orquestrador-ia.com
- 💬 **Discord**: discord.gg/orquestrador-ia
- 📖 **Docs**: https://docs.orquestrador-ia.com
- 🐛 **Issues**: https://github.com/fmunizmcorp/orquestrador-ia/issues

---

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

---

**Versão**: 3.0.0  
**Última Atualização**: 2025-01-30
