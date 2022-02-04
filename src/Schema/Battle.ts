import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import CollectibleSchema from "./Collectible";
import PlayerSchema from "./Player";

export default class BattleSchema extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type({ map: CollectibleSchema })
  collectibles = new MapSchema<CollectibleSchema>();

  constructor(nCollectibles?: number) {
    super();
    this.collectibles = new MapSchema<CollectibleSchema>();
    for (let i = 0; i < nCollectibles; i++) {
      this.collectibles.set(
        i.toString(),
        new CollectibleSchema(
          Math.floor(Math.random() * Math.pow(2, 12) + 1),
          Math.floor(Math.random() * Math.pow(2, 12) + 1),
          i
        )
      );
    }
  }
}
