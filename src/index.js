let express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRouter');
const pizzaRouter = require('./routes/pizzaRouter');
const orderRouter = require('./routes/orderRouter');

const db = require('./database/db');

const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = createServer(app);
const ws = new WebSocketServer({ server });

const clients = new Set();

ws.on('connection', (client) => {
  clients.add(client);

  client.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Raw data received:', parsedMessage, 'Type:', typeof parsedMessage);

      for (let c of clients) {
        if (c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify(parsedMessage));
        }
      }
    } catch (error) {
      console.error('Error parsing:', error);
      client.send(JSON.stringify({ error: 'Invalid JSON format' }));
    }
  });

  client.on('close', () => {
    clients.delete(client);
  });
});

app.use(cors());

app.use(bodyParser.json());
app.use('/api', authRouter);
app.use('/api', pizzaRouter);
app.use('/api', orderRouter);

const port = 3000;
server.listen(port, () => {
  console.log(`Server with WebSocket is running on port ${port}`);
});
