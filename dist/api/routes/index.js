"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("../health"));
const routes = express_1.default();
//Routes
const HEALTH = '/health';
//Link routes with endpoints
routes.use(HEALTH, health_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map