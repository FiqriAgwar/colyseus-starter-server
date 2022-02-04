"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPlayerCrash = exports.OnPlayerCollecting = exports.OnPlayerMove = exports.OnPlayerSpawn = exports.OnPlayerLeave = exports.OnPlayerJoin = void 0;
const command_1 = require("@colyseus/command");
const Player_1 = __importDefault(require("../Schema/Player"));
class OnPlayerJoin extends command_1.Command {
    execute({ sessionId }) {
        const player = new Player_1.default();
        player.id = 0;
        player.point = 0;
        this.state.players.set(sessionId, player);
    }
}
exports.OnPlayerJoin = OnPlayerJoin;
class OnPlayerLeave extends command_1.Command {
    execute({ sessionId, room }) {
        const player = this.state.players.get(sessionId);
        const id = (player === null || player === void 0 ? void 0 : player.id) || 0;
        if (!player) {
            return;
        }
        this.state.players.delete(sessionId);
        room.broadcast("despawn", id);
    }
}
exports.OnPlayerLeave = OnPlayerLeave;
class OnPlayerSpawn extends command_1.Command {
    execute({ sessionId, x, y, id }) {
        const player = this.room.state.players.get(sessionId);
        if (!player) {
            return;
        }
        player.id = id;
        player.isSpawned = true;
        player.isAlive = true;
        player.position.assign({ x, y });
    }
}
exports.OnPlayerSpawn = OnPlayerSpawn;
class OnPlayerMove extends command_1.Command {
    execute({ sessionId, x, y, angle }) {
        const player = this.room.state.players.get(sessionId);
        if (!player) {
            return;
        }
        if (x !== undefined) {
            player.position.assign({ x });
        }
        if (y !== undefined) {
            player.position.assign({ y });
        }
        if (angle !== undefined) {
            player.assign({ angle });
        }
    }
}
exports.OnPlayerMove = OnPlayerMove;
class OnPlayerCollecting extends command_1.Command {
    execute({ sessionId, coinId }) {
        const player = this.room.state.players.get(sessionId);
        if (!player) {
            return;
        }
        const coin = this.room.state.collectibles.get(coinId.toString());
        if (!coin) {
            return;
        }
        player.point += 1;
        const id = player.id;
        const nX = Math.floor(Math.random() * Math.pow(2, 12)) + 1;
        const nY = Math.floor(Math.random() * Math.pow(2, 12)) + 1;
        coin.position.assign({
            x: nX,
            y: nY,
        });
        this.room.broadcast("collected", { coinId, nX, nY, id });
    }
}
exports.OnPlayerCollecting = OnPlayerCollecting;
class OnPlayerCrash extends command_1.Command {
    execute({ sessionId, enemyId }) {
        const player = this.room.state.players.get(sessionId);
        if (!player) {
            return;
        }
        const playerId = player.id || 0;
        var anotherPlayer;
        this.room.state.players.forEach((p) => {
            if (p.id.toString() == enemyId) {
                anotherPlayer = p;
            }
        });
        const anotherPlayerId = (anotherPlayer === null || anotherPlayer === void 0 ? void 0 : anotherPlayer.id) || 0;
        console.log(`Crash has been happened between ${playerId} and ${anotherPlayerId}`);
        player.isAlive = false;
        anotherPlayer.isAlive = false;
        this.room.broadcast("crash", { playerId, anotherPlayerId });
    }
}
exports.OnPlayerCrash = OnPlayerCrash;
