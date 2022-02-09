import { Schema, type } from "@colyseus/schema";
import { Vector2DSchema } from "./Vector";

export default class CollectibleSchema extends Schema {
  @type("boolean")
  isSpawned!: boolean;

  @type("uint16")
  id!: number;

  @type(Vector2DSchema)
  position: Vector2DSchema = new Vector2DSchema();

  constructor(x?: number, y?: number, id?: number) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.id = id;
    this.isSpawned = true;
  }
}
