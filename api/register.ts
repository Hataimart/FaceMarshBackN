import express from "express";
import { conn } from "../dbconnect";
import { UserPortRequest } from "../model/user-get-res";
import bcrypt from "bcrypt";
import mysql from "mysql";

export const router = express.Router();

//body request
router.post("/", async (req, res) => {
    const pic_amount : number = 0;
    const type : number = 2; 
    const data : UserPortRequest = req.body; 
    const hash = await bcrypt.hash(data.password,13);
    let sql = "INSERT INTO User (fname, lname, email, password, profile, type, limit_upload) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql,[
        data.fname,
        data.lname,
        data.email,
        hash,
        data.profile,
        type,
        pic_amount
    ]) 
    conn.query(sql, (err,result)=>{
        if (err) throw err;
        res.status(200).json({affected_rows: result.affectedRows, last_UID: result.insertID})
    })
});