const express = require("express") ; 
const router = express.Router() ; 
const multer = require("multer")  ;


const storage = multer.diskStorage({
    destination :(req , file , cb)=>{
        cb(null , './uploads');
    } , 
    filename: (req , file , cb)=>{
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1e9) ; 
        cb(null ,`${uniqueSuffix} - ${file.originalname}`) ; 
    }
})

const upload = multer({storage:storage})

     
 


router.post('/pdf' ,upload.single('pdf') ,(req , res)=>{
    return res.json({msg : "uploaded"}) ; 
}) ; 

module.exports =router ; 