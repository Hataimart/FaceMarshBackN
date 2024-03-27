import express from "express";
import { conn } from "../dbconnect";
import { PointPortRequest } from "../model/point-get-res";
import { UserPortRequest } from "../model/user-get-res";
import mysql from "mysql";

export const router = express.Router();



// router.get("/", (req, res) => {
//   conn.query('SELECT CURRENT_TIMESTAMP() as date', (err, result, fields) => {
//     const currentDate = result[0].date;

//     res.json("result: " + currentDate);
//   })
// });

//SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY), '%d-%m-%y') AS yesterdayDate
//SELECT DATE_FORMAT(NOW(), "%d-%m-%y") AS currentDate
router.get("/", (req, res) => {
  // let sql = "SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY), '%d-%m-%y') AS currentDate";
  // let sql = "select date from History";
  // date = DATE_SUB(CURDATE(), INTERVAL 3 DAY)
  
  let sql = "SELECT * FROM History WHERE date = (SELECT MAX(DATE_SUB(date, INTERVAL 1 DAY)) FROM History)"
  
  conn.query(sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching the date.' });
      return;
    }
    // const currentDate = result[0].currentDate;
    // res.json({ thisday: currentDate });
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const data: PointPortRequest = req.body;

  // let sql = "SELECT COUNT(*) AS count FROM History where PID = ? AND date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) ";
  let sql = "SELECT COUNT(*) AS count FROM History where PID = ? AND date = CURRENT_DATE";

  // let sql ="SELECT date FROM History"
  sql = mysql.format(sql, [data.PID]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    //return if result have no data
    // res.send(result);
    else {
      if (result[0].count === 0) {
        
        //if there is no data of today picture. insert new data for today
        // sql = "INSERT INTO History(`PID`, `point`, `date`) VALUES (?,?,DATE_SUB(CURDATE(), INTERVAL 1 DAY))";
        sql = "INSERT INTO History(`PID`, `point`, `date`) VALUES (?,?,CURRENT_DATE)";

        sql = mysql.format(sql, [
          data.PID,
          data.point,
        ]);
        conn.query(sql, (err,result)=>{
          if(err) throw err;
        res.status(200).json({
            affected_rows : result.affectedRows
        });
        })
      } 
      else {
        // update if there's a data of today picture.
        // sql = "UPDATE `History` SET `point`= ? WHERE PID = ? AND date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) ";
        sql = "UPDATE `History` SET `point`= ? WHERE PID = ? AND date = CURRENT_DATE";
        sql = mysql.format(sql, [
          data.point,
          data.PID
        ]);
        conn.query(sql, (err,result)=>{
          if(err) throw err;
        res.status(200).json({
            affected_rows : result.affectedRows
        });
        })
      }
    }
  });
})





