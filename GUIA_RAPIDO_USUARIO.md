# 🚀 GUIA RÁPIDO DO USUÁRIO
## Orquestrador de IAs V3.4.0

**Sistema Aberto - Sem Necessidade de Login**  
**Acesso Direto**: http://192.168.192.164:3001

---

## 📋 ÍNDICE

1. [Acesso Rápido](#acesso-rápido)
2. [Funcionalidades Principais](#funcionalidades-principais)
3. [Como Usar](#como-usar)
4. [Endpoints da API](#endpoints-da-api)
5. [Solução de Problemas](#solução-de-problemas)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🌐 ACESSO RÁPIDO

### URL Principal
```
http://192.168.192.164:3001
```

### Como Acessar
1. Abra seu navegador (Chrome, Firefox, Safari, Edge)
2. Digite: `http://192.168.192.164:3001`
3. Pressione Enter
4. O sistema carrega automaticamente - **sem login necessário**

### Requisitos
- ✅ Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- ✅ Conexão de rede com o servidor (192.168.192.164)
- ✅ JavaScript habilitado
- ❌ Não precisa de login ou senha
- ❌ Não precisa de instalação

---

## ⚡ FUNCIONALIDADES PRINCIPAIS

### 1. Orquestração de IAs
- **O que faz**: Coordena múltiplos modelos de IA para processar suas solicitações
- **Como usar**: Envie sua pergunta ou tarefa através da interface
- **Resultado**: Resposta inteligente processada por múltiplas IAs

### 2. Gerenciamento de Prompts
- **O que faz**: Armazena e reutiliza prompts otimizados
- **Como usar**: Navegue pela biblioteca de prompts salvos
- **Resultado**: Economia de tempo com prompts pré-configurados

### 3. Histórico de Conversas
- **O que faz**: Mantém registro de todas as suas interações
- **Como usar**: Acesse o histórico para revisar conversas anteriores
- **Resultado**: Continuidade e rastreabilidade completa

### 4. APIs Disponíveis
- **O que faz**: 168+ endpoints para integração programática
- **Como usar**: Use tRPC para chamadas type-safe
- **Resultado**: Integração fácil com outros sistemas

### 5. WebSocket em Tempo Real
- **O que faz**: Comunicação bidirecional instantânea
- **Como usar**: Conexão automática ao acessar o sistema
- **Resultado**: Atualizações em tempo real sem refresh

---

## 📖 COMO USAR

### Primeiro Acesso

**Passo 1**: Abra o navegador
```
Digite: http://192.168.192.164:3001
```

**Passo 2**: Aguarde carregamento (2-3 segundos)
```
Você verá: Interface do Orquestrador de IAs
```

**Passo 3**: Comece a usar imediatamente
```
✅ Sem cadastro
✅ Sem login
✅ Acesso direto a todas as funcionalidades
```

### Uso Diário

**Cenário 1: Fazer uma Pergunta**
1. Acesse a interface principal
2. Digite sua pergunta na caixa de texto
3. Clique em "Enviar" ou pressione Enter
4. Aguarde a resposta processada pelas IAs

**Cenário 2: Consultar Histórico**
1. Clique em "Histórico" no menu
2. Navegue pelas conversas anteriores
3. Clique em qualquer conversa para ver detalhes
4. Use o botão "Continuar" para retomar uma conversa

**Cenário 3: Usar um Prompt Salvo**
1. Clique em "Prompts" no menu
2. Navegue pela biblioteca de prompts
3. Selecione o prompt desejado
4. Clique em "Usar" para aplicar

**Cenário 4: Gerenciar Projetos**
1. Clique em "Projetos" no menu
2. Crie um novo projeto ou selecione existente
3. Organize suas conversas por projeto
4. Visualize métricas e estatísticas

---

## 🔌 ENDPOINTS DA API

### Health Check
```bash
# Verificar se o sistema está online
curl http://192.168.192.164:3001/api/health

# Resposta esperada:
{
  "status": "ok",
  "database": "connected",
  "system": "healthy",
  "timestamp": "2025-11-01T21:30:00.000Z"
}
```

### API tRPC Base
```
Base URL: http://192.168.192.164:3001/api/trpc
Endpoints: 168+ disponíveis
Tipo: Type-safe com TypeScript
```

### WebSocket
```
WebSocket URL: ws://192.168.192.164:3001/ws
Protocolo: Socket.IO
Uso: Conexão automática via frontend
```

### Exemplos de Uso da API

**Exemplo 1: Listar Modelos de IA**
```bash
curl -X GET http://192.168.192.164:3001/api/trpc/aiModel.list
```

**Exemplo 2: Criar uma Conversa**
```bash
curl -X POST http://192.168.192.164:3001/api/trpc/conversation.create \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha Conversa", "modelId": 1}'
```

**Exemplo 3: Buscar Prompts**
```bash
curl -X GET http://192.168.192.164:3001/api/trpc/prompt.search?q=exemplo
```

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### Problema: "Não consigo acessar o site"

**Solução 1**: Verificar conectividade
```bash
# No terminal, teste a conexão:
ping 192.168.192.164

# Deve retornar:
# 64 bytes from 192.168.192.164: icmp_seq=1 ttl=64 time=1.23 ms
```

**Solução 2**: Verificar se o serviço está rodando
```bash
# Teste o endpoint de health:
curl http://192.168.192.164:3001/api/health

# Deve retornar JSON com "status": "ok"
```

**Solução 3**: Verificar firewall/rede
- Confirme que está na mesma rede que o servidor
- Verifique se não há firewall bloqueando a porta 3001
- Tente acessar de outro dispositivo na mesma rede

### Problema: "Página carrega mas não funciona"

**Solução 1**: Limpar cache do navegador
```
Chrome: Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
Firefox: Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
```

**Solução 2**: Verificar console do navegador
```
1. Pressione F12 para abrir Developer Tools
2. Vá na aba "Console"
3. Procure por erros em vermelho
4. Compartilhe os erros com a equipe de suporte
```

**Solução 3**: Tentar outro navegador
- Chrome (recomendado)
- Firefox
- Edge
- Safari

### Problema: "API retorna erro 500"

**Solução 1**: Verificar status do servidor
```bash
# Verifique se o health check responde:
curl http://192.168.192.164:3001/api/health
```

**Solução 2**: Aguardar alguns segundos e tentar novamente
- O servidor pode estar reiniciando
- O banco de dados pode estar processando

**Solução 3**: Contatar administrador
- Se o erro persistir por mais de 5 minutos
- Informe a operação que estava tentando realizar
- Compartilhe mensagens de erro específicas

### Problema: "WebSocket desconectado"

**Solução 1**: Atualizar página
```
Pressione F5 ou Ctrl+R (Windows) ou Cmd+R (Mac)
```

**Solução 2**: Verificar conexão de rede
```
Teste sua internet: ping google.com
Teste o servidor: ping 192.168.192.164
```

**Solução 3**: Aguardar reconexão automática
- O sistema tenta reconectar automaticamente
- Aguarde 10-30 segundos
- Se não reconectar, atualize a página

---

## ❓ PERGUNTAS FREQUENTES

### Geral

**Q: Preciso criar uma conta?**  
A: Não. O sistema é aberto e não requer login.

**Q: Posso usar de qualquer dispositivo?**  
A: Sim, desde que esteja na mesma rede que o servidor.

**Q: Há limite de uso?**  
A: Não há limite de requisições ou tempo de uso.

**Q: Meus dados são salvos?**  
A: Sim, todo o histórico é armazenado no banco de dados.

**Q: Posso acessar de fora da rede local?**  
A: Atualmente não, o sistema está configurado apenas para acesso local.

### Técnicas

**Q: Qual tecnologia é usada?**  
A: React 18.2 + TypeScript no frontend, Node.js + Express no backend, MySQL para dados.

**Q: Quantos modelos de IA são suportados?**  
A: O sistema é extensível e suporta múltiplos modelos configuráveis.

**Q: Como integro com minha aplicação?**  
A: Use a API tRPC em http://192.168.192.164:3001/api/trpc

**Q: Há documentação da API?**  
A: Sim, veja a seção "Endpoints da API" neste guia e explore /api/trpc.

**Q: O sistema funciona offline?**  
A: Não, requer conexão com o servidor.

### Operacionais

**Q: Como reporto um problema?**  
A: Documente o erro, tire screenshot se possível, e contate o administrador.

**Q: Há manutenção programada?**  
A: Manutenções serão comunicadas com antecedência quando necessárias.

**Q: O que fazer se o sistema estiver lento?**  
A: Limpe cache do navegador, feche abas desnecessárias, teste em outro navegador.

**Q: Posso sugerir melhorias?**  
A: Sim! Feedback é bem-vindo. Contate o administrador do sistema.

**Q: Como posso ver o status do sistema?**  
A: Acesse http://192.168.192.164:3001/api/health para status em tempo real.

---

## 📊 RECURSOS AVANÇADOS

### Para Desenvolvedores

**TypeScript SDK**
```typescript
// Importe o cliente tRPC
import { trpc } from './trpc';

// Use type-safe calls
const models = await trpc.aiModel.list.query();
const conversation = await trpc.conversation.create.mutate({
  title: "Nova Conversa",
  modelId: 1
});
```

**API REST Alternativa**
```javascript
// Fetch API padrão
const response = await fetch('http://192.168.192.164:3001/api/health');
const data = await response.json();
console.log(data.status); // "ok"
```

**WebSocket Client**
```javascript
// Socket.IO client
import io from 'socket.io-client';

const socket = io('http://192.168.192.164:3001');
socket.on('connect', () => {
  console.log('Conectado ao servidor');
});

socket.on('message', (data) => {
  console.log('Mensagem recebida:', data);
});
```

### Integrações

**cURL (Command Line)**
```bash
# Listar modelos
curl -X GET http://192.168.192.164:3001/api/trpc/aiModel.list

# Criar prompt
curl -X POST http://192.168.192.164:3001/api/trpc/prompt.create \
  -H "Content-Type: application/json" \
  -d '{"name": "Meu Prompt", "content": "Você é um assistente..."}'
```

**Python**
```python
import requests

# Health check
response = requests.get('http://192.168.192.164:3001/api/health')
print(response.json())

# Criar conversa
payload = {"title": "Python Conversation", "modelId": 1}
response = requests.post(
    'http://192.168.192.164:3001/api/trpc/conversation.create',
    json=payload
)
print(response.json())
```

**JavaScript/Node.js**
```javascript
// Usando axios
const axios = require('axios');

async function checkHealth() {
  const response = await axios.get('http://192.168.192.164:3001/api/health');
  console.log(response.data);
}

async function createConversation() {
  const response = await axios.post(
    'http://192.168.192.164:3001/api/trpc/conversation.create',
    { title: "Node.js Conversation", modelId: 1 }
  );
  console.log(response.data);
}
```

---

## 📞 SUPORTE E CONTATO

### Status do Sistema
- **Health Check**: http://192.168.192.164:3001/api/health
- **Uptime**: Monitore via PM2 no servidor

### Documentação Adicional
- **Guia Completo de Uso**: GUIA-USO-SISTEMA.md
- **Documentação Técnica**: MISSION_COMPLETE_FINAL_REPORT.md
- **Checklist de Deploy**: DEPLOYMENT_EXCELLENCE_CHECKLIST.md
- **Validação de Sistema**: SISTEMA_ACESSIVEL_CONFIRMADO.md

### Recursos Online
- **Repositório GitHub**: https://github.com/fmunizmcorp/orquestrador-ia
- **Issues**: Reporte bugs no GitHub Issues
- **Documentação da API**: Disponível no código-fonte

---

## 🎯 PRÓXIMOS PASSOS

### Para Usuários Iniciantes
1. ✅ Acesse http://192.168.192.164:3001
2. ✅ Explore a interface principal
3. ✅ Faça sua primeira pergunta
4. ✅ Navegue pelo histórico
5. ✅ Experimente diferentes prompts

### Para Usuários Avançados
1. ✅ Explore a API tRPC
2. ✅ Crie integrações customizadas
3. ✅ Use o WebSocket para tempo real
4. ✅ Organize seus projetos
5. ✅ Otimize seus prompts

### Para Desenvolvedores
1. ✅ Clone o repositório do GitHub
2. ✅ Estude a arquitetura (React + Node.js + MySQL)
3. ✅ Explore os 168+ endpoints tRPC
4. ✅ Contribua com melhorias
5. ✅ Crie extensões e plugins

---

## ✅ CHECKLIST DE PRIMEIRO USO

- [ ] Acessei http://192.168.192.164:3001 com sucesso
- [ ] Interface carregou corretamente
- [ ] Fiz minha primeira pergunta/interação
- [ ] Explorei o menu de navegação
- [ ] Vi meu histórico de conversas
- [ ] Entendi como usar prompts salvos
- [ ] Testei o health check da API
- [ ] Li este guia completo
- [ ] Marquei este guia nos favoritos para referência futura

---

**Versão**: 3.4.0  
**Última Atualização**: 2025-11-01  
**Criado por**: GenSpark AI Developer Team  
**Licença**: Sistema Aberto para Uso Interno

---

## 💡 DICA FINAL

> **O sistema foi projetado para ser intuitivo e auto-explicativo.**  
> **Não tenha medo de explorar - você não vai quebrar nada!**  
> **Todas as suas ações são registradas e podem ser recuperadas.**

**Aproveite o Orquestrador de IAs! 🚀**
