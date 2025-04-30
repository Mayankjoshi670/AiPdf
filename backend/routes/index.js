const express = require("express") ; 
const router = express.Router() ; 
const upload = require("../controllers/upload")
const chat = require("../controllers/chat")
router.use('/upload' , upload) ;
router.use('/chat' , chat) 
module.exports = router ; 
