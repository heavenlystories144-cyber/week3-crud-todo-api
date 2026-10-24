const express = require('express');
const app = express();

app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All Todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET Active Todos - Bonus
// Keep this route before /todos/:id
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  res.status(200).json(activeTodos);
});

// GET Completed Todos
app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  res.status(200).json(completedTodos);
});

// GET One Todo by ID
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid todo ID' });
  }

  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
});

// POST New Todo - Create with Validation
app.post('/todos', (req, res) => {
  const task = req.body?.task;

  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({
      message: 'Task is required',
    });
  }

  const nextId = todos.length
    ? Math.max(...todos.map((todo) => todo.id)) + 1
    : 1;

  const newTodo = {
    id: nextId,
    task: task.trim(),
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// PATCH Todo - Update
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const { id: ignoredId, ...updates } = req.body || {};

  Object.assign(todo, updates);

  res.status(200).json(todo);
});

// DELETE Todo
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send();
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});