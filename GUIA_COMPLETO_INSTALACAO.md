# 📦 GUIA COMPLETO DE INSTALAÇÃO - ORQUESTRADOR V3.0

## 🎯 3 Formas de Instalar

Escolha a forma que preferir:

---

## 🔥 OPÇÃO 1: Instalação Direta do GitHub (RECOMENDADO)

### No seu servidor Ubuntu (192.168.1.247):

```bash
# 1. Conectar ao servidor
ssh flavio@192.168.1.247

# 2. Clonar repositório e instalar (COPIE TUDO DE UMA VEZ)
cd /home/flavio && \
git clone https://github.com/fmunizmcorp/orquestrador-ia.git orquestrador-v3 && \
cd orquestrador-v3 && \
chmod +x instalar.sh && \
./instalar.sh
```

**Pronto!** O instalador fará tudo automaticamente.

---

## 📥 OPÇÃO 2: Download do Arquivo .tar.gz

### Passo 1: Baixar do GitHub

No navegador, acesse:
```
https://github.com/fmunizmcorp/orquestrador-ia/releases
```

Ou baixe diretamente:
```bash
wget https://github.com/fmunizmcorp/orquestrador-ia/archive/refs/heads/main.tar.gz -O orquestrador-v3.tar.gz
```

### Passo 2: Transferir para o Servidor

```bash
# No seu computador local
scp orquestrador-v3.tar.gz flavio@192.168.1.247:/home/flavio/
```

### Passo 3: Instalar no Servidor

```bash
# SSH no servidor
ssh flavio@192.168.1.247

# Extrair e instalar
mkdir -p orquestrador-v3 && \
tar -xzf orquestrador-v3.tar.gz -C orquestrador-v3 --strip-components=1 && \
cd orquestrador-v3 && \
chmod +x instalar.sh && \
./instalar.sh
```

---

## 🖥️ OPÇÃO 3: Do Sandbox Local (Se você está testando localmente)

```bash
# 1. Criar pacote
cd /home/user/webapp
tar --exclude='node_modules' --exclude='.git' -czf orquestrador-v3.tar.gz orquestrador-v3/

# 2. Transferir
scp orquestrador-v3.tar.gz flavio@192.168.1.247:/home/flavio/

# 3. No servidor
ssh flavio@192.168.1.247
mkdir -p orquestrador-v3
tar -xzf orquestrador-v3.tar.gz -C orquestrador-v3 --strip-components=1
cd orquestrador-v3
chmod +x instalar.sh
./instalar.sh
```

---

## ⏱️ O Que Acontece Durante a Instalação

O script `instalar.sh` faz automaticamente:

1. ✅ Verifica privilégios e dependências
2. ✅ Para serviços antigos (se existirem)
3. ✅ Cria backup completo (arquivos + banco)
4. ✅ Instala Node.js 20.x, MySQL, PM2
5. ✅ Configura MySQL e cria banco de dados
6. ✅ Cria 23 tabelas + dados iniciais
7. ✅ Instala dependências NPM (pnpm)
8. ✅ Faz build do projeto (client + server)
9. ✅ Configura PM2 e inicia aplicação
10. ✅ Valida que tudo está funcionando
11. ✅ Cria scripts de manutenção

**Tempo estimado:** 10-15 minutos

---

## ✅ Verificar se Instalou Corretamente

Após a instalação, você deve ver:

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║     ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!        ║
║                                                  ║
╚══════════════════════════════════════════════════╝

🌐 URL de Acesso:      http://192.168.1.247:3000
🔌 API Backend:        http://192.168.1.247:3001
```

### Testar no Navegador

Abra: **http://192.168.1.247:3000**

Você deve ver o dashboard do Orquestrador!

---

## 🛠️ Comandos Úteis Após Instalação

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs orquestrador-v3

# Reiniciar
pm2 restart orquestrador-v3
# OU
~/orquestrador-restart.sh

# Parar
pm2 stop orquestrador-v3
# OU
~/orquestrador-stop.sh

# Iniciar
pm2 start orquestrador-v3
# OU
~/orquestrador-start.sh

# Ver logs salvos
~/orquestrador-logs.sh
```

---

## 🆘 Solução de Problemas

### Problema: "Porta já em uso"

```bash
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
pm2 restart orquestrador-v3
```

### Problema: "Erro ao conectar MySQL"

```bash
sudo systemctl restart mysql
sudo systemctl status mysql
```

### Problema: "Aplicação não inicia"

```bash
# Ver logs de erro
pm2 logs orquestrador-v3 --err

# Reiniciar tudo
cd /home/flavio/orquestrador-v3
pm2 delete orquestrador-v3
pm2 start ecosystem.config.cjs
```

### Problema: "Não abre no navegador"

1. Verificar se está rodando: `pm2 status`
2. Verificar firewall: `sudo ufw status`
3. Liberar porta se necessário: `sudo ufw allow 3000`

---

## 📊 Informações do Sistema

| Item | Valor |
|------|-------|
| **GitHub** | https://github.com/fmunizmcorp/orquestrador-ia |
| **URL Frontend** | http://192.168.1.247:3000 |
| **URL Backend** | http://192.168.1.247:3001 |
| **Diretório** | /home/flavio/orquestrador-v3 |
| **Banco de Dados** | MySQL (orquestraia) |
| **Usuário DB** | flavio |
| **Senha DB** | bdflavioia |
| **Gerenciador** | PM2 |

---

## 🔄 Atualizar o Sistema

```bash
cd /home/flavio/orquestrador-v3

# Parar aplicação
pm2 stop orquestrador-v3

# Atualizar do GitHub
git pull origin main

# Reinstalar dependências
pnpm install

# Rebuild
pnpm build

# Reiniciar
pm2 restart orquestrador-v3
```

---

## 🎓 Documentação Adicional

- **README.md** - Documentação completa do projeto
- **INSTALACAO_SIMPLIFICADA.md** - Guia super simplificado
- **COMANDOS_RAPIDOS.txt** - Comandos para copiar e colar
- **RELATORIO_COMPLETO.md** - Relatório técnico detalhado
- **VERIFICACAO.md** - Checklist de verificação

---

## 📞 Suporte

- **GitHub Issues**: https://github.com/fmunizmcorp/orquestrador-ia/issues
- **Documentação**: No próprio README.md do projeto

---

## 🎉 Pronto!

Agora você tem o **Orquestrador de IAs V3.0** rodando no seu servidor!

Acesse: **http://192.168.1.247:3000**

🚀 Boa orquestração de IAs!
