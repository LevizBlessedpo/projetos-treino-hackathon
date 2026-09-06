// ===== FOLHAS CAINDO NO FUNDO (DECORATIVO) =====
function criarFolhas(quantidade = 20) {
    const container = document.getElementById('folhasContainer');
    if (!container) return;

    const cores = ['#8d6e63', '#d84315', '#f9a825', '#558b2f', '#e65100', '#33691e'];

    for (let i = 0; i < quantidade; i++) {
        const folha = document.createElement('div');
        folha.classList.add('folha');

        const tamanho = Math.random() * 12 + 10;     // entre 10px e 22px
        const posicaoInicial = Math.random() * 100;  // 0% a 100% da largura da tela
        const duracao = Math.random() * 8 + 8;       // entre 8s e 16s por queda
        const atraso = Math.random() * 12;           // começa em momentos diferentes
        const cor = cores[Math.floor(Math.random() * cores.length)];

        folha.style.width = `${tamanho}px`;
        folha.style.height = `${tamanho}px`;
        folha.style.left = `${posicaoInicial}%`;
        folha.style.backgroundColor = cor;
        folha.style.animationDuration = `${duracao}s`;
        folha.style.animationDelay = `${atraso}s`;

        container.appendChild(folha);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    criarFolhas(25); 
});

//Config para deixar o site em light mode & dark mode
const TemaSite= document.getElementById('btnTema');

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        btnTema.textContent = '🌙 Modo Escuro';
        btnTema.style.backgroundColor = '#2c3b32';
        btnTema.style.color = '#fff';
    } else {
        btnTema.textContent = '🌿 Modo Natureza';
        btnTema.style.backgroundColor = '#fff';
        btnTema.style.color = '#000';
    }
});

// Dados do site de desmatamento do Brasil Escola
const dadosProdes = [
    { ano: '1991', taxa: 11030 }, { ano: '1992', taxa: 13786 }, { ano: '1993', taxa: 14896 },
    { ano: '1994', taxa: 14896 }, { ano: '1995', taxa: 29059 }, { ano: '1996', taxa: 18161 },
    { ano: '1997', taxa: 13227 }, { ano: '1998', taxa: 17383 }, { ano: '1999', taxa: 17259 },
    { ano: '2000', taxa: 18226 }, { ano: '2001', taxa: 18165 }, { ano: '2002', taxa: 21650 },
    { ano: '2003', taxa: 25396 }, { ano: '2004', taxa: 27772 }, { ano: '2005', taxa: 19014 },
    { ano: '2006', taxa: 14286 }, { ano: '2007', taxa: 11651 }, { ano: '2008', taxa: 12911 },
    { ano: '2009', taxa: 7464 },  { ano: '2010', taxa: 7000 },  { ano: '2011', taxa: 6418 },
    { ano: '2012', taxa: 4571 },  { ano: '2013', taxa: 5891 },  { ano: '2014', taxa: 5012 },
    { ano: '2015', taxa: 6207 },  { ano: '2016', taxa: 7893 },  { ano: '2017', taxa: 6947 },
    { ano: '2018', taxa: 7536 },  { ano: '2019', taxa: 10129 }, { ano: '2020', taxa: 11088 },
    { ano: '2021', taxa: 13038 }
];

const anos = dadosProdes.map(item => item.ano);
const taxas = dadosProdes.map(item => item.taxa);


const ctx = document.getElementById('Grafico1').getContext('2d');
const button = document.querySelector('.botao');

const meuGrafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: anos,
        datasets: [{
            label: 'Taxa de Desmatamento (km²)',
            data: taxas,
            backgroundColor: dadosProdes.map(item => item.taxa > 27000 ? '#D32F2F' : '#4CAF50'),
            borderColor: '#388E3C',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    generateLabels: () => [
                        { text: 'Desmatamento (km²)', fillStyle: '#4CAF50', strokeStyle: '#388E3C' },
                        { text: 'Picos (acima de 27.000 km²)', fillStyle: '#D32F2F', strokeStyle: '#C1121F' }
                    ]
                }
            }
        },
        scales: {
            y: { beginAtZero: true, max: 30000 },
            x: {}
        }
    }
});
