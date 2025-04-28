const express = require("express") ; 
const router = express.Router() ; 
const multer = require("multer")  ;
const {Queue} = require("bullmq")

const queue = new Queue("upload-file" , {
    connection : {
        host:'localhost' , 
        port: "6379"
    }
})
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

     
 


router.post('/pdf' ,upload.single('pdf') , async (req , res)=>{
  await   queue.add('uploading-file' , JSON.stringify({
        filename : req.file.originalname , 
        destination : req.file.destination , 
        path : req.file.path
    }))
    return res.json({msg : "uploaded"}) ; 
}) ; 

module.exports =router ; 




// import {QdrantClient} from '@qdrant/js-client-rest';

// const client = new QdrantClient({
//     url: 'https://485fc2d8-8861-48d5-bf8d-15eb90b71f59.europe-west3-0.gcp.cloud.qdrant.io:6333',
//     apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.XomD3YjszDKu--wJphYBt1EL-UI3RZbAYiIpFsFrnRU',
// });

// try {
//     const result = await client.getCollections();
//     console.log('List of collections:', result.collections);
// } catch (err) {
//     console.error('Could not get collections:', err);
// }