"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleCommand_1 = require("../Command/BattleCommand");
class BattleMode {
    constructor(room, dispatcher) {
        this.room = room;
        this.dispatcher = dispatcher;
        this.room.onMessage('spawn', this.OnSpawn.bind(this));
        this.room.onMessage('move', this.OnMove.bind(this));
    }
    OnSpawn(client, msg) {
        const { sessionId } = client;
        this.dispatcher.dispatch(new BattleCommand_1.OnPlayerSpawn(), Object.assign(Object.assign({ sessionId }, msg), { angle: 0 }));
    }
    OnMove(client, msg) {
        const { sessionId } = client;
        this.dispatcher.dispatch(new BattleCommand_1.OnPlayerMove(), Object.assign({ sessionId }, msg));
    }
}
exports.default = BattleMode;
