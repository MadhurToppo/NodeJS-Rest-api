import express, { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const jwtSecret = process.env.JWT_SECRET || "my-secret";

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

declare module "express-serve-static-core" {
  interface Request {
    user?: string;
  }
}

const authenticateJWT = (req: Request, res: Response, next: Function) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  });
};

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "user" && password === "password") {
    const user = { username: "user" };
    const token = jwt.sign(user, jwtSecret);
    return res.json({ token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/todos", authenticateJWT, (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo: Todo = { id: uuid(), title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/todos", authenticateJWT, (req: Request, res: Response) => {
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

app.put("/todos/:id", authenticateJWT, (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex((item) => item.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[todoIndex] = { ...todos[todoIndex], title, completed };
  res.json(todos[todoIndex]);
});

app.delete("/todos/:id", authenticateJWT, (req: Request, res: Response) => {
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
