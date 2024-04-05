# Controle de validade

<img src="validade.avif" alt="Exemplo imagem">

> Esse projeto foi feito para controlar a válidade de produtos perecíveis da loja onde trabalho, é um CRUD com login feito com Next, MUI-Datagrid, NodeJS, Docker e MySQL. 

### Ajustes e melhorias
 
O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ x ] Mudar a data que o produto foi editado a cada edição.
- [ x ] Colocar o nome do usuário que editou o produto.
- [ x ] Manter o nome de usuário ao dar refresh na página.
- [ ] Retirar código inútil.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão mais recente do `docker`

## Campos do banco de dados

- Existem tres tables, produtos, user e useradmin
- User: id, email e senha
- Useradmin: id, email e senha
- Produto: valorAtual, valorAntigo, desconto, cores, estoqueNum, valorFrete, estrelas, img1, img2, img3, img4 e tag

## campos .env
- PORT= porta do servidor
- MYSQL_HOST= host do mysql
- MYSQL_USER= nome de usuario do mysql
- MYSQL_PASSWORD= senha do mysql
- MYSQL_DB= nome da tabela do mysql
- ACCESS_TOKEN_SECRET= secret jwt
- REFRESH_TOKEN= token jwt 1
- ADMIN_TOKEN= token jwt 2
- REFRESH_ADMIN_TOKEN= token jwt 3
- SMTP_HOST= host do provedor de email
- SMTP_PORT= porta do provedor de email
- SMTP_USER= email 
- SMTP_PASSWORD= senha do email

para o email recomendo usar o elasticemail.

## 🚀 Instalando Controle de validade

Para instalar o Controle de validade, siga estas etapas:

Windows:

```
- npm install
- docker run --name Produtos -e MYSQL_ROOT_PASSWORD=[senha do banco] -p 3306:3306 -d mysql
caso tenha baixado a extensão "dabatase client" clique no icone que diz "database" na esquerda e depois no + la em cima
coloque o nome do banco (Produtos), a senha que voce usou no MYSQL_ROOT_PASSWORD e aperte connect
```

## ☕ Usando Controle de validade

Para usar Controle de validade, siga estas etapas:

```
ative o container
npm run dev
```


## 📝 Licença

Esse projeto está sob licença. Veja o arquivo [LICENÇA](LICENSE.md) para mais detalhes.
