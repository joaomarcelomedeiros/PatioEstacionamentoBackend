# Documentação do Backend - Sistema de Estacionamento

Este documento apresenta as rotas e operações disponíveis no backend do Sistema de Estacionamento, desenvolvido como parte do trabalho acadêmico da disciplina de Desenvolvimento Web pelos alunos João e Matheus na Universidade Federal de Itajubá (UNIFEI).

## Endpoints Disponíveis

### Carros

#### Criar Carro

- **Rota:** `POST /car`

#### Deletar Carro

- **Rota:** `DELETE /car/:id`

#### Atualizar Carro

- **Rota:** `PUT /car`

#### Obter Carro por ID

- **Rota:** `GET /car/:id`

### Clientes

#### Criar Cliente

- **Rota:** `POST /cliente`

#### Deletar Cliente

- **Rota:** `DELETE /cliente/:id`

#### Atualizar Cliente

- **Rota:** `PUT /cliente`

#### Obter Cliente por ID

- **Rota:** `GET /cliente/:id`

#### Obter Clientes por Nome

- **Rota:** `GET /clientes/:nome`

### Estacionamento

#### Criar Registro de Estacionamento

- **Rota:** `POST /estacionar`

#### Deletar Registro de Estacionamento

- **Rota:** `DELETE /estacionar/:id`

#### Listar Registros por Mês e Ano

- **Rota:** `GET /listarregistros/:ano/:mes`

#### Finalizar Registro de Estacionamento

- **Rota:** `PUT /finalizarestacionar/:id`

### Vagas

#### Obter Todas as Vagas

- **Rota:** `GET /vagas`

#### Obter Vagas Disponíveis

- **Rota:** `GET /vagasdisponiveis`

#### Obter ID de Registro de Estacionamento em Aberto para uma Vaga Ocupada

- **Rota:** `GET /registrovagaocupada/:numvaga`

## Desenvolvedores

- **João**
- **Matheus**

Este backend foi desenvolvido utilizando TypeScript, Node.js, Express e TypeORM.