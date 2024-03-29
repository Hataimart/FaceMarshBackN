import express from "express";
import { conn, queryAsync } from "../dbconnect";

import mysql from "mysql";
import { PicturePortRequest } from "../model/pic-get-res";


export const router = express.Router();

router.get("/", (req, res) => {
    let sql = "SELECT * FROM Picture ORDER BY point DESC";
    // let sql = "select * from Picture ORDER BY point DESC"
    conn.query(sql, (err, result, fields) => {
        // RANK() OVER (ORDER BY score DESC) AS rank
        res.json(result);
    })
});


router.get("/top", (req, res) => {
    // let sql = "select * from Picture ORDER BY point DESC LIMIT 10";
    let sql = "SELECT Picture.*,History.point as Hpoint,History.date,"
    +"@rank1 := ROW_NUMBER() OVER(ORDER BY Picture.point DESC) AS ranking1,"
    +"@rank2 := ROW_NUMBER() OVER(ORDER BY History.point DESC) AS ranking2 "
    +"FROM Picture JOIN History ON Picture.PID = History.PID " 
    +"WHERE (Picture.PID, History.date) IN (SELECT PID,MAX(DATE_SUB(date, INTERVAL 1 DAY)) "
    +"FROM History GROUP BY PID) "
    +"ORDER BY Picture.point DESC, History.point DESC "
    +"LIMIT 10;"
    conn.query(sql, (err, result, fields) => {
        res.json(result);
    })
});

//display all picture of the user
router.get("/owner/:id", (req, res) => {
    // console.log("owner");

    let id = +req.params.id;
    let sql = 'select * from Picture where madeBy = ?'
    conn.query(sql, [id], (err, result, fields) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }
    })
});

router.get("/random", (req, res) => {
    let sql = 'SELECT * FROM Picture ORDER BY RAND() LIMIT ?';

    sql = mysql.format(sql, [2])
    conn.query(sql, (err, result, fields) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }
    })
})

router.get("/:id", (req, res) => {
    let id = +req.params.id;
    let sql = 'SELECT * FROM Picture WHERE PID = ?'
    sql = mysql.format(sql, [id])
    conn.query(sql, (err, result, fields) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }
    })
})

router.put("/update", async (req, res) => {
    let data: PicturePortRequest = req.body;
    // res.status(201).json({ Text: "Get in index.ts body: "+JSON.stringify(data)});
    //ข้อมูลต้นฉบับ
    let sql = "SELECT * FROM Picture WHERE PID = ?";
    sql = mysql.format(sql, [data.PID]);
    const result = await queryAsync(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const PicOri: PicturePortRequest = jsonObj[0];

    //merge data
    const updatePic = { ...PicOri, ...data }

    //update data
    sql = "update  `Picture` set `madeBy`=?, `fname`=?, `lname`=?, `image`=?, `description`=?, `category`=?, `point`=? where `PID`=?";
    sql = mysql.format(sql, [
        updatePic.madeBy,
        updatePic.fname,
        updatePic.lname,
        updatePic.image,
        updatePic.description,
        updatePic.category,
        updatePic.point,
        updatePic.PID
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({
            affected_rows: result.affectedRows
        });
    })
})


router.get("/show/:pid", (req, res) => {
    let pid = +req.params.pid;

    let sql = "SELECT point,date FROM History where PID = ? "
        + "AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE() "
        + "ORDER BY date";

    sql = mysql.format(sql, [pid])
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result);
        }
    })
})

// insert picture
router.post("/insert", (req, res) => {
    const data: PicturePortRequest = req.body;

    let sql = "INSERT INTO `Picture`(`madeBy`, `fname`, `lname`, `image`, `description`, `point`) VALUES (?,?,?,?,?,?)";
    let sql2 = "UPDATE User SET limit_upload = limit_upload+1 WHERE UID = ? AND limit_upload < 5;"
    sql = mysql.format(sql, [
        data.madeBy,
        data.fname,
        data.lname,
        data.image,
        data.description,
        data.point
    ]);
    sql2 = mysql.format(sql2, [data.PID]);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            sql2 = mysql.format(sql2, [data.PID]);
            conn.query(sql2, (err, result) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    if (result.affected_rows === 0) {
                        res.status(400).json({ message: "can't upload more than 5 pic's" });
                    }
                    else {
                        res.status(200).json(result);
                    }
                }
            })
        }
    })
});

//delete picture
router.delete("/remove", (req, res) => {
    let PID = req.query.pid;
    let UID = req.query.uid;
    let sql = "DELETE FROM Picture where PID = ?";
    let sql2 = "UPDATE User SET limit_upload = limit_upload-1 WHERE UID = ?"
    // let sql3 = "DELETE FROM History where PID = ?"
    conn.query(sql, [PID], (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            conn.query(sql2, [UID], (err, result) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    // conn.query(sql3, [PID], (err, result) => {
                    //     if (err) {
                    //         res.status(400).json(err)
                    //     }
                    //     else {
                            res.status(200).json(result)
                    //     }
                    // })
                }
            })

        }
    })
});
