import express, { Request, Response } from "express";
import { v4 as uuid } from "uuid";

const app = express();
const port = 3000;

app.use(express.json());

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: uuid(), title: "Learn TypeScript", completed: false },
  { id: uuid(), title: "Build a REST API", completed: false },
];

app.post("/todos", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo: Todo = { id: uuid(), title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

app.put("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex((item) => item.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[todoIndex] = { ...todos[todoIndex], title, completed };
  res.json(todos[todoIndex]);
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((item) => item.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(deletedTodo);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
