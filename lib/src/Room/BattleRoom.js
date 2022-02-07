"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@colyseus/command");
const Battle_1 = __importDefault(require("../Schema/Battle"));
const BattleCommand_1 = require("../Command/BattleCommand");
const BattleMode_1 = __importDefault(require("../GameMode/BattleMode"));
const PingRoom_1 = __importDefault(require("./PingRoom"));
class BattleRoom extends PingRoom_1.default {
    constructor() {
        super(...arguments);
        this.dispatcher = new command_1.Dispatcher(this);
    }
    onCreate(options) {
        super.onCreate(options);
        this.startHeartbeat();
        this.setState(new Battle_1.default(500));
        this.setPatchRate(1000 / 25);
        this.game = new BattleMode_1.default(this, this.dispatcher);
    }
    onJoin(client) {
        console.log("Join", this.clients.map((c) => c.sessionId));
        this.dispatcher.dispatch(new BattleCommand_1.OnPlayerJoin(), client);
    }
    onLeave(client, consented) {
        this.dispatcher.dispatch(new BattleCommand_1.OnPlayerLeave(), {
            sessionId: client.sessionId,
            room: this,
        });
    }
}
exports.default = BattleRoom;
