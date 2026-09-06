import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI(title="Emergency IA", description="API for Emergency IA", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],  # Porta do Live Server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class EmergenciaRequest(BaseModel):
    texto: str

@app.get("/")
async def root():
    return {"Status": "Emergency Ia está rodando!"}

@app.post("/analisar")
async def analisar_emergencia(dados: EmergenciaRequest):
    resposta = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "Você é AurIA, assistente de triagem de emergências. Não diagnostica doenças. Responda em 3 linhas exatamente neste formato:\nNIVEL: CRITICO ou MODERADO ou NORMAL\nCATEGORIA: (tipo de situação, poucas palavras)\nMENSAGEM: (orientação segura e objetiva, indicando SAMU 192 / Bombeiros 193 / Polícia 190 se necessário)"
            },
            {
                "role": "user",
                "content": dados.texto
            }
        ],
    )

    texto_resposta = resposta.choices[0].message.content
    return {"resultado": texto_resposta}

    #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



