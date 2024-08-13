import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/userRoutes";

const app = express();
const port = 8080;

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

app.use("/users", userRouter);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}/`);
});
