import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const filePath = path.resolve(__dirname, "./src/lib/data.json");

const readBody = async (req: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as {
    name?: string;
  };
};

export const autocompleteDataApi = (): Plugin => ({
  name: "autocomplete-data-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url !== "/api/items" || req.method !== "POST") {
        next();
        return;
      }

      try {
        const { name = "" } = await readBody(req);
        const itemName = name.trim();

        if (!itemName) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: "A name is required." }));
          return;
        }

        const items = JSON.parse(
          await fs.readFile(filePath, "utf8")
        ) as Array<{ id: string; name: string }>;

        const existingItem = items.find(
          (item) => item.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
        );

        const createdItem = existingItem ?? {
          id: `${items.length + 1}`,
          name: itemName,
        };

        if (!existingItem) {
          await fs.writeFile(
            filePath,
            `${JSON.stringify([...items, createdItem], null, 2)}\n`
          );
        }

        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            value: createdItem.id,
            label: createdItem.name,
          })
        );
      } catch (error) {
        next(error instanceof Error ? error : new Error("Failed to add item."));
      }
    });
  },
});
