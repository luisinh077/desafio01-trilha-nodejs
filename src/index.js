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
    return response.status(404).json({error: "User not found"});
  }

  request.todos = user.todos;
  
  return next();
}

function checksExistsIdTodo(request, response, next) {
  const { id } = request.params;
  const { users } = request

  // const todo = users.todos.find((todo) => todo.id === id);

  console.log(users);
  // if(!todo) {
  //   return response.status(400).json({error: "Todo not found"});
  // }

  // request.todo = todo;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  // Verificando se já existe o username informado
  const usersAlreadyExists = users.find((users) => users.username === username);
  // Se username já existe, retorna uma mensagem informando que username já existe
  if (usersAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request;

  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { todos } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { todos } = request;

  // Verificando se já existe o id do todo informado
  const todo = todos.find((todo) => todo.id === id);
  // Se o id não existe, retorna uma mensagem informando que não existe o id
  if (!todo) {
    return response.status(404).json({ error: "Id not exists!" });
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request;

  // Verificando se já existe o id do todo informado
  const todo = todos.find((todo) => todo.id === id);
  // Se o id não existe, retorna uma mensagem informando que não existe o id
  if (!todo) {
    return response.status(404).json({ error: "Id not exists!" });
  }

  todo.done = true;
  
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request;

  // Verificando se já existe o id do todo informado
  const todo = todos.find((todo) => todo.id === id);
  // Se o id não existe, retorna uma mensagem informando que não existe o id
  if (!todo) {
    return response.status(404).json({ error: "Id not exists!" });
  }
  
  const indexTodo = todos.findIndex(
    todoIndex => todoIndex.id === id
  );

  todos.splice(indexTodo, 1);

  return response.status(204).json(todos);
});

module.exports = app;