import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/userRoutes";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
	}),
);

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!");
});

app.use("/users", userRouter);

// MongoDB Connection
const uri = process.env.MONGO_URI || "";
console.log(uri);
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const run = async () => {
	try {
		await client.connect();
		await client.db().command({ ping: 1 });
		console.log("Deployment pinged. Successfully connected to MongoDB!");

		// App listening
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}/`);
		});
	} finally {
		await client.close();
	}
};

run().catch(console.dir);
