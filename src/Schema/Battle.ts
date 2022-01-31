import { MapSchema, Schema, type } from "@colyseus/schema";
import PlayerSchema from "./Player";

export default class BattleSchema extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();
}
