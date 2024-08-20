import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import { MongoClient, ServerApiVersion } from "mongodb";
import connectDB from "./models/dbConnection";
import Post from "./models/post";

dotenv.config();
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.json());
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
app.use("/posts", postRouter);
app.use("/groups", groupRouter);

// MongoDB Connection
// const uri = process.env.MONGO_URI || "";
// console.log(uri);
// const client = new MongoClient(uri, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true,
// 	},
// });
//
// const run = async () => {
// 	try {
// 		await client.connect();
// 		await client.db().command({ ping: 1 });
// 		console.log("Deployment pinged. Successfully connected to MongoDB!");
//
// 	} finally {
// 		await client.close();
// 	}
// };

await connectDB();

// App listening
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});

// run().catch(console.dir);

// This part is for testing the multer middleware
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/createpost', (req, res) => {
    res.render('createpost');
});

// Middleware to serve static files
app.use('/media', express.static(path.join(__dirname, 'media')));

// Route to render the edit form
app.get('/posts/edit/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('updatepost', { post });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/test', (req, res) => {
    if (req.body._method === 'PUT') {
        // Handle as PUT request
        res.send('PUT request successful');
    } else {
        // Handle as POST request
        res.send('POST request successful');
    }
});

app.get('/test', (req, res) => {
    res.render('testPut');
});