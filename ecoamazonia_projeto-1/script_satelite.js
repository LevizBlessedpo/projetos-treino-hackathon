const API_URL = 'http://localhost:5000/api/focos';
const API_DENUNCIA_URL = 'http://localhost:5000/api/denuncia';
let meuGrafico = null;

// Renderização segura acoplada ao escopo global (window)
function renderizarGrafico(dadosSemanais) {
    const canvas = document.getElementById('graficoFocos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (meuGrafico) {
        meuGrafico.destroy();
    }

    // Instanciação explícita para evitar falhas de carregamento em ambientes Live Share
    meuGrafico = new window.Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Focos diários',
                data: dadosSemanais,
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                borderWidth: 3,
                tension: 0.35, 
                fill: true,
                pointBackgroundColor: '#d32f2f',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false },
                x: { grid: { display: false } }
            }
        }
    });
}

async function atualizarPainelSatelite() {
    const contadorTotal = document.getElementById('contadorTotal');
    const statusStatus = document.getElementById('statusStatus');
    const listaEstadosGeral = document.getElementById('listaEstadosGeral');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro de conexão");
        const dados = await response.json();

        // 1. Atualiza Dados Principais
        if (contadorTotal) contadorTotal.innerText = dados.total_amazonia.toLocaleString('pt-BR');
        if (statusStatus) {
            statusStatus.innerText = `Satélite: ${dados.status_satelite} | Atualizado: ${dados.ultima_atualizacao}`;
            statusStatus.style.color = "#888";
        }

        // 2. Constrói Lista de Estados
        if (listaEstadosGeral) {
            listaEstadosGeral.innerHTML = "";
            dados.estados.forEach(item => {
                const li = document.createElement('li');

                // Alerta visual para risco Crítico
                if (item.risco.toLowerCase() === 'crítico') {
                    li.classList.add('card-estado-critico');
                }

                li.innerHTML = `
                    <span><strong>${item.estado}</strong></span>
                    <span>${item.focos} focos — <span class="risco-${item.risco.toLowerCase()}">${item.risco}</span></span>
                `;
                listaEstadosGeral.appendChild(li);
            });
        }

        // 3. Monta o Gráfico
        renderizarGrafico(dados.historico_semanal);

    } catch (error) {
        console.error("Erro na API:", error);
        if (contadorTotal) contadorTotal.innerText = "⚠️ Erro";
        if (statusStatus) {
            statusStatus.innerText = "Não foi possível conectar ao servidor Python.";
            statusStatus.style.color = "#d32f2f";
        }
        if (listaEstadosGeral) {
            listaEstadosGeral.innerHTML = `
                <li style="grid-column: span 2; color: #d32f2f; text-align: center; justify-content: center; background: #ffebee;">
                    Erro de conexão: Certifique-se de que o main.py está ativo na porta 5000 e compartilhada no Live Share.
                </li>
            `;
        }
    }
}

// Escuta automática de carregamento
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contadorTotal')) {
        atualizarPainelSatelite();
    }
});

// Ação Manual de Atualização
const btnAtualizar = document.getElementById('btnAtualizar');
if (btnAtualizar) {
    btnAtualizar.addEventListener('click', () => {
        const textoOriginal = btnAtualizar.innerHTML;
        btnAtualizar.innerHTML = "🔄 Buscando...";
        btnAtualizar.disabled = true;

        atualizarPainelSatelite().finally(() => {
            btnAtualizar.innerHTML = textoOriginal;
            btnAtualizar.disabled = false;
        });
    });
}

// ===== INTEGRAÇÃO: FORMULÁRIO DE DENÚNCIA DE QUEIMADAS =====
const formDenuncia = document.getElementById('form-denuncia');

if (formDenuncia) {
    const btnDenuncia = document.getElementById('btn-denuncia');
    const feedbackEl = document.getElementById('feedback-denuncia');

    formDenuncia.addEventListener('submit', async (event) => {
        event.preventDefault();

        const localizacao = document.getElementById('localizacao').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if (!localizacao || !descricao) {
            exibirFeedback(feedbackEl, 'erro', 'Preencha todos os campos antes de enviar.');
            return;
        }

        const textoOriginalBtn = btnDenuncia.innerHTML;
        btnDenuncia.disabled = true;
        btnDenuncia.innerHTML = 'Enviando...';
        esconderFeedback(feedbackEl);

        try {
            const response = await fetch(API_DENUNCIA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ localizacao, descricao })
            });

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados.erro || 'Erro ao enviar a denúncia.');
            }

            exibirFeedback(feedbackEl, 'sucesso', 'Denúncia registrada com sucesso!');
            formDenuncia.reset();

        } catch (error) {
            exibirFeedback(feedbackEl, 'erro', `Erro ao enviar: ${error.message}`);
        } finally {
            btnDenuncia.disabled = false;
            btnDenuncia.innerHTML = textoOriginalBtn;
        }
    });
}

function exibirFeedback(el, tipo, mensagem) {
    el.textContent = mensagem;
    el.className = `feedback-msg ${tipo}`;
    el.style.display = 'block';
    setTimeout(() => esconderFeedback(el), 5000);
}

function esconderFeedback(el) {
    el.style.display = 'none';
}