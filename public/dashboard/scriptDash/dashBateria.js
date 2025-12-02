// variável para destruir e recriar os gráficos
let chartVelocidadeConsumo = null;
let chartSaudeComputador = null;
let chartCargaTemperatura = null;
let chartDistribuicaoTemperatura = null;

// select da data passando o periodo desejado como parametro
function gerarListaDeDatas(periodo) {
    const listaDeDatas = [];
    const hoje = new Date();
    let diasParaSubtrair;

    switch (periodo) {
        case 'semana':
            diasParaSubtrair = 7;
            break;
        case 'mes':
            diasParaSubtrair = 30;
            break;
        case 'ano':
            diasParaSubtrair = 365;
            break;
        default:
            diasParaSubtrair = 7;
    }

    for (let i = 0; i < diasParaSubtrair; i++) {
        const dataAtual = new Date(hoje);
        dataAtual.setDate(hoje.getDate() - i); // Subtrai o dia

        // Formata YYYYMMDD (0 preenche o mês e o dia se necessário)
        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');

        listaDeDatas.push(`${ano}${mes}${dia}`);
    }

    return listaDeDatas;
}

// --- FUNÇÃO DE RENDERIZAÇÃO DE GRÁFICOS ---
function renderizarGraficos(dados) {
    // Destruir instâncias antigas antes de criar as novas
    if (chartVelocidadeConsumo) chartVelocidadeConsumo.destroy();
    if (chartSaudeComputador) chartSaudeComputador.destroy();
    if (chartCargaTemperatura) chartCargaTemperatura.destroy();
    if (chartDistribuicaoTemperatura) chartDistribuicaoTemperatura.destroy();

    if (!dados || dados.labelsModelos.length === 0) {
        console.log("Não há dados para renderizar os gráficos.");
        return;
    }

    // Gráfico 1: Velocidade x Consumo
    const ctx1 = document.getElementById('velocidadeConsumo').getContext('2d');
    chartVelocidadeConsumo = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: dados.labelsModelos,
            datasets: [
                {
                    label: 'Velocidade Média (Km/h)',
                    data: dados.dataVelocidade,
                    borderColor: '#22c55e',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'Consumo Médio',
                    data: dados.dataConsumo,
                    borderColor: '#ef4444',
                    fill: false,
                    tension: 0.3,
                }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
    });

    // Gráfico 2: Saúde da Bateria
    const ctx2 = document.getElementById('saudeComputador').getContext('2d');
    chartSaudeComputador = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: dados.labelsModelos,
            datasets: [{
                label: 'Saúde da Bateria (%)',
                data: dados.dataSaude,
                backgroundColor: '#1e3a8a',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });

    // Gráfico 3: Carga x Temperatura
    const ctx3 = document.getElementById('cargaTemperatura').getContext('2d');
    chartCargaTemperatura = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: dados.labelsModelos,
            datasets: [
                {
                    label: 'Capacidade de kWh (%)',
                    data: dados.dataCarga,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y1'
                },
                {
                    label: 'Temp Média (°C)',
                    data: dados.dataTempMedia,
                    borderColor: '#be123c',
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y1: { type: 'linear', position: 'left' },
                y2: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } }
            }
        }
    });

    // Gráfico 4: Distribuição de Temperatura
    const ctx4 = document.getElementById('distribuicaoTemperatura').getContext('2d');
    chartDistribuicaoTemperatura = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: ['10-15°C', '16-20°C', '21-25°C', '26-30°C', '31-35°C', '36-40°C', '41-45°C', '46-50°C', '51+°C'],
            datasets: [
                {
                    label: 'Ocorrências',
                    data: dados.faixasTemp,
                    backgroundColor: '#0ea5e9',
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    order: 2
                },
                {
                    type: 'line',
                    label: 'Tendência',
                    data: dados.faixasTemp,
                    borderColor: 'red',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                        offset: false
                    }
                }
            }
        }
    });
}

// --- FUNÇÃO PRINCIPAL: CARREGAR DADOS E ATUALIZAR DASHBOARD ---
async function atualizarDashboard(periodoSelecionado) {
    const listaDeDatas = gerarListaDeDatas(periodoSelecionado);
    console.log(`Buscando dados para o período: ${periodoSelecionado}. Datas:`, listaDeDatas);

    async function carregarDados() {
        try {
            const URL_BASE = "https://bucket-navix-client.s3.us-east-1.amazonaws.com/dashBateria/";

            // 1. Gerar todas as URLs de todos os arquivos
            const urlsDashboard = listaDeDatas.map(data =>
                `${URL_BASE}dashboard_bateria_${data}.csv`
            );
            const urlsHistorico = listaDeDatas.map(data =>
                `${URL_BASE}historico_leituras_${data}.csv`
            );

            // 2. Disparar todas as requisições em paralelo
            const todasAsUrls = [...urlsDashboard, ...urlsHistorico];
            const responses = await Promise.all(todasAsUrls.map(url => fetch(url)));

            // 3. Checar e extrair os textos
            const falhas = responses.filter(resp => !resp.ok);
            if (falhas.length > 0) {
                console.warn(`Atenção: ${falhas.length} arquivos não puderam ser carregados. URLs falhas:`, falhas.map(f => f.url));
            }
            const texts = await Promise.all(responses.map(resp => resp.text()));

            // 4. Separar, fazer o parsing e COMBINAR os dados
            const textosDash = texts.slice(0, urlsDashboard.length);
            const textosHist = texts.slice(urlsDashboard.length);

            let dadosDash = [];
            let dadosHist = [];

            textosDash.forEach(text => {
                if (text.length > 0 && text.toLowerCase().includes('modelo')) {
                    const parsed = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
                    dadosDash.push(...parsed.filter(d => d.Modelo));
                }
            });

            textosHist.forEach(text => {
                if (text.length > 0 && text.toLowerCase().includes('modelo')) {
                    const parsed = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
                    dadosHist.push(...parsed.filter(d => d.Modelo));
                }
            });

            if (dadosDash.length === 0 && dadosHist.length === 0) {
                console.warn("Nenhum dado válido foi carregado dos CSVs para este período.");
                return null;
            }

            // --- PROCESSAMENTO DOS DADOS COMBINADOS ---

            // A. Agrupamento Histórico (para Velocidade e Consumo e Temperatura Dist.)
            const agrupadoHist = {};
            const faixasTemp = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            dadosHist.forEach(d => {
                if (!d.Modelo) return;
                // Agrupamento
                if (!agrupadoHist[d.Modelo]) agrupadoHist[d.Modelo] = { somaVel: 0, somaCons: 0, count: 0 };
                agrupadoHist[d.Modelo].somaVel += d.velocidadeEstimada || 0;
                agrupadoHist[d.Modelo].somaCons += d.consumoEnergia || 0;
                agrupadoHist[d.Modelo].count++;

                // Distribuição de Temperatura
                const t = Number(d.TEMP);

                if (t >= 10 && t <= 20) faixasTemp[0]++;
                else if (t > 20 && t <= 30) faixasTemp[1]++;
                else if (t > 30 && t <= 40) faixasTemp[2]++;
                else if (t > 40 && t <= 50) faixasTemp[3]++;
                else if (t > 50 && t <= 60) faixasTemp[4]++;
                else if (t > 60 && t <= 70) faixasTemp[5]++;
                else if (t > 70) faixasTemp[6]++;
            });

            // C. Agrupamento Dashboard (para KPIs e gráficos de Média)
            const agrupadoDash = {};
            dadosDash.forEach(d => {
                if (!d.Modelo) return;
                if (!agrupadoDash[d.Modelo]) agrupadoDash[d.Modelo] = { somaSaude: 0, somaCarga: 0, somaTemp: 0, count: 0 };
                agrupadoDash[d.Modelo].somaSaude += d.Media_Saude || 0;
                agrupadoDash[d.Modelo].somaCarga += d.Media_Carga || 0;
                agrupadoDash[d.Modelo].somaTemp += d.Media_Temperatura || 0;
                agrupadoDash[d.Modelo].count++;
            });

            const labelsModelos = Object.keys(agrupadoDash);

            // Cálculo das Médias Finais por Modelo (para os gráficos)
            const dataSaude = labelsModelos.map(m => (agrupadoDash[m].somaSaude / agrupadoDash[m].count).toFixed(0));
            const dataCarga = labelsModelos.map(m => (agrupadoDash[m].somaCarga / agrupadoDash[m].count).toFixed(0));
            const dataTempMedia = labelsModelos.map(m => (agrupadoDash[m].somaTemp / agrupadoDash[m].count).toFixed(0));

            const dataVelocidade = labelsModelos.map(m =>
                agrupadoHist[m] ? (agrupadoHist[m].somaVel / agrupadoHist[m].count).toFixed(2) : 0
            );
            const dataConsumo = labelsModelos.map(m =>
                agrupadoHist[m] ? (agrupadoHist[m].somaCons / agrupadoHist[m].count).toFixed(2) : 0
            );

            return {
                dadosDash, // Mantido para a lógica de Alertas
                labelsModelos, dataVelocidade, dataConsumo, dataSaude, dataCarga, dataTempMedia, faixasTemp
            };

        } catch (error) {
            console.error("Erro ao carregar CSVs:", error);
            alert("Erro ao ler os arquivos CSV. Verifique as URLs e o PapaParse.");
            return null;
        }
    }

    // 5. Executa o carregamento e a renderização
    const resultado = await carregarDados();

    if (resultado) {
        // Assume que renderizarKPIS está disponível globalmente via dashboard_ui.js
        if (typeof renderizarKPIS === 'function') {
            renderizarKPIS(resultado, resultado.dadosDash);
        } else {
            console.error("renderizarKPIS não está definida. Verifique se dashboard_ui.js foi carregado.");
        }
        renderizarGraficos(resultado);
    } else {
        // Limpa o dashboard se não houver dados
        if (typeof renderizarKPIS === 'function') {
            renderizarKPIS(null);
        }
        renderizarGraficos(null);
    }
}

// Inicia o dashboard após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    const selectPeriodo = document.getElementById('selectPeriodo');

    // 1. Carrega os dados iniciais (com base na opção 'semana' selecionada por padrão)
    if (selectPeriodo) {
        atualizarDashboard(selectPeriodo.value);

        // 2. Adiciona o Event Listener para reagir à mudança do select
        selectPeriodo.addEventListener('change', (event) => {
            const novoPeriodo = event.target.value;
            atualizarDashboard(novoPeriodo);
        });
    } else {
        console.error("Elemento 'selectPeriodo' não encontrado.");
    }
});