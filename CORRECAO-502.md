# 🔧 Correção do Erro 502 Bad Gateway

## 📋 Diagnóstico do Problema

O erro **502 Bad Gateway** ocorre porque:

1. ✅ **Backend (porta 3001)**: Funcionando corretamente
2. ❌ **Frontend (porta 3000)**: Não está rodando separadamente
3. ⚠️ **Nginx**: Configurado para fazer proxy para porta 3000 (que não existe)

## 🎯 Solução

O sistema está **configurado corretamente** para servir o frontend através do **mesmo servidor backend (porta 3001)** quando `NODE_ENV=production`. Basta reiniciar o PM2 com a configuração correta.

---

## 🚀 Passo a Passo Rápido

### **Opção 1: Script Automático** (RECOMENDADO)

```bash
# No servidor (192.168.1.247):
cd ~/orquestrador-v3

# Baixar última versão
git pull origin main

# Dar permissão e executar script de correção
chmod +x corrigir-frontend.sh
./corrigir-frontend.sh
```

O script irá:
- ✅ Verificar se tudo está compilado
- ✅ Garantir que NODE_ENV=production está no .env
- ✅ Criar configuração PM2 (ecosystem.config.cjs)
- ✅ Reiniciar aplicação com variáveis corretas
- ✅ Testar se frontend está sendo servido
- ✅ Mostrar status final

---

### **Opção 2: Comandos Manuais**

Se preferir fazer manualmente:

```bash
cd ~/orquestrador-v3

# 1. Verificar .env
cat .env | grep NODE_ENV
# Deve mostrar: NODE_ENV=production

# 2. Se não tiver, adicionar:
echo "NODE_ENV=production" >> .env

# 3. Parar PM2
pm2 stop orquestrador-v3
pm2 delete orquestrador-v3

# 4. Criar ecosystem.config.cjs
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'orquestrador-v3',
    script: './dist/index.js',
    cwd: process.cwd(),
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    autorestart: true
  }]
};
EOF

# 5. Criar diretório de logs
mkdir -p logs

# 6. Iniciar com PM2
pm2 start ecosystem.config.cjs
pm2 save

# 7. Verificar status
pm2 status

# 8. Testar endpoints
curl -I http://localhost:3001/api/health  # Backend
curl -I http://localhost:3001/            # Frontend
```

---

## 🔍 Diagnóstico Completo

Para verificar todos os componentes do sistema:

```bash
cd ~/orquestrador-v3
chmod +x diagnosticar.sh
./diagnosticar.sh
```

O script de diagnóstico verifica:
- ✅ Diretório da aplicação
- ✅ Arquivos compilados (backend e frontend)
- ✅ Configuração (.env)
- ✅ Processos PM2
- ✅ Portas em uso
- ✅ Endpoints (health e frontend)
- ✅ Banco de dados
- ✅ Nginx
- ✅ Logs recentes
- ✅ Resumo com recomendações

---

## 🌐 Configuração do Nginx

Após corrigir, o sistema estará rodando **APENAS na porta 3001** (frontend + backend juntos).

### Opção 1: Redirecionar porta 80 para 3001

Edite `/etc/nginx/sites-enabled/default`:

```nginx
server {
    listen 80;
    server_name 192.168.1.247;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket para monitoramento
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # API tRPC
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Depois:

```bash
sudo nginx -t                    # Testar configuração
sudo systemctl reload nginx      # Recarregar nginx
```

### Opção 2: Acessar diretamente pela porta 3001

Não precisa do Nginx, acesse diretamente:

```
http://192.168.1.247:3001
```

---

## ✅ Verificação Final

Após executar a correção:

### 1. Verificar PM2
```bash
pm2 status
```
Deve mostrar `orquestrador-v3` com status **online**.

### 2. Testar Backend
```bash
curl http://localhost:3001/api/health
```
Deve retornar JSON com `"status": "ok"`.

### 3. Testar Frontend
```bash
curl -I http://localhost:3001/
```
Deve retornar `HTTP/1.1 200 OK`.

### 4. Acessar no Navegador
```
http://192.168.1.247:3001
```
Deve abrir a interface do Orquestrador.

---

## 📊 Estrutura do Sistema Corrigido

```
┌─────────────────────────────────────────┐
│         Nginx (porta 80)                │
│     [Opcional - Proxy Reverso]          │
└──────────────┬──────────────────────────┘
               │
               │ proxy_pass
               ▼
┌─────────────────────────────────────────┐
│    Express Server (porta 3001)          │
│  ┌─────────────────────────────────┐   │
│  │  Backend (API tRPC)             │   │
│  │  /api/trpc/*                    │   │
│  │  /api/health                    │   │
│  │  /ws (WebSocket)                │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Frontend (Arquivos Estáticos)  │   │
│  │  /* (serve dist/client/*)       │   │
│  │  NODE_ENV=production            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
               │
               ▼
       ┌─────────────┐
       │ MySQL       │
       └─────────────┘
```

---

## 🐛 Solução de Problemas

### Problema: Frontend retorna 404

**Causa**: NODE_ENV não está como "production"

**Solução**:
```bash
cd ~/orquestrador-v3
grep NODE_ENV .env
# Se não aparecer "production":
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
pm2 restart orquestrador-v3
```

### Problema: Backend não inicia

**Causa**: Erro de compilação ou dependências

**Solução**:
```bash
cd ~/orquestrador-v3
pnpm install
pnpm build:server
pm2 restart orquestrador-v3
pm2 logs orquestrador-v3
```

### Problema: Erro de conexão com MySQL

**Causa**: Credenciais incorretas no .env

**Solução**:
```bash
cd ~/orquestrador-v3
nano .env
# Verificar: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
pm2 restart orquestrador-v3
```

### Problema: PM2 não inicia

**Causa**: Arquivo dist/index.js não existe

**Solução**:
```bash
cd ~/orquestrador-v3
pnpm build:server
ls -lh dist/index.js  # Verificar se existe
pm2 start ecosystem.config.cjs
```

---

## 📞 Comandos Úteis

```bash
# Ver status
pm2 status

# Ver logs ao vivo
pm2 logs orquestrador-v3

# Ver logs das últimas 100 linhas
pm2 logs orquestrador-v3 --lines 100 --nostream

# Reiniciar aplicação
pm2 restart orquestrador-v3

# Parar aplicação
pm2 stop orquestrador-v3

# Iniciar aplicação
pm2 start ecosystem.config.cjs

# Ver informações detalhadas
pm2 show orquestrador-v3

# Monitorar recursos
pm2 monit

# Limpar logs
pm2 flush
```

---

## 🎉 Resultado Final

Após a correção:

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║     ✅ SISTEMA 100% OPERACIONAL                 ║
║                                                  ║
╚══════════════════════════════════════════════════╝

🌐 ACESSO:
   Frontend + Backend: http://192.168.1.247:3001

📊 COMPONENTES:
   ✅ Backend API (tRPC)
   ✅ Frontend (React)
   ✅ WebSocket (Monitoramento)
   ✅ MySQL (Banco de Dados)
   ✅ PM2 (Process Manager)

🛠️ SERVIÇOS:
   ✅ Orquestração de IAs
   ✅ Cross-Validation
   ✅ Detecção de Alucinações
   ✅ Monitoramento de Sistema
   ✅ Terminal SSH
   ✅ Base de Conhecimento
   ✅ Gerenciamento de Credenciais
```

---

## 📚 Documentação Adicional

- **README.md**: Documentação completa do projeto
- **instalar.sh**: Script de instalação automática
- **corrigir-frontend.sh**: Script de correção do erro 502
- **diagnosticar.sh**: Script de diagnóstico completo

---

**Última atualização**: 2025-10-28  
**Versão**: 3.0  
**Autor**: GenSpark AI
