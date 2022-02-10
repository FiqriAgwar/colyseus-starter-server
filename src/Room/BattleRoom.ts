import { Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import BattleSchema from "../Schema/Battle";
import {
  OnPlayerHit,
  OnPlayerJoin,
  OnPlayerLeave,
} from "../Command/BattleCommand";
import BattleMode from "../GameMode/BattleMode";
import PingRoom from "./PingRoom";
import { Distance } from "../Util/CalcTool";

export default class BattleRoom extends PingRoom<BattleSchema> {
  dispatcher = new Dispatcher(this);

  game: BattleMode;

  onCreate(options: any): void | Promise<any> {
    super.onCreate(options);
    this.startHeartbeat();
    this.setState(new BattleSchema(200));
    this.setPatchRate(1000 / 16);
    this.game = new BattleMode(this, this.dispatcher);

    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
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

  update(deltaTime: number) {
    this.state.projectiles.forEach((b, id) => {
      b.position.assign({
        x: b.position.x + b.velocity * Math.cos(b.angle) * deltaTime,
        y: b.position.y + b.velocity * Math.sin(b.angle) * deltaTime,
      });

      this.state.players.forEach((p, id) => {
        if (b.shooterId !== p.id) {
          if (
            Distance(b.position.x, b.position.y, p.position.x, p.position.y) <=
            50
          ) {
            this.dispatcher.dispatch(new OnPlayerHit(), {
              enemyId: id,
            });

            b.hit = true;
          }
        }
      });

      if (
        b.position.x <= 0 ||
        b.position.x >= Math.pow(2, 12) + 100 ||
        b.position.y <= 0 ||
        b.position.y >= Math.pow(2, 12) + 100
      ) {
        b.hit = true;
      }
    });
  }
}
