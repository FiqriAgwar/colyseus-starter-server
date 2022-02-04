import { Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import BattleSchema from "../Schema/Battle";
import { OnPlayerJoin, OnPlayerLeave } from "../Command/BattleCommand";
import BattleMode from "../GameMode/BattleMode";
import PingRoom from "./PingRoom";

export default class BattleRoom extends PingRoom<BattleSchema> {
  dispatcher = new Dispatcher(this);

  game: BattleMode;

  onCreate(options: any): void | Promise<any> {
    super.onCreate(options);
    this.startHeartbeat();
    this.setState(new BattleSchema(1));
    this.setPatchRate(1000 / 25);
    this.game = new BattleMode(this, this.dispatcher);
  }

  onJoin(client: Client) {
    console.log(
      "Join",
      this.clients.map((c) => c.sessionId)
    );
    this.dispatcher.dispatch(new OnPlayerJoin(), client);
  }

  onLeave(client: Client, consented?: boolean): void | Promise<any> {
    this.dispatcher.dispatch(new OnPlayerLeave(), {
      sessionId: client.sessionId,
      room: this,
    });
  }
}
