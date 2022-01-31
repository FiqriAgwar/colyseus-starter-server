"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const MetaTool_1 = require("../Util/MetaTool");
class PingRoom extends colyseus_1.Room {
    constructor(presence) {
        super(presence);
        this.maxPing = 5000;
    }
    onCreate(options) {
        this.setMetadata({});
        this.metadata.ping = 0;
        this.listenPingPong();
    }
    listenPingPong() {
        this.onMessage('ping', this.onPing.bind(this));
        this.onMessage('pong', this.onPong.bind(this));
    }
    onPing(client, message) {
        client.send('pong', message);
    }
    onPong(client, message) {
        var _a;
        if (client.userData === undefined) {
            client.userData = {};
        }
        const pong = (0, MetaTool_1.getMeta)(client.userData, 'pong', -1);
        if (pong > message) {
            return;
        }
        const delta = this.clock.currentTime - message;
        (0, MetaTool_1.setMeta)(client.userData, 'ping', delta);
        (0, MetaTool_1.setMeta)(client.userData, 'pong', message);
        if (delta > this.maxPing) {
            (_a = this._events) === null || _a === void 0 ? void 0 : _a.emit('ping-timeout', client, delta);
        }
    }
    startHeartbeat(pingInterval = this.maxPing, calInterval = this.maxPing) {
        var _a, _b;
        (_a = this.delayedPing) === null || _a === void 0 ? void 0 : _a.clear();
        this.delayedPing = this.clock.setInterval(this.sendPing.bind(this), pingInterval);
        (_b = this.delayedCalcPing) === null || _b === void 0 ? void 0 : _b.clear();
        this.delayedCalcPing = this.clock.setInterval(this.calcAveragePing.bind(this), calInterval);
    }
    sendPing() {
        this.broadcast('ping', this.clock.currentTime);
    }
    calcAveragePing() {
        const { metadata } = this;
        const total = this.clients.reduce((total, client) => {
            var _a;
            total += ((_a = client.userData) === null || _a === void 0 ? void 0 : _a.ping) || 0;
            return total;
        }, 0);
        const average = this.clients.length ? total / this.clients.length : 0;
        if (metadata) {
            metadata.ping = average;
        }
    }
}
exports.default = PingRoom;
