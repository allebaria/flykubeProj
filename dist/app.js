"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./api/routes"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.listen(config_1.default.server.port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${config_1.default.server.port}`);
});
//# sourceMappingURL=app.js.map