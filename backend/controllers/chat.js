// const express = require("express") ; 
// const router = express.Router() ;
// const  { QdrantVectorStore } =  require("@langchain/qdrant");
// const {GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')
// const {ChatGoogleGenerativeAI} = require("@langchain/google-genai")
// const model  = new ChatGoogleGenerativeAI({
//   apiKey : "AIzaSyBT7vj9mjdPeuwfAXeCa-ME6XYUN6VcVUA",
//   model: "gemini-2.0-flash",
// })

// router.get('/' , async (req , res)=>{
//     const userQs = req.body.qs ; 
//       const embedding = new GoogleGenerativeAIEmbeddings({
//            model: "text-embedding-004", // 768 dimensions
//            apiKey : `AIzaSyAaPnIQZE5g0oUGnKY-6Dj_UgIab4XhPpU`
     
//          }) ;
//     const vectorStore =  await QdrantVectorStore.fromExistingCollection( embedding, {
//         url : 'http://localhost:6333' , 
//         collectionName: "RAG-Ai-Pdf"
//       })
//       const retriever = vectorStore.asRetriever({
//         k:2,
//       });
//       const result = await retriever.invoke(userQs) ; 

//       //  in result we get the result of the query and the source documents
//       //  now we will put this into llm api and get the answer

//       const SYSTEM_PROMPT =  `you are a helpful assistant. Answer the question based on the context provided. If the answer is not in the context, say "I don't know".
//       Context: ${JSON.stringify(result)}` ; 
//         const response  = await model.invoke([
//           {role:"system" , content : SYSTEM_PROMPT} ,
//           {role:"user" , content : userQs}
//         ])
//       return res.status(200).json({
//         // res: result , 
//         ans : response
//       })  
// })


// module.exports =router ;


const express = require("express");
const router = express.Router();
const { QdrantVectorStore } = require("@langchain/qdrant");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Model setup
const model = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyBT7vj9mjdPeuwfAXeCa-ME6XYUN6VcVUA",
  model: "gemini-2.0-flash",
});

// Route
router.post("/", async (req, res) => {
  try {
    const userQs = req.body.qs;
    if (!userQs) {
      return res.status(400).json({ error: "Missing 'qs' in request body" });
    }

    // Embedding
    const embedding = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: "AIzaSyBT7vj9mjdPeuwfAXeCa-ME6XYUN6VcVUA",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embedding, {
      url: "http://localhost:6333",
      collectionName: "RAG-Ai-Pdf",
    });

    const retriever = vectorStore.asRetriever({ k: 2 });
    const result = await retriever.invoke(userQs); // Array of documents

    // Extract just the text from results
    const context = result.map(doc => doc.pageContent).join("\n\n");

    const SYSTEM_PROMPT = `You are a helpful assistant. Answer the question based on the context provided. If the answer is not in the context, say "I don't know".
Context: ${context}`;

    const response = await model.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQs },
    ]);
    return res.status(200).json({
        ams : response.content 
    });
    
    
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
