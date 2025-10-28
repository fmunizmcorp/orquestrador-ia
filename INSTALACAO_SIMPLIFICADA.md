# 🚀 GUIA DE INSTALAÇÃO SUPER SIMPLIFICADO

## Instalação em 3 Passos Simples

### 📋 Pré-requisitos no Servidor

- Ubuntu 22.04 ou superior
- Usuário com privilégios sudo
- Acesso SSH

---

## PASSO 1: Transferir Arquivo para o Servidor

No seu computador local (onde está o arquivo):

```bash
scp orquestrador-v3.tar.gz flavio@192.168.1.247:/home/flavio/
```

**Senha:** Digite a senha do usuário `flavio` quando solicitado.

---

## PASSO 2: Conectar ao Servidor via SSH

```bash
ssh flavio@192.168.1.247
```

**Senha:** Digite a senha do usuário `flavio` quando solicitado.

---

## PASSO 3: Executar Instalação Automática

No servidor, execute:

```bash
# 1. Extrair arquivos
mkdir -p orquestrador-v3
tar -xzf orquestrador-v3.tar.gz -C orquestrador-v3

# 2. Entrar no diretório
cd orquestrador-v3

# 3. Executar instalador (100% AUTOMÁTICO)
chmod +x instalar.sh
./instalar.sh
```

**⏱️ Tempo estimado:** 10-15 minutos

**O instalador vai:**
- ✅ Instalar Node.js, MySQL, PM2
- ✅ Criar banco de dados (23 tabelas)
- ✅ Instalar dependências
- ✅ Fazer build do projeto
- ✅ Iniciar aplicação automaticamente
- ✅ Validar que tudo está funcionando

---

## ✅ PRONTO! Acessar o Sistema

Abra no navegador:

```
http://192.168.1.247:3000
```

---

## 🛠️ Comandos Úteis (Após Instalação)

```bash
# Ver status
pm2 status

# Ver logs
~/orquestrador-logs.sh

# Reiniciar
~/orquestrador-restart.sh

# Parar
~/orquestrador-stop.sh

# Iniciar
~/orquestrador-start.sh
```

---

## 🆘 Solução de Problemas

### Se não abrir no navegador:

```bash
# Verificar se está rodando
pm2 status

# Ver logs de erro
pm2 logs orquestrador-v3

# Reiniciar
pm2 restart orquestrador-v3
```

### Se der erro no MySQL:

```bash
# Verificar status do MySQL
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql
```

### Se der erro de porta em uso:

```bash
# Liberar portas
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp

# Reiniciar aplicação
pm2 restart orquestrador-v3
```

---

## 📞 Informações Importantes

| Item | Valor |
|------|-------|
| **URL de Acesso** | http://192.168.1.247:3000 |
| **API Backend** | http://192.168.1.247:3001 |
| **Diretório** | /home/flavio/orquestrador-v3 |
| **Banco de Dados** | MySQL (orquestraia) |
| **Usuário DB** | flavio |
| **Porta Frontend** | 3000 |
| **Porta Backend** | 3001 |

---

## 🎉 Isso é Tudo!

Se tudo correu bem, você verá:

```
✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!

🌐 URL de Acesso: http://192.168.1.247:3000
```

Agora é só usar o sistema! 🚀
