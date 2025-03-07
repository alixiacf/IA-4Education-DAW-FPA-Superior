const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { Ollama } = require('ollama');
const { ChromaClient } = require('chromadb');

const app = express();
const port = process.env.PORT || 3000;
const ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
const chromaUrl = process.env.CHROMA_URL || 'http://chroma:8000';

console.log(`Connecting to Ollama at: ${ollamaUrl}`);
console.log(`Connecting to ChromaDB at: ${chromaUrl}`);

// Función para verificar la conectividad a Ollama
async function checkOllamaConnectivity() {
  // Intentar con la URL principal
  try {
    console.log(`Verificando conectividad a Ollama en ${ollamaUrl}...`);
    const response = await fetch(`${ollamaUrl}/api/version`);
    if (response.ok) {
      console.log(`✅ Conexión a Ollama exitosa en ${ollamaUrl}`);
      return ollamaUrl;
    }else{
      console.error(`Error conectando a Ollama en ${ollamaUrl}: HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error conectando a Ollama en ${ollamaUrl}:`, error.message);
    return null;
  }
}

// Configure Ollama client
let activeOllamaUrl = ollamaUrl;
const ollama = new Ollama({ url: ollamaUrl });

// Configure ChromaDB client
console.log(`Initializing ChromaDB client with URL: ${chromaUrl}`);
const chroma = new ChromaClient({
  path: chromaUrl,
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 60000 // 60 seconds timeout
  }
});

// Configure file upload with error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create directory if it doesn't exist
    if (!fs.existsSync('pdfs/')) {
      console.log('Creating pdfs directory...');
      fs.mkdirSync('pdfs/', { recursive: true });
    }
    cb(null, 'pdfs/');
  },
  filename: function (req, file, cb) {
    // Use a timestamp to avoid filename conflicts
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); // Sanitize filename
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only PDFs
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize ChromaDB collections
async function initializeChroma(retryCount = 0, maxRetries = 10) {
  try {
    console.log('Initializing ChromaDB...');

    // Wait for ChromaDB to be available
    console.log(`Checking ChromaDB availability (attempt ${retryCount + 1}/${maxRetries + 1})...`);

    try {
      // Simple check to see if ChromaDB is responding
      const response = await fetch(`${chromaUrl}/api/v1/heartbeat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`ChromaDB heartbeat check failed with status: ${response.status}`);
      }

      console.log('ChromaDB is available!');
    } catch (heartbeatError) {
      console.error('ChromaDB heartbeat check failed:', heartbeatError);

      if (retryCount < maxRetries) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff up to 30 seconds
        console.log(`Retrying ChromaDB initialization in ${retryDelay / 1000} seconds...`);
        setTimeout(() => initializeChroma(retryCount + 1, maxRetries), retryDelay);
        return;
      } else {
        throw new Error(`ChromaDB not available after ${maxRetries} retries`);
      }
    }

    // Check if our collection exists, if not create it
    console.log('Listing collections...');
    const collections = await chroma.listCollections();
    console.log(`Found ${collections.length} collections`);

    if (!collections.find(c => c.name === 'pdf_documents')) {
      console.log('Creating pdf_documents collection...');
      await chroma.createCollection({
        name: 'pdf_documents',
        metadata: { description: 'PDF document embeddings' }
      });
      console.log('Created pdf_documents collection successfully');
    } else {
      console.log('pdf_documents collection already exists');
    }
  } catch (error) {
    console.error('Error initializing ChromaDB:', error);

    if (retryCount < maxRetries) {
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff up to 30 seconds
      console.log(`Retrying ChromaDB initialization in ${retryDelay / 1000} seconds...`);
      setTimeout(() => initializeChroma(retryCount + 1, maxRetries), retryDelay);
    } else {
      console.error(`Failed to initialize ChromaDB after ${maxRetries} retries`);
    }
  }
}

// Initialize ChromaDB on server start with a delay to ensure services are up
console.log('Scheduling ChromaDB initialization...');
setTimeout(() => {
  initializeChroma().catch(error => {
    console.error('Unhandled error during ChromaDB initialization:', error);
  });
}, 10000); // Wait 10 seconds before first attempt

// Helper function to generate embeddings
async function generateEmbeddings(text) {
  try {
    const response = await ollama.embed({
      model: 'gemma2',
      prompt: text
    });
    return response.embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);

    // Verificar y actualizar la URL de Ollama si es necesario
    const workingUrl = await checkOllamaConnectivity();
    if (workingUrl) {
        console.log(`Cambiando a URL para embeddings: ${workingUrl}`);
        activeOllamaUrl = workingUrl;

        // Crear un nuevo cliente con la URL que funcionó
        const newOllama = new Ollama({ url: activeOllamaUrl });

        // Intentar nuevamente con el nuevo cliente
        const response = await newOllama.embed({
          model: 'gemma2',
          prompt: text
        });
        return response.embedding;
    } else {
        // Si no hay URL alternativa, reenviar el error original
        throw error;
    }
  }
}

// Function to split text into chunks
function splitIntoChunks(text, chunkSize = 500, overlap = 100) {
  const words = text.split(' ');
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'File too large',
        details: 'The maximum file size is 10MB'
      });
    }
    return res.status(400).json({ 
      error: 'File upload error',
      code: err.code,
      details: err.message
    });
  } else if (err) {
    // An unknown error occurred
    console.error('Unknown error during upload:', err);
    return res.status(500).json({ 
      error: 'File upload failed',
      details: err.message
    });
  }
  next();
});

// Endpoint to upload and process PDF
app.post('/upload-pdf', (req, res, next) => {
  console.log('PDF upload request received');
  
  upload.single('pdf')(req, res, function(err) {
    if (err) {
      // Error already handled by the error middleware
      return;
    }
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Continue with processing
    processPDF(req, res);
  });
});

// PDF processing function
async function processPDF(req, res) {
  console.log(`Processing PDF file: ${req.file.originalname}, Size: ${req.file.size} bytes`);
  
  try {
    const filePath = req.file.path;
    console.log(`Reading file from path: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    console.log(`Read ${dataBuffer.length} bytes from file`);
    
    // Parse PDF
    console.log('Parsing PDF...');
    const pdfData = await pdfParse(dataBuffer);
    console.log(`PDF parsed successfully. Extracted ${pdfData.text.length} characters of text`);
    
    const text = pdfData.text;
    
    // Split text into chunks
    const chunks = splitIntoChunks(text);
    console.log(`Split PDF into ${chunks.length} chunks`);
    
    // Get collection
    console.log('Getting ChromaDB collection...');
    const collection = await chroma.getCollection('pdf_documents');
    console.log('ChromaDB collection retrieved');
    
    // Generate embeddings and store in ChromaDB
    console.log('Generating embeddings and storing in ChromaDB...');
    
    // Track progress for large documents
    let processed = 0;
    const totalChunks = chunks.length;
    
    for (let i = 0; i < totalChunks; i++) {
      const chunk = chunks[i];
      
      try {
        // Generate embedding for chunk
        console.log(`Generating embedding for chunk ${i+1}/${totalChunks}`);
        const embedding = await generateEmbeddings(chunk);
        
        // Store in ChromaDB
        await collection.add({
          ids: [`${req.file.originalname}-chunk-${i}`],
          embeddings: [embedding],
          metadatas: [{ 
            source: req.file.originalname,
            chunk: i,
            text: chunk.substring(0, 100) + '...' // Store a preview of the text
          }],
          documents: [chunk]
        });
        
        processed++;
        
        // Log progress every 5 chunks or at the end
        if (i % 5 === 0 || i === totalChunks - 1) {
          console.log(`Progress: ${processed}/${totalChunks} chunks processed (${Math.round(processed/totalChunks*100)}%)`);
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i}:`, chunkError);
        // Continue with next chunk instead of failing the entire process
      }
    }
    
    console.log('PDF processing complete');
    
    res.json({ 
      success: true, 
      message: 'PDF processed successfully', 
      filename: req.file.originalname,
      chunks: chunks.length,
      stored: processed
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Endpoint to get all uploaded documents
app.get('/documents', async (req, res) => {
  try {
    const collection = await chroma.getCollection('pdf_documents');
    const data = await collection.get();
    
    // Group by source document
    const documents = {};
    if (data.metadatas) {
      data.metadatas.forEach((metadata) => {
        if (!documents[metadata.source]) {
          documents[metadata.source] = {
            name: metadata.source,
            chunks: 0
          };
        }
        documents[metadata.source].chunks++;
      });
    }
    
    res.json(Object.values(documents));
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Endpoint for RAG-based chat
app.post('/rag-chat', async (req, res) => {
  const { query, model = 'gemma2', maxResults = 5 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbeddings(query);
    
    // Retrieve similar chunks from ChromaDB
    const collection = await chroma.getCollection('pdf_documents');
    const searchResults = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: maxResults
    });
    
    // Build context from retrieved chunks
    let context = '';
    if (searchResults.documents && searchResults.documents[0]) {
      context = searchResults.documents[0].join('\n\n');
    }
    
    if (!context) {
      return res.status(404).json({ error: 'No relevant documents found' });
    }
    
    // Generate response using Ollama with RAG context
    const promptWithContext = `I want you to answer questions based on the provided context only. If the answer is not in the context, say "I don't have information about that in the provided documents."
    
Context:
${context}

Question: ${query}

Answer:`;

    if (req.body.stream) {
      // Stream response
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      const chatResponse = await ollama.chat({
        model,
        messages: [{ role: 'user', content: promptWithContext }],
        stream: true
      });
      
      for await (const chunk of chatResponse) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.end();
    } else {
      // Non-streaming response
      const response = await ollama.chat({
        model,
        messages: [{ role: 'user', content: promptWithContext }]
      });
      
      res.json({ 
        response: response.message.content,
        context: {
          sources: searchResults.metadatas[0].map(m => m.source),
          count: searchResults.documents[0].length
        }
      });
    }
  } catch (error) {
    console.error('Error during RAG chat:', error);
    res.status(500).json({ error: 'RAG chat request failed', details: error.message });
  }
});

// Endpoint to get available models
app.get('/models', async (req, res) => {
  try {
    const modelList = await ollama.list();
    res.json(modelList);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Standard chat endpoint (no RAG)
app.post('/chat', async (req, res) => {
  const { model, messages, stream = false } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const chatResponse = await ollama.chat({
        model,
        messages,
        stream: true
      });

      for await (const chunk of chatResponse) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.end(); 

    } else {
      const response = await ollama.chat({
        model,
        messages
      });
      res.json({ response: response.message.content }); 
    }
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).json({ error: 'Chat request failed' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const status = {
    server: 'OK',
    ollama: 'Unknown',
    chroma: 'Unknown',
    network: {}
  };
  
  // Check Ollama connection
  const checkOllamaDirectly = async (url) => {
    try {
      const response = await fetch(`${url}/api/version`);
      if (response.ok) {
        return { ok: true, data: await response.json() };
      }
      return { ok: false, error: `HTTP ${response.status}` };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
  
  // Check both Ollama URLs
  status.network.ollama_main = await checkOllamaDirectly(ollamaUrl);
  status.network.ollama_local = await checkOllamaDirectly(ollamaLocalUrl);
  
  // Record which URL is active
  status.activeOllamaUrl = activeOllamaUrl;
  
  // Try the Ollama API
  try {
    const ollamaHealth = await ollama.list();
    status.ollama = 'OK';
    status.ollamaDetails = ollamaHealth;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    status.ollama = 'Error';
    status.ollamaError = error.message;
    
    // Try to update the URL if it's not working
    try {
      const workingUrl = await checkOllamaConnectivity();
      if (workingUrl !== activeOllamaUrl) {
        activeOllamaUrl = workingUrl;
        status.ollamaUrlUpdated = workingUrl;
        // Create a new client with the working URL
        const newOllama = new Ollama({ url: activeOllamaUrl });
        try {
          const newHealth = await newOllama.list();
          status.ollamaWithNewUrl = 'OK';
          status.ollamaDetailsWithNewUrl = newHealth;
        } catch (innerError) {
          status.ollamaWithNewUrl = 'Error';
          status.ollamaErrorWithNewUrl = innerError.message;
        }
      }
    } catch (urlError) {
      status.ollamaUrlCheckError = urlError.message;
    }
  }
  
  // Check ChromaDB connection
  try {
    const collections = await chroma.listCollections();
    status.chroma = 'OK';
    status.chromaDetails = { collections: collections.length };
  } catch (error) {
    console.error('ChromaDB health check failed:', error);
    status.chroma = 'Error';
    status.chromaError = error.message;
  }
  
  // Include environment information
  status.environment = {
    ollamaUrl,
    ollamaLocalUrl,
    chromaUrl,
    NODE_ENV: process.env.NODE_ENV
  };
  
  const mainServicesOk = ['server', 'chroma'].every(s => status[s] === 'OK');
  const ollamaOk = status.ollama === 'OK' || status.ollamaWithNewUrl === 'OK';
  const allOk = mainServicesOk && ollamaOk;
  
  res.status(allOk ? 200 : 500).json(status);
});

// Verificar conectividad antes de iniciar el servidor
async function startServer() {
  try {
    // Verificar y actualizar la URL de Ollama si es necesario
    activeOllamaUrl = await checkOllamaConnectivity();
    
    if (activeOllamaUrl !== ollamaUrl) {
      console.log(`Cambiando a URL alternativa para Ollama: ${activeOllamaUrl}`);
      // Crear un nuevo cliente con la URL que funcionó
      const newOllama = new Ollama({ url: activeOllamaUrl });
      // Reemplazar el cliente global (esto no afectará a las instancias ya creadas)
      global.ollama = newOllama;
    }
    
    // Iniciar el servidor
    const server = app.listen(port, () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
      console.log(`Environment variables:`, {
        OLLAMA_URL: activeOllamaUrl,
        CHROMA_URL: process.env.CHROMA_URL,
        PORT: process.env.PORT,
      });
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
    
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();