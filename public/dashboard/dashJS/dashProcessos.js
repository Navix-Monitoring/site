const dataAtual = new Date();


const ano = dataAtual.getFullYear();
const mes = (dataAtual.getMonth() + 1);
const dia = dataAtual.getDate();
const semana = calcularSemana(dia);

function calcularSemana(dia) {
    if (dia <= 7) return 1;
    if (dia <= 15) return 2;
    if (dia <= 22) return 3;
    return 4;
}
let dadosGargalos;
let dadosGerais;
let dadosLista;

async function atualizarTudo() {
    document.getElementById("loader-processos").classList.remove("oculto");

    try {
        const [lista, geral, gargalos] = await Promise.all([
            buscarCSVLista(),  //Ativando a busca do csv de lista
            buscarCSVGeral(),   //Ativando a busca do csv de dados gerais
            buscarCSVGargalos()
        ]);

        console.log("Lista de processos carregada:", lista);
        console.log("Dados gerais carregados:", geral);
        console.log("Lista de gargalos carregada: ", gargalos);
    } finally {
        document.getElementById("nomeLote")
        nomeLote.innerHTML = "Lote: "+ localStorage.getItem("codigoLote");
        gerarDadosGraficos();
        document.getElementById("loader-processos").classList.add("oculto");
    }
}

async function buscarCSVGargalos() {
    const URL_BASE = "https://bucket-client-navix.s3.us-east-1.amazonaws.com/dashProcessos/listaGargalos";
    const semanas = [1, 2, 3, 4, 5];
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    lote = localStorage.getItem("lote")
    const urls = [];

    // Função para gerar todas as urls possíveis
    for (const semana of semanas) {
        for (const dia of dias) {
            urls.push(
                `${URL_BASE}/Modelo/NAV-M100/IDLote/${lote}/Ano/2025/Mes/12/Semana/${semana}/Dia/${dia}/listaGargalos_2025-12-${dia}-.csv`
            );
        }
    }

    console.log(`Geradas ${urls.length} URLs. Testando...`);

    // Função para testar todas as urls
    const respostas = await Promise.allSettled(
        urls.map(url => fetch(url))
    );

    //filtra pelas urls existentes
    const urlsValidas = respostas
        .map((r, i) => (r.status === "fulfilled" && r.value.ok ? urls[i] : null))
        .filter(Boolean);

    console.log(`Encontrados ${urlsValidas.length} CSVs válidos:`)
    console.log(urlsValidas);

    const textos = await Promise.all(
        urlsValidas.map(url => fetch(url).then(r => r.text()))
    );

    const conteudos = [];

    textos.forEach(txt => {
        const parsed = Papa.parse(txt, { header: true, dynamicTyping: true }).data;
        conteudos.push(...parsed);
    });

    console.log("Total de linhas combinadas:", conteudos.length);
    console.log(conteudos)

    gerarDadosGargalos(conteudos);

    dadosGargalos = conteudos;

}

async function gerarDadosGargalos(conteudos) {

    const listaDias = {};

    for (const p of conteudos) {
        const timestampCompleto = p.Timestamp;

        if (!timestampCompleto) {
            console.warn("Item ignorado: Timestamp ausente ou nulo para o processo.", p);
            continue;
        }
        const timestampAtual = timestampCompleto.split('T')[0];

        if (timestampAtual in listaDias) {
            p.Timestamp = timestampAtual
            listaDias[timestampAtual].push(p);
        } else {
            listaDias[timestampAtual] = [p];
        }
    }

    console.log(JSON.stringify(listaDias, null, 2));

    const diasUnicos = Object.keys(listaDias);
    const totalDeDias = diasUnicos.length;

    let totalDeProcessos = 0;

    for (const dia in listaDias) {
        totalDeProcessos += listaDias[dia].length;
    }
    let mediaDiaria = 0;
    if (totalDeDias > 0) {
        mediaDiaria = totalDeProcessos / totalDeDias;
    }

     const kpiStatusEl = document.getElementById('kpi_gargalo_status');
    const kpiBordaEl = document.getElementById('kpi_gargalo_borda');

    classeCorBGFundo = ' ';
    classeCorBorda = ' ';
    classeCorTexto = ' '

    let statusqtdGargalos = mediaDiaria.toFixed(2) >= 71 ? "Crítico" : mediaDiaria.toFixed(2) >= 41 ? "Alerta" : mediaDiaria.toFixed(2) >= 21 ? "Neutro" : "Normal"
    if (statusqtdGargalos === "Crítico") {
        classeCorBGFundo = "bg-red-100";
        classeCorBorda = "border-red-500"; 
        classeCorTexto = "text-red-700"
    } else if (statusqtdGargalos === "Alerta") {
        classeCorBGFundo = "bg-orange-100";
        classeCorBorda = "border-orange-500";
        classeCorTexto = "text-orange-700"

    } else if (statusqtdGargalos === "Neutro") {
        classeCorBGFundo = "bg-yellow-100";
        classeCorBorda = "border-yellow-500";
        classeCorTexto = "text-yellow-700"

    } else {
        classeCorBGFundo = "bg-green-100";
        classeCorBorda = "border-green-500";
        classeCorTexto = "text-green-700"

    }
    
    kpiStatusEl.classList.add(classeCorBGFundo);
    kpiStatusEl.classList.add(classeCorTexto);
    kpiBordaEl.classList.add(classeCorBorda);

    kpi_gargalo_valor.innerHTML = mediaDiaria.toFixed(2);
    kpi_gargalo_status.innerHTML = statusqtdGargalos;
}

async function buscarCSVGeral() {
    const URL_BASE = "https://bucket-client-navix.s3.us-east-1.amazonaws.com/dashProcessos/consolidadoGeral";
    const semanas = [1, 2, 3, 4, 5];
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    lote = localStorage.getItem("lote")
    const urls = [];

    // Função para gerar todas as urls possíveis
    for (const semana of semanas) {
        for (const dia of dias) {
            urls.push(
                `${URL_BASE}/Modelo/NAV-M100/IDLote/${lote}/Ano/2025/Mes/12/Semana/${semana}/Dia/${dia}/consolidadoGeral_2025-12-${dia}-.csv`
            );
        }
    }

    console.log(`Geradas ${urls.length} URLs. Testando...`);

    // Função para testar todas as urls
    const respostas = await Promise.allSettled(
        urls.map(url => fetch(url))
    );

    //filtra pelas urls existentes
    const urlsValidas = respostas
        .map((r, i) => (r.status === "fulfilled" && r.value.ok ? urls[i] : null))
        .filter(Boolean);

    console.log(`Encontrados ${urlsValidas.length} CSVs válidos:`)
    console.log(urlsValidas);

    const textos = await Promise.all(
        urlsValidas.map(url => fetch(url).then(r => r.text()))
    );

    const conteudos = [];

    textos.forEach(txt => {
        const parsed = Papa.parse(txt, { header: true, dynamicTyping: true }).data;
        conteudos.push(...parsed);
    });

    console.log("Total de linhas combinadas:", conteudos.length);
    console.log(conteudos)
    
    dadosGerais = conteudos;
}

async function gerarDadosGraficos(){
    let dadosGerais2 = dadosLista;

    let dadosGeraisRam = dadosGerais;

    let dadosGeraisTempoVida = dadosLista;

    let dadosGargalosTop = dadosGargalos;

    dadosGerais2.sort((a,b)=>{
         const cpuA = parseFloat(a.Cpu) || 0;
        const cpuB = parseFloat(b.Cpu) || 0;
        return cpuB - cpuA; 
    });
    

    dadosGeraisRam.sort((a,b)=>{
         const ramA = parseFloat(a.Ram) || 0;
        const ramb = parseFloat(b.Ram) || 0;
        return ramb - ramA; 
    });

     dadosGeraisTempoVida.sort((a,b)=>{
         const tempoA = parseFloat(a.Ram) || 0;
        const tempob = parseFloat(b.Ram) || 0;
        return tempob - tempoA; 
    });

    const listaNome = {};

    for(const p of dadosGargalosTop){
        let nomeProcesso = p.Nome;
        if(!nomeProcesso){
            console.warn("Item ignorado: Nome ausente ou nulo para o processo.", p);
            continue;
        }

        if(nomeProcesso in listaNome){
            p.Nome = nomeProcesso
            listaNome[nomeProcesso].push(p);
        }else{
            listaNome[nomeProcesso] = [p];
        }
    }

    const nomesUnicos = Object.keys(listaNome);
    
    const dadosSumarizados = Object.keys(listaNome).map(nome => {
    return {
        nome: nome,
        contagemGargalos: listaNome[nome].length
    };
});
dadosSumarizados.sort((a, b) => b.contagemGargalos - a.contagemGargalos);
const top5Processos = dadosSumarizados.slice(0, 5); 
const rotulosNomes = top5Processos.map(item => item.nome);
const dadosContagens = top5Processos.map(item => item.contagemGargalos);


    const Top5MaioresCpu = dadosGerais2.slice(0, 5);
    const Top3MaioresRam = dadosGeraisRam.slice(0, 3);
    const Top5TempoVida = dadosGeraisTempoVida.slice(0,5);

    criarGrafico("graficoTopGargalo", "bar", rotulosNomes, dadosContagens);

    criarGrafico("graficoTopCPU", "bar", [Top5MaioresCpu[0].Nome, Top5MaioresCpu[1].Nome, Top5MaioresCpu[2].Nome, Top5MaioresCpu[3].Nome, Top5MaioresCpu[4].Nome], [Top5MaioresCpu[0].Cpu, Top5MaioresCpu[1].Cpu, Top5MaioresCpu[2].Cpu, Top5MaioresCpu[3].Cpu, Top5MaioresCpu[4].Cpu]);
      criarGrafico(
      "graficoRam",
      "line",
      ["t1", "t2", "t3", "t4", "t5"], // tempo no eixo X
      [], // deixe vazio porque não será usado
      undefined,
      {
        plugins: {
          legend: { display: true }
        },
        elements: {
          line: {
            tension: 0.3
          }
        },
        data: {
          labels: ["t1", "t2", "t3", "t4", "t5"],
          datasets: [
            {
              label: Top3MaioresRam[0].Nome,
              data: [10, 30, 25, 40, 35],
              borderColor: "#6ce5e8",
              backgroundColor: "transparent",
              borderWidth: 3
            },
            {
              label: Top3MaioresRam[1].Nome,
              data: [20, 22, 18, 30, 27],
              borderColor: "#41b8d5",
              backgroundColor: "transparent",
              borderWidth: 3
            },
            {
              label: Top3MaioresRam[2].Nome,
              data: [15, 18, 22, 20, 25],
              borderColor: "#2d8bba",
              backgroundColor: "transparent",
              borderWidth: 3
            }
          ]
        }
      }
    );

    criarGrafico("graficoVida", "bar", [Top5TempoVida[0].Nome, Top5TempoVida[1].Nome, Top5TempoVida[2].Nome,Top5TempoVida[3].Nome,Top5TempoVida[4].Nome], [Top5TempoVida[0].TempoVida, Top5TempoVida[1].TempoVida,Top5TempoVida[2].TempoVida,Top5TempoVida[3].TempoVida,Top5TempoVida[4].TempoVida]);


}

async function gerarKPIS(conteudos) {
    let maiorCpu = conteudos.reduce((max, processo) =>
        processo.Cpu > (max?.Cpu ?? -1) ? processo : max
        , null);

    kpi_cpu_valor.innerHTML = maiorCpu.Cpu + "%";
    kpi_cpu_nome.innerHTML = maiorCpu.Nome;

    let maiorTempoVida = conteudos.reduce((max, processo) =>
        processo.TempoVida > (max?.TempoVida ?? -1) ? processo : max);

    kpi_vida_valor.innerHTML = maiorTempoVida.TempoVidaFormatado;
    kpi_vida_nome.innerHTML = maiorTempoVida.Nome;


    const grupos = {};

    // Agrupar RAM por Nome
    for (const p of conteudos) {
        if (!p.Nome || isNaN(p.Ram)) continue;

        if (!grupos[p.Nome]) grupos[p.Nome] = [];
        grupos[p.Nome].push(p.Ram);
    }

    // Função de desvio padrão
    function calcularDesvioPadrao(valores) {
        if (valores.length <= 1) return 0;

        const media = valores.reduce((s, v) => s + v, 0) / valores.length;
        const variancia = valores.reduce((s, v) => s + (v - media) ** 2, 0) / valores.length;

        return Math.sqrt(variancia);
    }

    let maiorDesvio = { nome: null, valor: -1 };

    // Calcula desvio padrão por processo
    for (const nome in grupos) {
        const dp = calcularDesvioPadrao(grupos[nome]);

        if (dp > maiorDesvio.valor) {
            maiorDesvio = { nome, valor: dp };
        }
    }

    kpi_ram_valor.innerHTML = maiorDesvio.valor.toFixed(2) + " MB";
    kpi_ram_nome.innerHTML = maiorDesvio.nome;
}

async function buscarCSVLista() {
    const URL_BASE = "https://bucket-client-navix.s3.us-east-1.amazonaws.com/dashProcessos/listaProcessos";

    const semanas = [1, 2, 3, 4, 5];
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    lote = localStorage.getItem("lote")
    const urls = [];

    // Função para gerar todas as urls possíveis
    for (const semana of semanas) {
        for (const dia of dias) {
            urls.push(
                `${URL_BASE}/Modelo/NAV-M100/IDLote/${lote}/Ano/2025/Mes/12/Semana/${semana}/Dia/${dia}/listaProcessos_2025-12-${dia}-.csv`
            );
        }
    }

    console.log(`Geradas ${urls.length} URLs. Testando...`);

    // Função para testar todas as urls
    const respostas = await Promise.allSettled(
        urls.map(url => fetch(url))
    );

    //filtra pelas urls existentes
    const urlsValidas = respostas
        .map((r, i) => (r.status === "fulfilled" && r.value.ok ? urls[i] : null))
        .filter(Boolean);

    console.log(`Encontrados ${urlsValidas.length} CSVs válidos:`)
    console.log(urlsValidas);

    const textos = await Promise.all(
        urlsValidas.map(url => fetch(url).then(r => r.text()))
    );

    const conteudos = [];

    textos.forEach(txt => {
        const parsed = Papa.parse(txt, { header: true, dynamicTyping: true }).data;
        conteudos.push(...parsed);
    });

    console.log("Total de linhas combinadas:", conteudos.length);
    console.log(conteudos)

    listarProcessos(conteudos);
    gerarKPIS(conteudos);
    dadosLista = conteudos;
}

async function listarProcessos(conteudos) {
    processosLista.innerHTML = "Carregando Dados..."

    const conteudosFiltrados = conteudos.filter(p =>
        p &&
        p.Nome && p.Nome !== "" && p.Nome !== null
    );

    let contador = 0;

    conteudosFiltrados.sort((a, b) => criticidadeProcesso(b) - criticidadeProcesso(a));
    processosLista.innerHTML = ""
    for (let c = 0; c < conteudosFiltrados.length; c++) {
        const proc = conteudosFiltrados[c];

        const criticidade = criticidadeProcesso(proc);
        const cor = definirCor(criticidade);

        processosLista.innerHTML += `
            <div class="card_processo" data-level="${cor}">
                <span>${proc.Nome}</span>
                <span>${proc.Cpu}%</span>
                <span>${proc.Ram} MB</span>
                <span>${proc["Disco(MB)"]} MB/s</span>
                <span>${proc.TempoVidaFormatado || "-"}</span>
            </div>
        `;
        contador++
    }

    totalProcessos.innerHTML = `Total: ${contador}`

}

function criticidadeStatus(status) {
    switch (status) {
        case "CRÍTICO": return 3;
        case "MÉDIO": return 2;
        case "BAIXO": return 1;
        default: return 0;
    }
}

function criticidadeProcesso(proc) {
    return (
        criticidadeStatus(proc.StatusCPU) +
        criticidadeStatus(proc.StatusRAM) +
        criticidadeStatus(proc.StatusDISCO)
    );
}

function definirCor(criticidade) {
    if (criticidade >= 7) return "critico";
    if (criticidade >= 5) return "alerta";
    if (criticidade >= 2) return "neutro";
    return "normal";
}

function calcularDesvioPadrao(valores) {
    if (valores.length <= 1) return 0;

    const media = valores.reduce((s, v) => s + v, 0) / valores.length;
    const variancia = valores.reduce((s, v) => s + Math.pow(v - media, 2), 0) / valores.length;

    return Math.sqrt(variancia);
}