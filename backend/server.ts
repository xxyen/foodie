import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/route"
import cors from "cors";

const app = express();
const port = 4000;


// this will serve all files in the public directory as static// files, such as HTML, CSS, images, etc.
// app.use(express.static("weather"));// this starts the server listening on the specified port
app.use(cors());
app.use(bodyParser.json());

app.use("/users/",userRouter);

app.listen(port, () => {  
    console.log(`Example app listening on port ${port}`);
});