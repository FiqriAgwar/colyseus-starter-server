import {
  OnPlayerCollecting,
  OnPlayerCrash,
  OnPlayerMove,
  OnPlayerShooting,
  OnPlayerSpawn,
} from "../Command/BattleCommand";
import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";

export default class BattleMode {
  constructor(private room: Room, private dispatcher: Dispatcher<Room>) {
    this.room.onMessage("spawn", this.OnSpawn.bind(this));
    this.room.onMessage("move", this.OnMove.bind(this));
    this.room.onMessage("collected", this.OnCollecting.bind(this));
    this.room.onMessage("crash", this.OnCrash.bind(this));
    this.room.onMessage("shoot", this.OnShoot.bind(this));
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

  OnCrash(client: Client, msg: { enemyId: string }) {
    const { sessionId } = client;
    this.dispatcher.dispatch(new OnPlayerCrash(), { sessionId, ...msg });
  }

  OnShoot(
    client: Client,
    msg: { x: number; y: number; angle: number; velocity: number }
  ) {
    const { sessionId } = client;
    this.dispatcher.dispatch(new OnPlayerShooting(), { sessionId, ...msg });
  }
}
