import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import BattleRoom from "../Room/BattleRoom";
import BattleSchema from "../Schema/Battle";
import CollectibleSchema from "../Schema/Collectible";
import PlayerSchema from "../Schema/Player";
import ProjectileSchema from "../Schema/Projectile";
import { Vector2DSchema } from "../Schema/Vector";

interface Session {
  sessionId: string;
}

interface Transform {
  x: number;
  y: number;
  angle: number;
}

interface ID {
  id: number;
}

interface Coin {
  coinId: number;
}

interface Enemy {
  enemyId: string;
}

interface Velocity {
  velocity: number;
}

interface BulletCollision {
  enemyId: string;
  damage: number;
}

interface WithRoom {
  room: Room;
}

export class OnPlayerJoin extends Command<BattleRoom, Session> {
  execute({ sessionId }: Session) {
    const player = new PlayerSchema();
    player.id = 0;
    player.point = 0;
    this.state.players.set(sessionId, player);
  }
}

export class OnPlayerLeave extends Command<BattleRoom, Session & WithRoom> {
  execute({ sessionId, room }: Session & WithRoom) {
    const player = this.state.players.get(sessionId);
    const id = player?.id || 0;
    if (!player) {
      return;
    }

    this.state.players.delete(sessionId);
    room.broadcast("despawn", id);
  }
}

export class OnPlayerSpawn extends Command<
  BattleRoom,
  Session & Transform & ID
> {
  execute({ sessionId, x, y, id }: Session & Transform & ID) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }

    player.id = id;
    player.isSpawned = true;
    player.isAlive = true;
    player.position.assign({ x, y });
  }
}

export class OnPlayerMove extends Command<
  BattleRoom,
  Session & Partial<Transform>
> {
  execute({ sessionId, x, y, angle }: Session & Partial<Transform>) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
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

export class OnPlayerCollecting extends Command<BattleRoom, Session & Coin> {
  execute({ sessionId, coinId }: Session & Coin) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
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

export class OnPlayerCrash extends Command<BattleRoom, Session & Enemy> {
  execute({ sessionId, enemyId }: Session & Enemy) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }

    const playerId = player.id || 0;

    var anotherPlayer: PlayerSchema;

    this.room.state.players.forEach((p) => {
      if (p.id.toString() == enemyId) {
        anotherPlayer = p as PlayerSchema;
      }
    });

    const anotherPlayerId = anotherPlayer?.id || 0;

    console.log(
      `Crash has been happened between ${playerId} and ${anotherPlayerId}`
    );

    player.isAlive = false;
    anotherPlayer.isAlive = false;
    this.room.broadcast("crash", { playerId, anotherPlayerId });
  }
}

export class OnPlayerShooting extends Command<
  BattleRoom,
  Session & Transform & Velocity
> {
  execute({
    sessionId,
    x,
    y,
    angle,
    velocity,
  }: Session & Transform & Velocity) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }

    const bullet = new ProjectileSchema();
    let n = 1;
    bullet.position.x = x;
    bullet.position.y = y;
    bullet.angle = angle;
    bullet.shooterId = player.id;
    bullet.velocity = velocity;

    this.room.state.projectiles.forEach((proj) => {
      if (proj.shooterId == player.id) {
        n++;
      }
    });

    bullet.id = `${player.id}-${n}`;

    this.room.state.projectiles.set(`${player.id}-${n}`, bullet);
  }
}

export class OnPlayerHit extends Command<BattleRoom, BulletCollision> {
  execute({ enemyId, damage }: BulletCollision) {
    const player = this.room.state.players.get(enemyId) as PlayerSchema;
    if (!player) {
      return;
    }

    player.health -= damage;

    this.room.broadcast("hit", {
      playerId: player.id,
      newHealth: player.health,
    });
  }
}
