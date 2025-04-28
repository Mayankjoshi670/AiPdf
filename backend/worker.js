const {Worker} = require('bullmq') ; 
const {GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')
const  { QdrantVectorStore } =  require("@langchain/qdrant");
const {Document } = require("@langchain/core/documents");
const  { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const {RecursiveCharacterTextSplitter } = require("@langchain/textsplitters")
const worker = new Worker('upload-file', async job => {
     console.log(`Job :` , job.data) ; 
     const data  = JSON.parse(job.data) ; 
     console.log(data) ; 
     console.log("data loaded ")
    
     const path = data.path ;
    //   load the pdf 
    console.log(`path = ${path}`) 
    const loader = new PDFLoader(path) ; 
    const docs = await loader.load() ; 
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize : 400 , 
        chunkOverlap : 50
    }) ;
    const splitDocs = await textSplitter.splitDocuments(docs) ; 
    // console.log(docs)
    // console.log(splitDocs)
    console.log(docs.length)
    console.log(splitDocs.length)
  }, { concurrency: 100  , 
    connection : {
        host: 'localhost' , 
        port : '6379'
    }
  } );