import { Schema, type } from "@colyseus/schema";
import { Vector2DSchema } from "./Vector";

export default class ProjectileSchema extends Schema {
  @type("boolean")
  isSpawned!: boolean;

  @type("string")
  id!: string;

  @type("uint16")
  shooterId!: number;

  @type(Vector2DSchema)
  position: Vector2DSchema = new Vector2DSchema();

  @type("number")
  angle!: number;

  @type("number")
  velocity!: number;

  @type("boolean")
  hit!: boolean;

  constructor(
    x?: number,
    y?: number,
    angle?: number,
    id?: string,
    shooterId?: number
  ) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.angle = angle;
    this.id = id;
    this.shooterId = shooterId;
    this.isSpawned = true;
    this.hit = false;
  }
}
