"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const Collectible_1 = __importDefault(require("./Collectible"));
const Player_1 = __importDefault(require("./Player"));
class BattleSchema extends schema_1.Schema {
    constructor(nCollectibles) {
        super();
        this.players = new schema_1.MapSchema();
        this.collectibles = new schema_1.ArraySchema();
        this.collectibles = new schema_1.ArraySchema();
        for (let i = 0; i < nCollectibles; i++) {
            this.collectibles.push(new Collectible_1.default(Math.floor(Math.random() * Math.pow(2, 12) + 1), Math.floor(Math.random() * Math.pow(2, 12) + 1), i));
        }
    }
}
__decorate([
    (0, schema_1.type)({ map: Player_1.default })
], BattleSchema.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)({ array: Collectible_1.default })
], BattleSchema.prototype, "collectibles", void 0);
exports.default = BattleSchema;
