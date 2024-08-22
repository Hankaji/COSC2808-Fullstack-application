import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./models/dbConnection";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import groupRouter from "./routes/groupRoutes";

dotenv.config();
const app = express();
const port = 8080;

app.use(
	session({
		secret: process.env.SESSION_SECRET || "session_secret_key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
	})
);

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!");
});

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/groups", groupRouter);

await connectDB();

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}/`);
});
