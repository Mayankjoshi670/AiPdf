const express = require("express") ; 
const router = express.Router() ; 
const upload = require("../controllers/upload")
router.use('/upload' , upload) ; 
module.exports = router ; 
