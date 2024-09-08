"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => {
    const validDBNames = ['development', 'production', 'test'];
    const defaultDB = 'test';
    if (process.env.DATABASE === undefined) {
        console.log(`Using default [${defaultDB}] database`);
        return defaultDB;
    }
    else if (validDBNames.includes(process.env.DATABASE)) {
        console.log(`Using [${process.env.DATABASE}] database`);
        return process.env.DATABASE;
    }
    else {
        console.log(`Invalid database name - Using default [${defaultDB}] database instead`);
        return defaultDB;
    }
};
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (uri == undefined) {
        throw new Error('URI not found in environment file.');
    }
    try {
        const conn = await mongoose_1.default.connect(`${process.env.MONGO_URI}`, {
            dbName: database(),
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred');
        }
    }
};
exports.default = connectDB;
