// mapeando elementos do HTML
const botaoEnviar = document.querySelector('.chatEntrada button');
const textarea = document.querySelector('.chatEntrada textarea');
const formulario = document.querySelector('form');
const respostaIA = document.querySelector('#sintomas');

// Cria a área invisível do HTML para os balões do chat aparecerem antes do formulário
const ContainerChat = document.createElement('div');
ContainerChat.id = 'chatContainer';
formulario.parentNode.insertBefore(ContainerChat, formulario);

// Endereço oficial da API do Python
const API_URL = 'http://localhost:8000/analisar';

// FUNÇÃO PARA CRIAR OS BALÕES DE CONVERSA NA TELA
function mostrarMensagem(remetente, texto, nivel = 'normal') {
    const balao = document.createElement('div');
    
    // Definição da classe base se a mensagem é do usuário ou da IA
    balao.className = `balao-msg ${remetente} ${nivel}`;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;

    balao.appendChild(paragrafo);
    ContainerChat.appendChild(balao);

    // A cada nova mensagem a tela desce automaticamente
    ContainerChat.scrollTop = ContainerChat.scrollHeight;
}

// função para trocar informações com o python
async function enviarParaIA() {
    const relato = textarea.value.trim();
    if (!relato) {
        alert('Digite uma descrição antes de enviar.');
        return; 
    }
    
    // Mostra o que o usuário digitou na tela e limpa o campo
    mostrarMensagem('usuario', relato);
    textarea.value = '';
    botaoEnviar.disabled = true; // Desativa o botão para evitar cliques duplos

    // Balão temporário para carregamento
    mostrarMensagem('ia', '🤖 Processando sintomas com a AurIA...', 'normal');

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: relato }) // Envia como { texto: "..." } igual à rota do seu amigo
        });

        if (!resposta.ok) {
            throw new Error('Erro na requisição: ' + resposta.status);
            respostaIA.textContent = dadosIA.resultado;
        }

        const dadosIA = await resposta.json();
        console.log('Resposta da API:', dadosIA); // TEMPORÁRIO - só pra debug


        const match = dadosIA.resultado.match(/NIVEL:\s*(CRITICO|MODERADO|NORMAL)/i);
        const nivel = match ? match[1].toUpperCase() : 'NORMAL';



        // Remove o balão temporário de "processar"
        ContainerChat.lastChild.remove();

        // Mostra a resposta real do Python com a cor equivalente do nível
        // CORRIGIDO: mudado dadosIA.reposta para dadosIA.resultado conforme especificado no retorno do backend
         mostrarMensagem('ia', dadosIA.resultado, nivel);

    } catch (error) {
        // Remove o balão de carregamento e mostra uma mensagem de erro caso dê errado
        if (ContainerChat.lastChild) ContainerChat.lastChild.remove();
        mostrarMensagem('ia', '❌ Erro ao conectar com o servidor. Verifique a sua conexão e se o backend Python está rodando.', 'normal');
        console.error('Erro na requisição: ', error);
    } finally {
        botaoEnviar.disabled = false; // Reativa o botão
    }
}

// Impede o formulário de dar refresh na página se o usuário apertar Enter
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarParaIA();
});
