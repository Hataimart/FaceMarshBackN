import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

//query request
// router.get('/',(req,res)=>{
//     if (req.query.id) {
//         res.send('Get in index.ts Query id: '+req.query.id);
//     } else {
//         res.send('get in index.ts');
//     }
// });

//body request
router.post("/", (req, res) => {
    let body = req.body; 
    res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(body)});
    // res.send("Get in index.ts body: " + JSON.stringify(body));
});

//get all users
router.get("/", (req,res)=>{
    conn.query('select * from User', (err,result, fields)=>{
        res.json(result);
    })
});

