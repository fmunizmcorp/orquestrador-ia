# 🔧 Troubleshooting MySQL - Ubuntu 24.04

## ❌ Erro: ER_ACCESS_DENIED_NO_PASSWORD_ERROR

### 🔍 Problema

```
Error: Access denied for user 'root'@'localhost'
code: 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR'
errno: 1698
sqlState: '28000'
```

### 📋 Causa

No Ubuntu 24.04, o MySQL usa **auth_socket plugin** por padrão para o usuário `root`, em vez de autenticação por senha. Isso significa que:

- ✅ `sudo mysql` funciona (autenticação via socket Unix)
- ❌ `mysql -u root -p` com senha vazia NÃO funciona
- ❌ Aplicações Node.js não conseguem conectar sem senha

### ✅ Solução Automática (Recomendada)

**O script `install.sh` JÁ FOI CORRIGIDO** para lidar com isso automaticamente!

Quando você deixar a senha vazia durante a instalação, o script irá:

1. Detectar que a senha está vazia
2. Gerar uma senha aleatória segura
3. Criar o usuário com a nova senha usando `sudo mysql`
4. Salvar a senha no arquivo `.env`
5. Usar a senha para todas as conexões subsequentes

**Você não precisa fazer nada!** Apenas execute:

```bash
cd ~ && rm -rf orquestrador-ia 2>/dev/null; git clone https://github.com/fmunizmcorp/orquestrador-ia.git && cd orquestrador-ia && chmod +x install.sh && ./install.sh
```

Quando solicitar a senha do MySQL, apenas pressione `ENTER` (deixe vazio).

---

## 🛠️ Solução Manual (Se Necessário)

Se você já executou o instalador e teve erro, siga estes passos:

### Opção 1: Criar Usuário com Senha

```bash
# 1. Conectar ao MySQL como root (via sudo)
sudo mysql

# 2. Criar novo usuário com senha
CREATE USER 'root'@'localhost' IDENTIFIED BY 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

# 3. Criar banco de dados
CREATE DATABASE IF NOT EXISTS orquestraia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Sair
EXIT;
```

### Opção 2: Alterar Senha do Root Existente

```bash
# 1. Conectar ao MySQL
sudo mysql

# 2. Alterar método de autenticação
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha_aqui';
FLUSH PRIVILEGES;

# 3. Criar banco de dados
CREATE DATABASE IF NOT EXISTS orquestraia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Sair
EXIT;
```

### Opção 3: Usar Outro Usuário

```bash
# 1. Conectar ao MySQL
sudo mysql

# 2. Criar novo usuário dedicado
CREATE USER 'orquestrador'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON orquestraia.* TO 'orquestrador'@'localhost';
FLUSH PRIVILEGES;

# 3. Criar banco de dados
CREATE DATABASE IF NOT EXISTS orquestraia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Sair
EXIT;
```

### Atualizar .env

Após qualquer opção acima, edite o arquivo `.env`:

```bash
nano .env
```

Atualize as credenciais:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root              # ou 'orquestrador' se usou Opção 3
DB_PASSWORD=sua_senha_aqui
DB_NAME=orquestraia
```

### Executar Migrations Novamente

```bash
npm run db:migrate
```

---

## 🔍 Verificar Autenticação do MySQL

Para ver qual método de autenticação está sendo usado:

```bash
sudo mysql -e "SELECT user, host, plugin FROM mysql.user WHERE user='root';"
```

### Resultados Possíveis:

1. **auth_socket** - Requer sudo, não aceita senha
   ```
   +------+-----------+-------------+
   | user | host      | plugin      |
   +------+-----------+-------------+
   | root | localhost | auth_socket |
   +------+-----------+-------------+
   ```

2. **mysql_native_password** - Aceita senha tradicional
   ```
   +------+-----------+-----------------------+
   | user | host      | plugin                |
   +------+-----------+-----------------------+
   | root | localhost | mysql_native_password |
   +------+-----------+-----------------------+
   ```

---

## ✅ Testar Conexão

Após configurar a senha, teste a conexão:

```bash
# Testar via linha de comando
mysql -u root -p

# Digite a senha quando solicitado
```

Se conectar com sucesso, a configuração está correta!

---

## 🚀 Reinstalar do Zero (Se Tudo Mais Falhar)

```bash
# 1. Remover instalação anterior
cd ~
rm -rf orquestrador-ia

# 2. Remover banco de dados (CUIDADO: Isso apaga todos os dados!)
sudo mysql -e "DROP DATABASE IF EXISTS orquestraia;"

# 3. Clonar repositório atualizado
git clone https://github.com/fmunizmcorp/orquestrador-ia.git
cd orquestrador-ia

# 4. Executar instalador atualizado
chmod +x install.sh
./install.sh

# 5. Quando solicitar senha MySQL, pressione ENTER (deixe vazio)
#    O script criará automaticamente uma senha e salvará no .env
```

---

## 📚 Referências

- **MySQL 8.0 Documentation**: [Authentication Plugins](https://dev.mysql.com/doc/refman/8.0/en/authentication-plugins.html)
- **Ubuntu 24.04**: [MySQL Server Guide](https://ubuntu.com/server/docs/databases-mysql)
- **auth_socket**: [Socket Peer-Credential Authentication](https://dev.mysql.com/doc/refman/8.0/en/socket-pluggable-authentication.html)

---

## 💡 Dicas

### 1. **Usar Senha Sempre em Produção**
Nunca use senha vazia ou auth_socket em produção. Sempre configure senha forte.

### 2. **Backup Antes de Alterar Autenticação**
```bash
mysqldump -u root --all-databases > backup_antes_mudanca.sql
```

### 3. **Gerar Senhas Fortes**
```bash
openssl rand -base64 24
```

### 4. **Logs do MySQL**
Para debug adicional:
```bash
sudo tail -f /var/log/mysql/error.log
```

---

## 🆘 Ainda Com Problemas?

1. **Verifique se MySQL está rodando**:
   ```bash
   sudo systemctl status mysql
   ```

2. **Reinicie o MySQL**:
   ```bash
   sudo systemctl restart mysql
   ```

3. **Verifique portas**:
   ```bash
   sudo netstat -tulpn | grep 3306
   ```

4. **Teste conexão local**:
   ```bash
   telnet localhost 3306
   ```

5. **Abra issue no GitHub**:
   https://github.com/fmunizmcorp/orquestrador-ia/issues

---

## ✅ Checklist de Verificação

Após aplicar as correções, verifique:

- [ ] MySQL está rodando: `sudo systemctl status mysql`
- [ ] Consegue conectar: `mysql -u root -p` (digite a senha)
- [ ] Banco existe: `SHOW DATABASES;` → deve listar `orquestraia`
- [ ] `.env` tem senha correta: `cat .env | grep DB_PASSWORD`
- [ ] Migration funciona: `npm run db:migrate`
- [ ] Tabelas criadas: `mysql -u root -p -e "USE orquestraia; SHOW TABLES;"`
- [ ] Servidor inicia: `npm run dev` ou `pm2 start`

---

**✨ Se o instalador foi executado após o commit `5ea121e`, tudo deve funcionar automaticamente!**
