import express from "express";
import path from "path";
import multer from "multer";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
// import config from "../config.firebase.config"
export const router = express.Router();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD18kzrWZBmHlRLRMJIF0ZH3N63xhJiE9M",
  authDomain: "webproject-baed3.firebaseapp.com",
  projectId: "webproject-baed3",
  storageBucket: "webproject-baed3.appspot.com",
  messagingSenderId: "820654184267",
  appId: "1:820654184267:web:94481b1aa8c41b20eabace",
  measurementId: "G-JPWXSTXH2C"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage();

class FileMiddleware {
    filename = "";
    public readonly diskLoader = multer({
          //diskStorage = save to disk
          //memoryStorage = save to firebase?
      storage: multer.memoryStorage(),
      //limits ขนาดของไฟล์
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
  }
  
  // Post /upload + file
  // ถ้ามีการส่งไฟล์มา
  const fileUpload = new FileMiddleware();
  // const fileUpload = multer({ storage: multer.memoryStorage()});

  router.post("/",fileUpload.diskLoader.single("file"), async (req,res) =>{
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
  }
      //upload to firebase storage
      // const filename = Math.round(Math.random() * 10000) + ".png";
      const filename = "PF-"+Date.now()+"-"+Math.round(Math.random()*10000)+ ".png";

      //define location to be saved on storage
      const storageRef = ref(storage, "file/"+filename);

      //define file detail
      const metaData = { contentType : req.file!.mimetype}
      //start upload
      const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metaData);

      //get url of image from storage
      const url = await getDownloadURL(snapshot.ref);

      res.status(200).json({
          url
      });
  });



