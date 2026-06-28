import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Returns the items array entirely
  app.get("/items", (req, res) => {
    res.json(items)
  });

  // Returns the item specified by the id
  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = items.find((item) => item.id === id);

    if(!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  });

  // Adds a new item to the array
  app.post("/items", (req, res) => {
    const { name, quantity } = req.body;

    if (typeof name !== "string" || name.trim() === "" || typeof quantity !== "number") {
      return res.status(400).json({ error: "name and quantity required" });
    }

    const item = {
      id: nextId++,
      name,
      quantity
    };

    items.push(item);
    res.status(201).json(item);
  });

  // Takes in an id and an item and replaces the id with the item
  app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, quantity } = req.body;
    const index = items.findIndex((item) => item.id === id);

    if (typeof name !== "string" || name.trim() === "" || typeof quantity !== "number") {
      return res.status(400).json({ error: "name and quantity required"});
    }

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedItem = { id, name, quantity };
    items[index] = updatedItem;

    res.json(updatedItem);
  });

  // Remove an item using splice
  app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    items.splice(index, 1);
    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
