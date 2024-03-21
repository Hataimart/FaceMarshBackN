import express from "express";
import { conn } from "../dbconnect";
import { UserPortRequest } from "../model/user-get-res";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req,res)=>{
    conn.query('select * from User', (err,result, fields)=>{
        res.json(result);
    })
});

//body request
router.post("/", (req, res) => {
    const data : UserPortRequest = req.body; 
    console.log(data.password+" "+data.email+" "+data.UID);
    
    // res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(data)});
    let sql = "SELECT * FROM User WHERE email=? AND password=?";
    sql = mysql.format(sql,[
        data.email,
        data.password
    ]) 
    conn.query(sql, (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
});

//get user form UID
router.post("/uid", (req, res) => {
    const data : UserPortRequest = req.body; 
    console.log("UID= "+data.UID);
    
    let sql = "SELECT * FROM User WHERE UID=?";
    sql = mysql.format(sql,[data.UID]) 
    conn.query(sql, (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
});

//query
router.get("/:id", (req,res)=>{
    let id = +req.params.id;
    let sql = 'select * from User WHERE UID = ?'
    sql = mysql.format(sql,[id])
    conn.query(sql, (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
        
    })
});