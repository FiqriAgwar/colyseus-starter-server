"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Colyseus + Express
const colyseus_1 = require("colyseus");
const ws_transport_1 = require("@colyseus/ws-transport");
const monitor_1 = require("@colyseus/monitor");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const BattleRoom_1 = __importDefault(require("./src/Room/BattleRoom"));
const port = Number(process.env.PORT || 3300) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const gameServer = new colyseus_1.Server({
    transport: new ws_transport_1.WebSocketTransport({
        server,
    }),
});
const monitorRouter = (0, monitor_1.monitor)({
    columns: [
        "roomId",
        "name",
        "clients",
        { metadata: "ping" },
        "locked",
        "elapsedTime",
    ],
});
app.use("/colyseus", monitorRouter);
app.get("/ping", (_, res) => {
    res.status(200).send("pong");
});
gameServer.define("battle_room", BattleRoom_1.default);
gameServer.listen(port).then(() => {
    console.log(`Running on COLYSEUS port ${port}`);
});
