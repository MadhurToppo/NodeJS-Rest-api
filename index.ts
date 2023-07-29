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
