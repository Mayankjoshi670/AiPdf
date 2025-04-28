const {Worker} = require('bullmq') ; 

 
const worker = new Worker('upload-file', async job => {
     console.log(`Job :` , job.data) ; 
     const data = JSON.parse(job.data) ; 
  }, { concurrency: 100  , 
    connection : {
        host: 'localhost' , 
        port : '6379'
    }
  } );