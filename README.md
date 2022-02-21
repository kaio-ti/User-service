# Users Service

O Users service é um sistema de cadasto de usuarios utilizando autorização e autenticação.

## Instalação/Utilização

Para ter acesso à estrutura da API, faça o fork e depois clone este projeto.

## Rotas

<h3 align='center'> Cadastro de usuário</h3>

`POST /register - Cadastro de usuários - FORMATO DA REQUISIÇÃO `

```json
{
  "username": "kaio",
  "email": "kaio@email.com",
  "password": "123456",
  "age": 24
}
```

Em caso de sucesso, obterá a seguinte resposta:

`POST /register - FORMATO DA RESPOSTA - STATUS 201`

```json
{
  "id": "f538262c-8c49-4c6c-a663-200c3c91ae10",
  "username": "kaio",
  "email": "kaio@email.com",
  "createdOn": "2022-01-12T23:50:07.614Z",
  "age": 24
}
```

<h3 align='center'> Login de usuário</h3>

`POST /login - para login de usuários FORMATO DA REQUISIÇÃO `

```json
{
  "username": "kaio",
  "password": "123456"
}
```

Em caso de sucesso, obterá a seguinte resposta:

`POST /login - FORMATO DA RESPOSTA - STATUS 200`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRnYWJyaWVsYSIsImlhdCI6MTY0MjAzMDE0NywiZXhwIjoxNjQyMDMzNzQ3fQ.gCL0E0tCmK-pDOYDDz5c6imItL3v9ndwJQfL9-yv12I"
}
```

<h3 align='center'> Buscar usuários</h3>

`GET /users - FORMATO DA REQUISIÇÃO `

Em caso de sucesso, obterá a seguinte resposta:

`GET /users - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "username": "kaio",
    "age": 22,
    "email": "kaio@kenzie.com",
    "createdOn": "2022-01-12T23:50:07.614Z",
    "password": "$2a$10$WKAcFjd15Co20xoZEIKafOzVk2wLWQiOcXG0KIsXSlWkXS4A1qtga",
    "id": "f538262c-8c49-4c6c-a663-200c3c91ae10"
  }
]
```

<h3 align='center'> Editar usuário</h3>

`PUT /users/:id/password - FORMATO DA REQUISIÇÃO `

Authorization: Bearer {token}

```json
{
  "password": "654321"
}
```

Em caso de sucesso, obterá a seguinte resposta:

`Put /users/:id/password - FORMATO DA RESPOSTA - 204`

```json
[]
```
