// Colyseus + Express
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import BattleRoom from "./src/Room/BattleRoom";

const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

const monitorRouter = monitor({
  columns: [
    "roomId",
    "name",
    "clients",
    {metadata: "ping"},
    "locked",
    "elapsedTime"
  ]
});

app.use('/colyseus', monitorRouter);

app.get('/ping', (_, res) => {
  res.status(200).send('pong');
});

gameServer.define('battle_room', BattleRoom);

gameServer.listen(port).then(() => {
  console.log(`Running on COLYSEUS port ${port}`);
});