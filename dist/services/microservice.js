"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Micro = void 0;
const axios_1 = __importDefault(require("axios"));
const Micro = async () => {
    console.log("microservice called");
    const response2 = await axios_1.default.post('http://localhost:3000/api/microservice', {
        name: "paul"
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};
exports.Micro = Micro;
(0, exports.Micro)();
