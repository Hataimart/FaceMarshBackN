import express from "express";
import { conn,queryAsync } from "../dbconnect";

import mysql from "mysql";
import { PicturePortRequest } from "../model/pic-get-res";


export const router = express.Router();

router.get("/", (req,res)=>{
    conn.query('select * from Picture ORDER BY point DESC', (err,result, fields)=>{
        res.json(result);
    })
});

//เหมือนกันแต่เพิ่ม limit
router.get("/top", (req,res)=>{
    conn.query('select * from Picture ORDER BY point DESC LIMIT 10', (err,result, fields)=>{
        res.json(result);
    })
});

//display all picture of the user
router.get("/owner/:id", (req,res)=>{
    console.log("owner");
    
    let id = +req.params.id;
    let sql = 'select * from Picture where madeBy = ?'
    conn.query(sql, [id], (err,result, fields)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
});

router.get("/random", (req,res)=>{
    let sql = 'SELECT * FROM Picture ORDER BY RAND() LIMIT ?';
    sql = mysql.format(sql,[2]) 
    conn.query(sql, (err, result, fields)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
})

router.get("/:id", (req,res)=>{
    let id = +req.params.id;
    let sql = 'SELECT * FROM Picture WHERE PID = ?'
    sql = mysql.format(sql,[id])
    conn.query(sql, (err, result, fields)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
})

router.put("/update", async (req,res)=>{
    let data : PicturePortRequest = req.body;
    // res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(data)});
    //ข้อมูลต้นฉบับ
    let sql = "SELECT * FROM Picture WHERE PID = ?";
    sql = mysql.format(sql, [data.PID]);
    const result = await queryAsync(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const PicOri : PicturePortRequest = jsonObj[0];

    //merge data
    const updatePic = {...PicOri, ...data}

    //update data
    sql = "update  `Picture` set `madeBy`=?, `fname`=?, `lname`=?, `image`=?, `description`=?, `category`=?, `point`=? where `PID`=?";
    sql = mysql.format(sql,[
        updatePic.madeBy,
        updatePic.fname,
        updatePic.lname,
        updatePic.image,
        updatePic.description,
        updatePic.category,
        updatePic.point,
        updatePic.PID
    ]);
    conn.query(sql, (err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_rows : result.affectedRows
        });
    })
})


router.get("/show/:pid",(req,res)=>{
    let pid = +req.params.pid;

    let sql = "SELECT point,date FROM History where PID = ? "
            +"AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE() "
            +"ORDER BY date";

    sql = mysql.format(sql,[pid])
    conn.query(sql, (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            res.status(200).json(result);
        }
    })
})

//insert picture
router.post("/insert", (req, res) => {
    const data : PicturePortRequest = req.body; 
    
    let sql = "INSERT INTO `Picture`(`madeBy`, `fname`, `lname`, `image`, `description`, `point`) VALUES (?,?,?,?,?,?)";
    let sql2 = "UPDATE User SET limit_upload = limit_upload+1 WHERE UID = ?"
    sql = mysql.format(sql,[
        data.madeBy,
        data.fname,
        data.lname,
        data.image,
        data.description,
        data.point
    ]) ;
    sql2 = mysql.format(sql,[data.PID]);
    conn.query(sql, (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            sql2 = mysql.format(sql,[data.PID]);
            conn.query(sql2)
            res.status(200).json(result);
        }
    })
});

//delete picture
router.delete("/remove", (req, res) => {
    let PID = req.query.pid;
    let UID = req.query.uid;
    // [ req.query.id, "%" + req.query.name + "%"],
    let sql = "DELETE FROM PICTURE where PID = ?";
    let sql2 = "UPDATE User SET limit_upload = limit_upload-1 WHERE UID = ?"
    let sql3 = "DELETE FROM History where PID = ?"
    conn.query(sql,[PID], (err,result)=>{
        if(err){
            res.status(400).json(err)
        }else{
            conn.query(sql2,[UID], (err,result)=>{
                if(err){
                    res.status(400).json(err)
                }else{
                    conn.query(sql3,[PID], (err,result)=>{
                        if(err){
                            res.status(400).json(err)
                        }
                        else{
                            res.status(200).json(result)
                        }
                    })
                }
            })
            
        }
    })
});