const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
// const todos = [];

// Middleware
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(400).json({error: "User not found"});
  }

  request.user = user;
  
  return next();
}

function checksExistsIdTodo(request, response, next) {
  const { id } = request.params;

  const todo = todos.find((todo) => todo.id === id);

  if(!todo) {
    console.log(todos);
    return response.status(400).json({error: "Todo not found"});
  }

  request.todo = todo;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  // Verificando se já existe o username informado
  const usersAlreadyExists = users.some((users) => users.username === username);
  // Se username já existe, retorna uma mensagem informando que username já existe
  if (usersAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  }
  console.log(`Aqui: ${username} outro: ${users.username}`);
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).send(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todosOperation);

  return response.status(201).send("To-Do Cadastrado com sucesso");
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsIdTodo, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { todo } = request;

  // Verificando se já existe o id do todo informado
  const idAlreadyExists = todos.some((todos) => todos.id === id);
  // Se o id não existe, retorna uma mensagem informando que não existe o id
  if (!idAlreadyExists) {
    return response.status(400).json({ error: "Id not exists!" });
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).send("Atualização feita com sucesso!");
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsIdTodo, (request, response) => {
  const { done } = request.body;
  const { id } = request.params;
  const { todo } = request;

  // Verificando se já existe o id do todo informado
  const idAlreadyExists = todos.some((todos) => todos.id === id);
  // Se o id não existe, retorna uma mensagem informando que não existe o id
  if (!idAlreadyExists) {
    return response.status(400).json({ error: "Id not exists!" });
  }

  todo.done = done;

  return response.status(201).send("Atualização feita com sucesso!");
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todo } = request;

  const indexTodo = todos.findIndex(
    todoIndex => todoIndex.id === todo.id
  );

  todos.splice(indexTodo, 1);

  return response.status(200).json(todos);
});

module.exports = app;