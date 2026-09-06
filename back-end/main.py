from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from datetime import datetime
import sqlite3
import random
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'denuncias.db')


# ===== BANCO DE DADOS (SQLITE) =====
def conectar_bd():
    conexao = sqlite3.connect(DB_PATH)
    conexao.row_factory = sqlite3.Row 
    return conexao


def inicializar_bd():
    conexao = conectar_bd()
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS denuncias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            localizacao TEXT NOT NULL,
            descricao TEXT NOT NULL,
            data_registro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
    ''')
    conexao.commit()
    conexao.close()



ESTADOS_AMAZONIA_LEGAL = [
    {"estado": "Amazonas", "base_focos": 320, "risco": "Crítico"},
    {"estado": "Pará", "base_focos": 280, "risco": "Alto"},
    {"estado": "Mato Grosso", "base_focos": 150, "risco": "Alto"},
    {"estado": "Rondônia", "base_focos": 90, "risco": "Médio"},
    {"estado": "Acre", "base_focos": 40, "risco": "Moderado"},
    {"estado": "Roraima", "base_focos": 60, "risco": "Médio"},
    {"estado": "Maranhão", "base_focos": 30, "risco": "Moderado"},
    {"estado": "Tocantins", "base_focos": 25, "risco": "Moderado"},
]



@app.route('/api/focos', methods=['GET'])
@cross_origin()
def obter_focos():
    estados_dados = []
    total = 0

    for item in ESTADOS_AMAZONIA_LEGAL:
        variacao = random.randint(-15, 15)
        focos = max(0, item["base_focos"] + variacao)
        total += focos
        estados_dados.append({
            "estado": item["estado"],
            "focos": focos,
            "risco": item["risco"]
        })

    historico_semanal = [random.randint(700, 1100) for _ in range(7)]

    resposta = {
        "total_amazonia": total,
        "status_satelite": "Online",
        "ultima_atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "estados": estados_dados,
        "historico_semanal": historico_semanal
    }

    return jsonify(resposta), 200


# ===== ROTA: REGISTRAR DENÚNCIA (agora grava no SQLite) =====
@app.route('/api/denuncia', methods=['POST'])
@cross_origin()
def registrar_denuncia():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Nenhum dado recebido no corpo da requisição."}), 400

    localizacao = str(dados.get('localizacao', '')).strip()
    descricao = str(dados.get('descricao', '')).strip()

    if not localizacao or not descricao:
        return jsonify({"erro": "Os campos 'localizacao' e 'descricao' são obrigatórios."}), 400

    conexao = conectar_bd()
    cursor = conexao.execute(
        'INSERT INTO denuncias (localizacao, descricao) VALUES (?, ?)',
        (localizacao, descricao)
    )
    conexao.commit()
    novo_id = cursor.lastrowid

    linha = conexao.execute('SELECT * FROM denuncias WHERE id = ?', (novo_id,)).fetchone()
    conexao.close()

    nova_denuncia = dict(linha)

    return jsonify({
        "mensagem": "Denúncia registrada com sucesso!",
        "denuncia": nova_denuncia
    }), 201



@app.route('/api/denuncias', methods=['GET'])
@cross_origin()
def listar_denuncias():
    conexao = conectar_bd()
    linhas = conexao.execute('SELECT * FROM denuncias ORDER BY id DESC').fetchall()
    conexao.close()

    denuncias = [dict(linha) for linha in linhas]
    return jsonify(denuncias), 200


if __name__ == '__main__':
    inicializar_bd()  
    app.run(debug=True, port=5000)