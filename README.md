# nestjs-packer

Este projeto é uma API NestJS para empacotamento de pedidos em caixas.

## Como executar via Docker

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Passos

1. **Clone o repositório**:

   ```sh
   git clone https://github.com/lezisilva163/L2Code.git
   cd nestjs-packer
   ```

2. **Construa e execute o container:**

   ```sh
   docker-compose up --build
   ```

3. **Acesse a aplicação:**

   Abra [http://localhost:3000](http://localhost:3000) no navegador ou use ferramentas como Postman para testar a API.

### Variáveis de ambiente

Você pode configurar variáveis de ambiente no arquivo `docker-compose.yml`. Exemplo:

```yaml
environment:
  - API_KEY=MINHA_CHAVE
```

### Observações

- Sempre que alterar o código, execute novamente `docker-compose up --build` para atualizar o container.
- Para parar o container, pressione `Ctrl+C` ou execute:

  ```sh
  docker-compose down
  ```

---
