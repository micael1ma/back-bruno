let express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const pizzaRouter = require("./routes/pizzaRouter");
const orderRouter = require("./routes/orderRouter");
const aiRouter = require("./routes/aiRouter");

const db = require("./database/db");

const { createServer } = require("http");
const { WebSocketServer, WebSocket } = require("ws");
const aiService = require("./services/AiService");

const app = express();
const server = createServer(app);
const ws = new WebSocketServer({ server });

ws.on("connection", (client) => {
  console.log("Cliente adicionado");

  client.on("message", async (message) => {
    const msg = message.toString();
    const msgJson = JSON.parse(msg);
    const result = await aiService.longContext(msgJson.question);
    client.send(JSON.stringify({ text: result.text(), sentBy: "Gemini" }));
  });
});

app.use(cors());

app.use(bodyParser.json());
app.use("/api", authRouter);
app.use("/api", pizzaRouter);
app.use("/api", orderRouter);
app.use("/api", aiRouter);

const port = 3000;
server.listen(port, () => {
  console.log(`Server with WebSocket is running on port ${port}`);
});
