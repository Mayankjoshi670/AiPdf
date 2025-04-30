const express = require("express") ; 
const router = express.Router() ;
const  { QdrantVectorStore } =  require("@langchain/qdrant");
const {GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')
router.get('/' , async (req , res)=>{
    const userQs = req.body.qs ; 
      const embedding = new GoogleGenerativeAIEmbeddings({
           model: "text-embedding-004", // 768 dimensions
         
     
         }) ;
    const vectorStore =  await QdrantVectorStore.fromExistingCollection( embedding, {
        url : 'http://localhost:6333' , 
        collectionName: "RAG-Ai-Pdf"
      })
      const retriever = vectorStore.asRetriever({
        k:2,
      });
      const result = await retriever.invoke(userQs) ; 
      return res.status(200).json({
        res: result
      })  
})


module.exports =router ;