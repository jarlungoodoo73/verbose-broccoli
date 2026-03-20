import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: "Widget", description: "A generic widget" },
  { id: 2, name: "Gadget", description: "A useful gadget" },
];
let nextId = 3;

// GET /health - Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /items - List all items
app.get("/items", (_req: Request, res: Response) => {
  res.json({ items, total: items.length });
});

// GET /items/:id - Get a single item
app.get("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json(item);
});

// POST /items - Create a new item
app.post("/items", (req: Request, res: Response) => {
  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };
  if (!name || !description) {
    res.status(400).json({ error: "name and description are required" });
    return;
  }
  const item: Item = { id: nextId++, name, description };
  items.push(item);
  res.status(201).json(item);
});

// DELETE /items/:id - Delete an item
app.delete("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  items.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Stainless app listening on port ${PORT}`);
});

export default app;
