document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const modelSelector = document.getElementById('modelSelector');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const uploadButton = document.getElementById('uploadButton');
    const pdfFileInput = document.getElementById('pdfFileInput');
    const documentsList = document.getElementById('documentsList');

    // API endpoints
    // In Docker environment, backend service is accessible via service name
    const API_URL = '/api';  // We'll proxy through Nginx
    const MODELS_ENDPOINT = `${API_URL}/models`;
    const UPLOAD_PDF_ENDPOINT = `${API_URL}/upload-pdf`;
    const RAG_CHAT_ENDPOINT = `${API_URL}/rag-chat`;
    const DOCUMENTS_ENDPOINT = `${API_URL}/documents`;

    // State
    let selectedModel = '';
    let currentBotMessageElement = null;
    let hasDocuments = false;

    // Initialize the application
    init();

    function init() {
        fetchModels();
        fetchDocuments();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Model selection
        modelSelector.addEventListener('change', (e) => {
            selectedModel = e.target.value;
        });

        // Send message
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // PDF upload
        uploadButton.addEventListener('click', () => {
            pdfFileInput.click();
        });

        pdfFileInput.addEventListener('change', uploadPDF);
    }

    // Fetch available models with retry logic
    async function fetchModels(retryCount = 0, maxRetries = 5) {
        try {
            console.log(`Attempting to fetch models (attempt ${retryCount + 1}/${maxRetries + 1})...`);
            const response = await fetch(MODELS_ENDPOINT);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.models && Array.isArray(data.models)) {
                modelSelector.innerHTML = '';
                data.models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = model.name;
                    modelSelector.appendChild(option);
                });
                
                if (data.models.length > 0) {
                    selectedModel = data.models[0].name;
                    modelSelector.value = selectedModel;
                    console.log(`Models loaded successfully. Selected model: ${selectedModel}`);
                    addSystemMessage(`Connected successfully. Available models: ${data.models.map(m => m.name).join(', ')}`);
                } else {
                    console.warn('No models returned from API');
                    addSystemMessage(`
                        <div style="color: #d9534f;">
                            <strong>No hay modelos disponibles en Ollama</strong>
                            <br><br>
                            Para usar la aplicación, necesitas descargar un modelo en Ollama.
                            <br><br>
                            <ol>
                                <li>Abre una terminal en el directorio del proyecto</li>
                                <li>Ejecuta: <code>./download-model.sh</code></li>
                                <li>Selecciona un modelo para descargar (recomendamos "llama2" o "gemma:2b")</li>
                                <li>Espera a que se complete la descarga</li>
                                <li>Recarga esta página</li>
                            </ol>
                            <p>Si tienes problemas, consulta la documentación en el archivo README.md.</p>
                        </div>
                    `);
                }
            } else {
                throw new Error('Unexpected format for models data');
            }
        } catch (error) {
            console.error('Error fetching models:', error);
            
            if (retryCount < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff up to 10 seconds
                addSystemMessage(`Connection to server failed. Retrying in ${delay/1000} seconds...`);
                
                setTimeout(() => {
                    fetchModels(retryCount + 1, maxRetries);
                }, delay);
            } else {
                addSystemMessage(`
                    Unable to connect to the server after multiple attempts.<br>
                    1. Check if all Docker containers are running<br>
                    2. Try accessing the API directly at: <a href="/api/health" target="_blank">/api/health</a><br>
                    3. Check backend logs with: docker logs backend
                `);
            }
        }
    }

    // Fetch uploaded documents
    async function fetchDocuments() {
        try {
            const response = await fetch(DOCUMENTS_ENDPOINT);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const documents = await response.json();
            
            documentsList.innerHTML = '';
            
            if (documents.length === 0) {
                documentsList.innerHTML = '<p>No documents uploaded yet. Upload a PDF to get started.</p>';
                hasDocuments = false;
            } else {
                documents.forEach(doc => {
                    const docElement = document.createElement('div');
                    docElement.className = 'document-item';
                    docElement.innerHTML = `
                        <div>${doc.name}</div>
                        <div>${doc.chunks} chunks</div>
                    `;
                    documentsList.appendChild(docElement);
                });
                hasDocuments = true;
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            documentsList.innerHTML = '<p>Error loading documents. Please try again later.</p>';
        }
    }

    // Upload PDF with improved error handling
    async function uploadPDF(event) {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        if (file.type !== 'application/pdf') {
            addSystemMessage('Please upload a PDF file.');
            return;
        }

        // Create a status message
        const statusElement = document.createElement('div');
        statusElement.className = 'message system-message';
        statusElement.innerHTML = `
            <div>Uploading and processing ${file.name}...</div>
            <div class="loading-indicator"></div>
        `;
        chatMessages.appendChild(statusElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Create form data
        const formData = new FormData();
        formData.append('pdf', file);

        // Display file info
        console.log(`Uploading file: ${file.name}, Size: ${(file.size/1024).toFixed(2)} KB, Type: ${file.type}`);
        
        // Function to check connection before upload
        const checkConnection = async () => {
            try {
                const healthResponse = await fetch(`${API_URL}/health`);
                if (!healthResponse.ok) throw new Error("Backend health check failed");
                return true;
            } catch (error) {
                console.error("Backend connection check failed:", error);
                return false;
            }
        };

        try {
            // Check connection first
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error("Cannot connect to backend server. Is it running?");
            }
            
            console.log("Sending upload request to:", UPLOAD_PDF_ENDPOINT);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(UPLOAD_PDF_ENDPOINT, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error as JSON, use the status text
                    errorMessage = `${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Update status message
            statusElement.innerHTML = `
                <div>✅ Successfully processed ${data.filename}</div>
                <div>Created ${data.chunks} chunks for RAG</div>
            `;
            
            // Refresh document list
            fetchDocuments();
            
        } catch (error) {
            console.error('Error uploading PDF:', error);
            
            let errorMessage = error.message;
            
            // Provide more helpful error messages based on error types
            if (error.name === 'AbortError') {
                errorMessage = 'Upload timed out. The file might be too large or the server is not responding.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = `Network error: Cannot connect to the server at ${UPLOAD_PDF_ENDPOINT}.
                    <br>Check that:
                    <br>1. All Docker containers are running (docker ps)
                    <br>2. Backend is accessible (try /api/health endpoint)
                    <br>3. Server logs show no errors (docker logs backend)`;
            }
            
            statusElement.innerHTML = `❌ Error: ${errorMessage}`;
        }

        // Clear the file input
        event.target.value = '';
    }

    // Send message and get response
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Check if we have documents for RAG
        if (!hasDocuments) {
            addSystemMessage('Please upload a PDF document first to use the RAG capabilities.');
            return;
        }

        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';

        // Create a new bot message element for the response
        currentBotMessageElement = createMessageElement('bot');
        currentBotMessageElement.innerHTML = '<div class="loading-indicator"></div>';
        chatMessages.appendChild(currentBotMessageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(RAG_CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: message,
                    model: selectedModel,
                    stream: false,
                    maxResults: 5
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Format the response with source citations
            let formattedResponse = data.response;
            
            // Add source citations if available
            if (data.context && data.context.sources) {
                formattedResponse += '<div class="message-metadata">';
                formattedResponse += `Sources: ${data.context.sources.join(', ')}`;
                formattedResponse += '</div>';
            }
            
            updateMessageContent(currentBotMessageElement, formattedResponse);
        } catch (error) {
            console.error('Error during RAG chat:', error);
            updateMessageContent(currentBotMessageElement, `Sorry, there was an error: ${error.message}`, false);
        }
    }

    // Helper functions
    function createMessageElement(role) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${role}-message`);
        return messageElement;
    }

    function updateMessageContent(messageElement, content, format = true) {
        if (format) {
            const formattedContent = formatMessage(content);
            messageElement.innerHTML = formattedContent;
        } else {
            messageElement.textContent = DOMPurify.sanitize(content);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addMessageToChat(role, content, format = true) {
        const messageElement = createMessageElement(role);
        updateMessageContent(messageElement, content, format);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addSystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message system-message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatMessage(content) {
        // Format code blocks
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let formattedContent = content.replace(codeBlockRegex, (match, language, code) => {
            language = language || 'plaintext';
            const highlightedCode = hljs ? hljs.highlight(code.trim(), { language: language }).value : code;
            const escapedCode = DOMPurify.sanitize(highlightedCode);
            return `<pre><div class="code-header"><span class="code-language">${language}</span><button class="copy-button">Copy</button></div><code class="hljs ${language}">${escapedCode}</code></pre>`;
        });

        // Format inline code
        formattedContent = formattedContent.replace(/`([^`\n]+)`/g, '<code>$1</code>');

        // Use marked for the rest of the content
        formattedContent = DOMPurify.sanitize(marked.parse(formattedContent));

        return formattedContent;
    }

    // Add event delegation for copy buttons
    chatMessages.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-button')) {
            const codeElement = e.target.closest('pre').querySelector('code');
            const codeText = codeElement.textContent;

            navigator.clipboard.writeText(codeText)
                .then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy code: ', err);
                });
        }
    });
});