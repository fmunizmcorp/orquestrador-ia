# ⚡ Instruções Rápidas - Correção do Erro 502

## 🎯 Problema
O sistema mostra **502 Bad Gateway** ao acessar `http://192.168.1.247:3000`

## ✅ Solução (2 minutos)

### No seu servidor (SSH):

```bash
# 1. Entrar no diretório
cd ~/orquestrador-v3

# 2. Atualizar do GitHub
git pull origin main

# 3. Executar script de correção
chmod +x corrigir-frontend.sh
./corrigir-frontend.sh
```

Pronto! O sistema estará funcionando em: **http://192.168.1.247:3001**

---

## 🔍 Se quiser diagnosticar antes:

```bash
cd ~/orquestrador-v3
chmod +x diagnosticar.sh
./diagnosticar.sh
```

---

## 📝 O que o script faz?

1. ✅ Verifica se tudo está compilado
2. ✅ Configura `NODE_ENV=production`
3. ✅ Reconfigura o PM2
4. ✅ Reinicia a aplicação
5. ✅ Testa se está funcionando

---

## 🌐 Resultado Final

Depois da correção:

- **Frontend + Backend**: `http://192.168.1.247:3001`
- **Não precisa** mais da porta 3000
- **Tudo em um único servidor** (mais simples)

---

## ⚙️ Ajustar Nginx (Opcional)

Se quiser continuar acessando pela porta 80 (padrão HTTP):

```bash
sudo nano /etc/nginx/sites-enabled/default
```

Trocar todas as referências de `:3000` para `:3001`:

```nginx
location / {
    proxy_pass http://localhost:3001;  # ← Mudar de 3000 para 3001
    # ... resto da configuração
}
```

Depois:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Aí poderá acessar por: `http://192.168.1.247` (porta 80)

---

## 📞 Comandos Úteis

```bash
# Ver se está rodando
pm2 status

# Ver logs
pm2 logs orquestrador-v3

# Reiniciar
pm2 restart orquestrador-v3

# Parar
pm2 stop orquestrador-v3
```

---

## 🆘 Ainda com problemas?

Execute o diagnóstico completo:

```bash
cd ~/orquestrador-v3
./diagnosticar.sh
```

Ele vai mostrar exatamente o que está errado e como corrigir.

---

**Tempo total**: ~2 minutos  
**Dificuldade**: ⭐ Fácil (copiar e colar 3 comandos)
