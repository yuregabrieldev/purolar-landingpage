# PuroLar — landing page independente

Esta pasta é a versão de produção da landing page. No Vercel, configure o **Root Directory** como `landingpage` e deixe o framework como `Other`.

## GitHub → Vercel

1. Publique este repositório no GitHub.
2. No Vercel, importe o repositório e escolha `landingpage` como Root Directory.
3. Faça o primeiro deploy e associe o domínio `purolarlimpezas.com` e `www.purolarlimpezas.com`.

## Spaceship DNS

No DNS do domínio, use os registos indicados pelo Vercel no momento de adicionar o domínio. Normalmente:

- `A` para `@` apontando para `76.76.21.21`;
- `CNAME` para `www` apontando para `cname.vercel-dns.com`.

Confirme sempre os valores mostrados pelo Vercel, pois podem variar. Não remova os registos de e-mail existentes (MX, SPF e DKIM).

O formulário de contacto da versão local usa `/api/leads`; antes de produção, ligue-o a um serviço de e-mail/CRM ou configure uma função Vercel com armazenamento persistente.
