"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const Vector_1 = require("./Vector");
class CollectibleSchema extends schema_1.Schema {
    constructor(x, y, id) {
        super();
        this.position = new Vector_1.Vector2DSchema();
        this.position.x = x;
        this.position.y = y;
        this.id = id;
        this.isSpawned = true;
        console.log(id, x, y);
    }
}
__decorate([
    (0, schema_1.type)("boolean")
], CollectibleSchema.prototype, "isSpawned", void 0);
__decorate([
    (0, schema_1.type)("uint16")
], CollectibleSchema.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)(Vector_1.Vector2DSchema)
], CollectibleSchema.prototype, "position", void 0);
exports.default = CollectibleSchema;
