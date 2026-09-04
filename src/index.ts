require("dotenv").config();
import express = require("express");
import morgan = require("morgan");
import cors = require("cors");
import helmet from "helmet";
import path = require("node:path");
import { readdirSync } from "node:fs";

const app: express.Application = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: (process.env.ALLOWED_ORIGIN || "").split(",") }));
app.use(express.json({ limit: "10mb" }));

const routesPath = path.join(__dirname, "./routes/");

readdirSync(routesPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((folder) => {
    const folderPath = path.join(routesPath, folder.name);

    readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts"))
      .forEach((file: string) => {
        app.use("/api/" + folder.name, require(path.join(folderPath, file)));
      });
  });

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
