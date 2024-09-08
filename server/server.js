"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dbConnection_1 = __importDefault(require("./models/dbConnection"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.use('/', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/groups', groupRoutes_1.default);
app.use('/requests', requestRoutes_1.default);
app.use('/posts', postRoutes_1.default);
await (0, dbConnection_1.default)();
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
