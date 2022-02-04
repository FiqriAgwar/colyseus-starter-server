import { Schema, type } from "@colyseus/schema";
import { Vector2DSchema } from "./Vector";

export default class PlayerSchema extends Schema {
  @type("boolean")
  isSpawned!: boolean;

  @type("boolean")
  isAlive!: boolean;

  @type("uint16")
  id!: number;

  @type("number")
  angle!: number;

  @type(Vector2DSchema)
  position: Vector2DSchema = new Vector2DSchema();

  @type("number")
  point: number;

  @type("number")
  health: number;
}
