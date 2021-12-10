import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";

const port = 4001;
const app = express();
app.use(index);

const server = createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));
