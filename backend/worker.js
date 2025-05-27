const {Worker} = require('bullmq') ; 
const {GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')
const  { QdrantVectorStore } =  require("@langchain/qdrant");
const {Document } = require("@langchain/core/documents");
const { QdrantClient } = require("@qdrant/js-client-rest");
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
     console.log(splitDocs)

    //  now we create a vector embedding in quadrant db 


    const client = new QdrantClient({url : `http://localhost:6333`}) ;
    const embedding = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      apiKey : `AIzaSyAaPnIQZE5g0oUGnKY-6Dj_UgIab4XhPpU`

    })
    const vectorStore =  await QdrantVectorStore.fromExistingCollection( embedding, {
      url : 'http://localhost:6333' , 
      collectionName: "RAG-Ai-Pdf"
    })

    await vectorStore.addDocuments(splitDocs);
    console.log("all docs are loaded to vector store ")

  }, { concurrency: 100  , 
    connection : {
        host: 'localhost' , 
        port : '6379'
    }
  } );


  trt\
  dgddf
  