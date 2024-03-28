import express from "express";
import { conn } from "../dbconnect";
import { UserPortRequest } from "../model/user-get-res";
import mysql from "mysql";
import bcrypt from "bcrypt";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select * from User', (err, result, fields) => {
        res.json(result);
    })
});

router.get("/pw", (req, res) => {
    // uid old new return hash/new
    const id = req.query.uid;
    const oldPass = req.query.passO as string;
    const newPass = req.query.passN as string;

    let sql = "SELECT password FROM User WHERE UID=?";
    sql = mysql.format(sql, [id])
    conn.query(sql, async (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            const dbPass = result[0].password;
            const isMatch = await bcrypt.compare(oldPass, dbPass);
            if(isMatch){
                const hash = await bcrypt.hash(newPass,13);
                res.status(200).json({ password: hash });
            }else{
                res.status(400).json("no match");
            }
        }
    })
});

//body request
//login checking
router.post("/", (req, res) => {
    const data: UserPortRequest = req.body;
    // console.log(data.password+" "+data.email+" "+data.UID);

    // res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(data)});
    let sql = "SELECT password FROM User WHERE email=?";
    sql = mysql.format(sql, [
        data.email,
    ])
    conn.query(sql, async (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            const dbPass = result[0].password;
            // console.log(result[0].password);
            const isMatch = await bcrypt.compare(data.password, dbPass);
            if (isMatch) {
                console.log("match");
                sql = "SELECT * FROM User WHERE email=?";
                sql = mysql.format(sql, [
                    data.email,
                ])
                conn.query(sql, async (err, result) => {
                    if (err) {
                        res.status(400).json(err)
                    } else {
                        res.status(200).json(result);
                    }
                })
            } else {
                console.log("no match");
                res.status(400).json(err)
            }
        }
    })
});

//get user form UID
router.post("/uid", (req, res) => {
    const data: UserPortRequest = req.body;
    console.log("UID= " + data.UID);

    let sql = "SELECT * FROM User WHERE UID=?";
    sql = mysql.format(sql, [data.UID])
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }
    })
});

//query
router.get("/:id", (req, res) => {
    let id = +req.params.id;
    let sql = 'select * from User WHERE UID = ?'
    sql = mysql.format(sql, [id])
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }

    })
});