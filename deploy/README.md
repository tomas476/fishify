# Deploy

O site é estático (`output: "export"` no `next.config.ts`). Publicar é
construir e sincronizar uma pasta.

```bash
# O NEXT_PUBLIC_SITE_URL entra nas etiquetas de partilha. Sem ele, o
# og:image aponta para https://fishify.pt, que ainda nao existe, e o
# cartao do WhatsApp sai em branco.
NEXT_PUBLIC_SITE_URL="https://fishify.imogrow.pt" npm run build
rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519" \
  out/ filipe@167.86.123.215:~/fishify-static/
```

Não é preciso reiniciar nada: o container `fishify_site` monta
`~/fishify-static` em leitura e o Caddy serve o que lá estiver.

## O que está na VPS

| Peça | Onde |
|---|---|
| Ficheiros | `~/fishify-static` |
| Regras do site | `~/sites/fishify.Caddyfile` |
| Container | `fishify_site`, no stack `~/sites/docker-compose.yml` |
| Rede | `imogrow_net`, alcançado por NOME (sem IP fixo) |

O `caddy_proxy` é o único ingress público. O container não publica portas:
o firewall do host só deixa entrar 22, 80, 443 e a 3346.

## Falta para ficar no ar

O registo **A de `fishify.imogrow.pt` para `167.86.123.215`**, na Amen.
Enquanto não existir, NÃO se acrescenta a entrada ao
`~/infra/caddy/Caddyfile`: o Caddy tentaria emitir certificado, o ACME
falhava e queimava o rate limit do domínio de registo, o que castiga
também o `imogrow.pt` e o `fred.imogrow.pt`.

Assim que o registo existir, é acrescentar ao `~/infra/caddy/Caddyfile`:

```
fishify.imogrow.pt {
    encode zstd gzip
    header Strict-Transport-Security "max-age=31536000"
    reverse_proxy fishify_site:80
}
```

e `cd ~/infra && docker compose restart caddy`.
