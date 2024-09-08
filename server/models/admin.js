"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true, require: true },
    password: { type: String, required: true },
}, { timestamps: true });
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
exports.default = exports.Admin;
