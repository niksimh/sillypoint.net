"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qs_1 = __importDefault(require("qs"));
const cors_1 = __importDefault(require("cors"));
const check_in_1 = __importDefault(require("./http-handlers/check-in"));
const app = (0, express_1.default)();
const port = 4000;
app.set("query parameter", (str) => {
    qs_1.default.parse(str);
});
app.get('/', (0, cors_1.default)(), (req, res) => {
    res.send('Hello World!');
});
app.get('/check-in', (0, cors_1.default)(), (req, res) => {
    let direction = (0, check_in_1.default)(req.query);
    res.json({ direction });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
