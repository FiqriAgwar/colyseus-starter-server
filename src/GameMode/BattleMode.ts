import {
  OnPlayerCollecting,
  OnPlayerMove,
  OnPlayerSpawn,
} from "../Command/BattleCommand";
import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";

export default class BattleMode {
  constructor(private room: Room, private dispatcher: Dispatcher<Room>) {
    this.room.onMessage("spawn", this.OnSpawn.bind(this));
    this.room.onMessage("move", this.OnMove.bind(this));
    this.room.onMessage("collected", this.OnCollecting.bind(this));
  }

  OnSpawn(client: Client, msg: { x: number; y: number; id: number }) {
    const { sessionId } = client;
    this.dispatcher.dispatch(new OnPlayerSpawn(), {
      sessionId,
      ...msg,
      angle: 0,
    });
  }

  OnMove(client: Client, msg: { x: number; y: number; angle: number }) {
    const { sessionId } = client;
    this.dispatcher.dispatch(new OnPlayerMove(), { sessionId, ...msg });
  }

  OnCollecting(client: Client, msg: { coinId: number }) {
    const { sessionId } = client;
    this.dispatcher.dispatch(new OnPlayerCollecting(), { sessionId, ...msg });
  }
}
