const express = require("express")
const cors = require("cors")
const app = express() ; 
const main = require("./routes/index")
// const morgarn = require("morgan")
// app.use(morgarn.dev) ; 

app.use(express.json()) ; 
app.use(cors())  ;

app.use('/api/v1' , main) ; 

app.listen(8000 , ()=>{
    console.log("on port 8000") ; 
})