import express from "express";
import path from "path";
import multer from "multer";
// import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export const router = express.Router();

class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 10000);
        this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
        cb(null, this.filename);
      },
    }),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

const fileUpload = new FileMiddleware();
router.post("/", fileUpload.diskLoader.single("file"), (req, res) => {
  res.json({ filename: "/uploads/" + fileUpload.filename });
});

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD18kzrWZBmHlRLRMJIF0ZH3N63xhJiE9M",
//   authDomain: "webproject-baed3.firebaseapp.com",
//   projectId: "webproject-baed3",
//   storageBucket: "webproject-baed3.appspot.com",
//   messagingSenderId: "820654184267",
//   appId: "1:820654184267:web:94481b1aa8c41b20eabace",
//   measurementId: "G-JPWXSTXH2C"
// };

// // // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// const storage = getStorage();

// class FileMiddleware {
//     filename = "";
//     public readonly diskLoader = multer({
//   // storage เป็นการเซฟไฟล์ลง memory แทน disk
//       storage: multer.diskStorage({
//     //destination ตำแหน่ง folder ที่เซฟ โดยเซฟใน folder uploads ใช่ในการเซฟไฟล์

//         destination: (_req, _file, cb) => {
//           cb(null, path.join(__dirname, "../uploads"));
//         },
//     //filename ชื่อไฟล์ที่ไม่ซ้ำกัน
//         filename: (req, file, cb) => {
//           const uniqueSuffix =
//             Date.now() + "-" + Math.round(Math.random() * 10000);
//           this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
//           cb(null, this.filename);
//         },
//       }),
//       //limits ขนาดของไฟล์
//       limits: {
//         fileSize: 67108864, // 64 MByte
//       },
//     });
//   }
  
//   // Post /upload + file
//   // ถ้ามีการส่งไฟล์มา
//   const fileUpload = new FileMiddleware();
//   router.post("/",fileUpload.diskLoader.single("file"), async (req,res) =>{
//       //upload to firebase storage
//       const filename = Math.round(Math.random() * 10000) + ".png";
//       //define location to be saved on storage
//       const storageRef = ref(storage, "/file/"+filename);
//       //define file detail
//       const metaDate = { contentType : req.file!.mimetype}
//       //start upload
//       const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metaDate);
//       //get url of image from storage
//       const url = await getDownloadURL(snapshot.ref);
//       res.status(200).json({
//           filename: url,
//       });
//   });