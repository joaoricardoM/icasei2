# Desafio Icasei

[![Stacks](https://skillicons.dev/icons?i=js,nodejs,ts,html,css,docker,github)](https://skillicons.dev)

## 📝 Descrição

Desenvolver uma aplicação HTML5. Criar duas aplicações micro-frontend (mf_drawer e mf_videos)

## ⚙️ Funcionalidades

A aplicação MF_DRAWER deve ter dois links, VÍDEOS E FAVORITOS e a aplicação MF_VIDEOS deve conter a busca e listagens.

- VÍDEOS:
  - Ao acessar, o usuário deve poder buscar vídeos através de um campo de busca, onde ele deve informar termos que serão utilizados para buscar vídeos na API do YouTube e listar conforme wireframe.
  - O usuário pode reproduzir o vídeo e marcar como favorito.
  - Ao cliclar no botão de estrela, deve adicionar/remover da lista de favoritos e alterar o contador de total de vídeos na lista de favoritos.
- FAVORITOS:
  - Ao clicar em FAVORITOS, deve exibir a lista de vídeos marcados como favorito.

### Base de Wireframe

[Wireframe vídeos](/wireframe/wireframe_videos.png)

[Wireframe favoritos](/wireframe/wireframe_favs.png)

## Especificações tecnicas

- Ultilizar umas das opções para controle de sessão e BFF

  - [Node.js](https://nodejs.org/en/)
  - [Go](https://go.dev/)
  - [Ruby](https://www.ruby-lang.org/pt/)
  - Qualquer outra linguagem back end também será aceita

- Utilizar a [API de busca do YouTube](https://developers.google.com/youtube/v3/docs/search/list)

## Observações

- Observar padrões e boas práticas de arquitetura
- Para consumir os dados desta [API](https://developers.google.com/youtube/v3/docs/search/list), você deve gerar sua api_key de aplicação neste [link](https://developers.google.com/youtube/v3/getting-started?hl=pt-br).

## 📋 Pré-requisitos

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

2. Crie um arquivo chamado `.env` no diretório bff com a seguinte variável de ambiente:

```env
API_KEY_VALUE=
```

4. Use o `docker-compose` para rodar o projeto. No terminal, navegue até o diretório onde o `docker-compose.yml` está localizado e execute o comando:

```sh
  docker-compose up --build
```

## ☕ Usando

Após iniciar a aplicação, acesse-a no navegador através do endereço `http://localhost:3002`.

MF Drawer: http://127.0.0.1:3002

MF Videos: http://127.0.0.1:3003

BFF (API): http://127.0.0.1:3001/search?query=test
