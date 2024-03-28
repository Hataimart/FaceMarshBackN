import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { UserPortRequest } from "../model/user-get-res";
export const router = express.Router();
import mysql from "mysql";

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



router.put("/update", async (req,res)=>{
    let data : UserPortRequest = req.body;
    // res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(data)});
    //ข้อมูลต้นฉบับ
    let sql = "SELECT * FROM User WHERE UID = ?";
    sql = mysql.format(sql, [data.UID]);
    const result = await queryAsync(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const UserOri : UserPortRequest = jsonObj[0];

    //merge data
    const updatePic = {...UserOri, ...data}

    //update data
    sql = "UPDATE `User` SET `fname`=?,`lname`=?,`password`=?,`profile`=?,`type`=?,`limit_upload`=? where `UID`=?";
    sql = mysql.format(sql,[
        updatePic.fname,
        updatePic.lname,
        updatePic.password,
        updatePic.profile,
        updatePic.type,
        updatePic.limit_upload,
        updatePic.UID
    ]);
    conn.query(sql, (err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_rows : result.affectedRows
        });
    })
})