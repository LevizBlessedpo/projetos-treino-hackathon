<div align="center">

# 🚨 Emergency IA (SOSIA)

**Plataforma web de assistência inteligente em situações de emergência.**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Design-blue?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Interatividade-yellow?style=for-the-badge&logo=javascript&logoColor=black)
![Groq](https://img.shields.io/badge/Groq-IA-black?style=for-the-badge&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Mapas-green?style=for-the-badge&logo=leaflet&logoColor=white)

---

</div>

## Sobre o Projeto

O **Emergency IA (SOSIA)** é uma plataforma web desenvolvida para auxiliar pessoas em situações de emergência.

O sistema utiliza **Python, FastAPI, HTML, CSS e JavaScript**, oferecendo uma interface moderna, responsiva e acessível.

A aplicação recebe a descrição de uma situação de emergência, envia para uma **IA de triagem**, e devolve o nível de urgência junto com orientações gerais e seguras — sem jamais substituir o atendimento médico profissional.

---

## Objetivo

O projeto tem como objetivo utilizar a tecnologia como ferramenta de apoio em momentos críticos.

A plataforma busca:

- Classificar rapidamente o nível de urgência de uma situação.
- Orientar o usuário com recomendações seguras e objetivas.
- Indicar o serviço de emergência adequado (SAMU, Bombeiros, Polícia).
- Compartilhar a localização do usuário.
- Permitir avisar um contato de emergência.
- Manter um histórico das situações relatadas.
- Priorizar simplicidade e velocidade no momento de crise.

---

## Funcionalidades

### Chat de Triagem
- Campo de descrição da emergência.
- Análise automática via IA.
- Classificação de urgência (Crítico, Moderado, Normal).
- Categoria da situação.
- Mensagem de orientação segura.

### Localização
- Captura da localização via Geolocation API.
- Exibição em mapa interativo.
- Compartilhamento da posição do usuário.

### Contatos de Emergência
- Cadastro de contatos via `localStorage`.
- Aviso rápido a um contato cadastrado.

### Histórico
- Registro das situações relatadas via `localStorage`.
- Consulta de atendimentos anteriores.

---

## Tecnologias Utilizadas

### Backend
- **Python**
- **FastAPI**
- **REST API**
- **Groq API** (IA de triagem)

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript**
- **Leaflet.js**

> ℹ️ Sem banco de dados SQL no MVP — persistência via `localStorage` do navegador.

---

## Estrutura do Projeto

```text
emergency-ia/
│
├── back-end/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
└── front-end/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Como Executar

### Backend

```bash
cd back-end
source venv/bin/activate
uvicorn main:app --reload
```

API disponível em `http://localhost:8000` · Documentação em `http://localhost:8000/docs`

### Frontend

Abra a pasta `front-end/` com o **Live Server** (porta `5500`).

---

## Rota da API

### `POST /analisar`

**Requisição:**
```json
{
  "texto": "Meu pai caiu no banheiro e não está respondendo"
}
```

**Resposta:**
```json
{
  "resultado": "NIVEL: CRITICO\nCATEGORIA: ...\nMENSAGEM: ..."
}
```

---

## Aviso Importante

> ⚠️ A IA **não diagnostica doenças** nem substitui atendimento médico profissional.
> Em emergência real, ligue **SAMU (192)** · **Bombeiros (193)** · **Polícia (190)**.