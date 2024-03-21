import express from "express";
import { router as index } from "./api/index";
import { router as login } from "./api/login"
import { router as register } from "./api/register";
import { router as collection } from "./api/collection";
import { router as upload } from "./api/upload";
import { router as history} from "./api/history";

import bodyParser = require("body-parser");
import cors from "cors";

export const app = express();
app.use(
    cors({
        // origin: "http://localhost:4200",
        origin : "*",
    })
);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/login", login);
app.use("/register", register);
app.use("/collection", collection);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
app.use("/history", history);

// app.use("/", (req,res) =>{
//     res.send("Hello World!!!");
// });