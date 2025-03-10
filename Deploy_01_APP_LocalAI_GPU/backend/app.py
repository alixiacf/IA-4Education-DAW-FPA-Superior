import gradio as gr
import requests
import json

# URL de Ollama en el contenedor Docker
OLLAMA_URL = "http://ollama:11434/api/generate"

# Función para enviar mensajes a Ollama
def chat_with_ollama(history, user_input):
    payload = {"model": "gemma2:latest", "prompt": user_input}
    response = requests.post(OLLAMA_URL, json=payload, stream=True)

    model_response = ""  # Respuesta acumulada

    for line in response.iter_lines():
        if line:
            try:
                json_data = json.loads(line)
                model_response += json_data.get("response", "")
            except json.JSONDecodeError:
                print("⚠️ Error al decodificar JSON en línea:", line)

    # Agregar la interacción al historial
    history.append((user_input, model_response))

    return history, ""

# Configuración de la interfaz en Gradio
with gr.Blocks() as demo:
    gr.Markdown("# 🤖 Chat con Ollama (Gemma2)")
    
    chat_history = gr.State([])  # Guarda el historial de mensajes
    
    chatbot = gr.Chatbot()
    user_input = gr.Textbox(label="Escribe tu mensaje:")
    
    send_button = gr.Button("Enviar")
    
    send_button.click(chat_with_ollama, inputs=[chat_history, user_input], outputs=[chatbot, user_input])

# Ejecutar la interfaz web
demo.launch(server_name="0.0.0.0", server_port=7860)
