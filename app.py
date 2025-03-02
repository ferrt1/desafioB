from flask import Flask, request, jsonify, render_template
import requests
import os
from flask_cors import CORS
# from dotenv import load_dotenv

# Cargar variables de entorno desde .env
# load_dotenv()

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = "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"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/consultar_ia", methods=["POST"])
def consultar_ia():
    data = request.json
    pregunta = data.get("pregunta", "")

    if not pregunta:
        return jsonify({"error": "No se proporcionó una pregunta"}), 400

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://desafio-b.vercel.app/",  
        "X-Title": "MiAplicacionBlockly"  
    }

    payload = {
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [{"role": "user", "content": pregunta}]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Error al consultar la IA", "detalle": response.text}), response.status_code
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))

