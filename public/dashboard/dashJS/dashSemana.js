//Select por semana

document.getElementById("select_hardware_comparacao").onchange = null;


async function ultimos7dias() {

    document.getElementById("input1").style.display = "none"
    document.getElementById("input2").style.display = "none"


    document.getElementById("select_periodo").style.alignSelf = "flex-end"

    if (chartHardware) {
        chartHardware.destroy();
        chartHardware = null;
    }


    somaRAMPorDia = [];
    somaCPUPorDia = [];
    somaDiscoPorDia = [];
    somaTempPorDia = [];

    categorias = []

    somaRAMPorDia2 = [];
    somaCPUPorDia2 = [];
    somaDiscoPorDia2 = [];
    somaTempPorDia2 = [];

    somaAlertasCriticosPorDia = []
    somaAlertasCriticosPorDia2 = []
    document.getElementById("select_hardware_comparacao").style.display = "inline-block"



    semanaAtual = "Relatorio-Ultimos7Dias"

    semanaAnterior = "Relatorio-Ultimos7Dias-Anteriores"


    try {
        const [resposta, resposta2] = await Promise.all([
            fetch(`/dashboard/semanal/${semanaAtual}`),
            fetch(`/dashboard/semanal/${semanaAnterior}`),
        ]);

        if (!resposta.ok || !resposta2.ok) {
            console.error("Erro ao buscar:", await resposta.text());
            return;
        }

        const json = await resposta.json();
        const json2 = await resposta2.json();

        console.log(json)
        console.log(json2)

        //Separação por lotes
        let somaBaixo = 0;
        let somaNeutro = 0;
        let somaAtencao = 0;
        let somaCritico = 0;

        for (let i = 0; i < json.dias.length; i++) {
            const dia = json.dias[i];

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];

                somaBaixo += lote.totalBaixo;
                somaNeutro += lote.totalNeutro;
                somaAtencao += lote.totalAlerta;
                somaCritico += lote.totalCritico;
            }
        }

        somaTodosAlertas = somaBaixo + somaNeutro + somaAtencao + somaCritico

        document.getElementById("tituloLote").innerHTML =
            `Modelo NAV-M100 - 06 lotes - ${somaTodosAlertas} alertas`;

        //KPIs
        document.getElementById("porcentagemBaixo").innerHTML =
            `${Math.round((somaBaixo * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaBaixoKPI").innerHTML = `${somaBaixo} alertas`;

        document.getElementById("porcentagemNeutro").innerHTML =
            `${Math.round((somaNeutro * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaNeutroKPI").innerHTML = `${somaNeutro} alertas`;

        document.getElementById("porcentagemAtencao").innerHTML =
            `${Math.round((somaAtencao * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaAtencaoKPI").innerHTML = `${somaAtencao} alertas`;

        document.getElementById("porcentagemCritico").innerHTML =
            `${Math.round((somaCritico * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaCriticoKPI").innerHTML = `${somaCritico} alertas`;


        somaRAM = 0
        somaCPU = 0
        somaDisco = 0
        somaTemp = 0

        for (let i = 0; i < json.dias.length; i++) {
            const dia = json.dias[i];

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];

                somaRAM += lote.ramCritico;
                somaCPU += lote.cpuCritico;
                somaDisco += lote.discoCritico;
                somaTemp += lote.tempCritico;
            }
        }

        //Kpi do hardware
        document.getElementById("criticoRAM").innerHTML =
            `RAM ${Math.round((somaRAM * 100) / somaCritico)}%`;
        document.getElementById("criticoCPU").innerHTML =
            `CPU ${Math.round((somaCPU * 100) / somaCritico)}%`;
        document.getElementById("criticoDISCO").innerHTML =
            `DISCO ${Math.round((somaDisco * 100) / somaCritico)}%`;
        document.getElementById("criticoTEMP").innerHTML =
            `TEMP ${Math.round((somaTemp * 100) / somaCritico)}%`;


        //Ranking de lote top6
        let lotesSemana = {
            1: { lote: 1, totalCritico: 0 },
            2: { lote: 2, totalCritico: 0 },
            3: { lote: 3, totalCritico: 0 },
            4: { lote: 4, totalCritico: 0 },
            5: { lote: 5, totalCritico: 0 },
            6: { lote: 6, totalCritico: 0 },
        };

        for (let i = 0; i < json.dias.length; i++) {
            const dia = json.dias[i];

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];
                lotesSemana[lote.lote].totalCritico += lote.totalCritico;
            }
        }

        const top6 = Object.values(lotesSemana).sort((a, b) => b.totalCritico - a.totalCritico);

        for (let i = 0; i < top6.length; i++) {
            document.getElementById(`numero_lote_top${i + 1}`).innerHTML =
                `${i + 1}. LOTE A00${top6[i].lote}`;
            document.getElementById(`alertas_lote_top${i + 1}`).innerHTML =
                `${top6[i].totalCritico} alertas`;
        }

        // Gráfico com total de alertas por lote

        let dadosLotes = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };

        for (let i = 0; i < json.dias.length; i++) {
            const dia = json.dias[i];

            categorias[i] = dia.numeroDia;

            categorias

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];

                const tamanhoAtual = dadosLotes[lote.lote].length;

                dadosLotes[lote.lote][tamanhoAtual] = lote.totalCritico;
            }
        }

        let series = [
            { name: "Lote A001", data: dadosLotes[1] },
            { name: "Lote A002", data: dadosLotes[2] },
            { name: "Lote A003", data: dadosLotes[3] },
            { name: "Lote A004", data: dadosLotes[4] },
            { name: "Lote A005", data: dadosLotes[5] },
            { name: "Lote A006", data: dadosLotes[6] },
        ];


        //Gráfico comparativo de hardware

        for (let i = 0; i < json.dias.length; i++) {
            const dia = json.dias[i];

            let somaRAM = 0;
            let somaCPU = 0;
            let somaDisco = 0;
            let somaTemp = 0;

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];

                somaRAM += lote.ramCritico;
                somaCPU += lote.cpuCritico;
                somaDisco += lote.discoCritico;
                somaTemp += lote.tempCritico;
            }
            somaRAMPorDia.push(somaRAM);
            somaCPUPorDia.push(somaCPU);
            somaDiscoPorDia.push(somaDisco);
            somaTempPorDia.push(somaTemp);

            somaAlertasCriticosPorDia.push(somaRAM + somaCPU + somaDisco + somaTemp)

        }

        for (let i = 0; i < json2.dias.length; i++) {
            const dia = json2.dias[i];

            let somaRAM2 = 0;
            let somaCPU2 = 0;
            let somaDisco2 = 0;
            let somaTemp2 = 0;

            for (let j = 0; j < dia.lotes.length; j++) {
                const lote = dia.lotes[j];

                somaRAM2 += lote.ramCritico;
                somaCPU2 += lote.cpuCritico;
                somaDisco2 += lote.discoCritico;
                somaTemp2 += lote.tempCritico;
            }
            somaRAMPorDia2.push(somaRAM2);
            somaCPUPorDia2.push(somaCPU2);
            somaDiscoPorDia2.push(somaDisco2);
            somaTempPorDia2.push(somaTemp2);
            somaAlertasCriticosPorDia2.push(somaRAM2 + somaCPU2 + somaDisco2 + somaTemp2)

        }

        

        const alertasSemana = {
            chart: { type: "bar", height: 350, stacked: true, toolbar: { show: false } },
            tooltip: { enabled: false },
            title: { text: "ALERTAS CRÍTICOS GERADOS (7 DIAS)", align: "center" },
            plotOptions: { bar: { horizontal: false } },
            xaxis: { categories: categorias },
            series: series,
            colors: ["#0a1a2f", "#102f57", "#1c47a1", "#3d73ff", "#253f6e", "#4f83d1"]
        };

        if (chartAlertasSemana) chartAlertasSemana.destroy();

        chartAlertasSemana = new ApexCharts(
            document.querySelector("#alertasSemana"),
            alertasSemana
        );

        chartAlertasSemana.render();



        document.getElementById("select_hardware_comparacao").onchange =
            () => ({
                CPU: compararCPU,
                RAM: compararRAM,
                TEMP: compararTEMP,
                DISCO: compararDisco
            }[select_hardware_comparacao.value]());

        compararCPU();

        // Gráfico comparativo de alertas totais

        document.getElementById("tituloAlertasTotais").innerHTML = `COMPARATIVO - ALERTAS CRÍTICOS TOTAIS`;
        document.getElementById("subtituloAlertasTotais").innerHTML = `Semana atual x Semana passada`;

        var comparativoAlertas = {
            chart: { type: "area", height: 330 },
            plotOptions: { bar: { horizontal: true, distributed: true } },
            colors: ["#3b82f6", "#0a1a2f"],
            series: [
                { name: "Semana Atual (Total de Críticos)", data: somaAlertasCriticosPorDia },
                { name: "Última Semana(Total de Críticos)", data: somaAlertasCriticosPorDia2 }
            ],
            xaxis: { categories: categorias }
        };

        if (chartComparativo) chartComparativo.destroy();

        chartComparativo = new ApexCharts(
            document.querySelector("#comparativoAlertas"),
            comparativoAlertas
        );

        chartComparativo.render();


    } catch (erro) {
        console.error("ERRO NO FETCH:", erro);
    }
}

function compararCPU() {

    if (chartHardware) chartHardware.destroy();


    var totalAlertas = {
        chart: { type: "line", height: 300 },
        stroke: { curve: "smooth", width: 3 },
        series: [
            { name: "Semana Atual (CPU)", data: somaCPUPorDia },
            { name: "Última Semana", data: somaCPUPorDia2 }
        ],
        colors: ["#3b82f6", "#0a1a2f"],
        xaxis: { categories: categorias }
    };

    if (chartHardware) chartHardware.destroy();

    chartHardware = new ApexCharts(
        document.querySelector("#tempAlertChart"),
        totalAlertas
    );

    chartHardware.render();
}

function compararRAM() {

    if (chartHardware) chartHardware.destroy();


    var totalAlertas = {
        chart: { type: "line", height: 300 },
        stroke: { curve: "smooth", width: 3 },
        series: [
            { name: "Semana Atual (RAM)", data: somaRAMPorDia },
            { name: "Última Semana", data: somaRAMPorDia2 }
        ],
        colors: ["#3b82f6", "#0a1a2f"],
        xaxis: { categories: categorias }
    };

    if (chartHardware) chartHardware.destroy();

    chartHardware = new ApexCharts(
        document.querySelector("#tempAlertChart"),
        totalAlertas
    );

    chartHardware.render();
}

function compararDisco() {

    if (chartHardware) chartHardware.destroy();

    var totalAlertas = {
        chart: { type: "line", height: 300 },
        stroke: { curve: "smooth", width: 3 },
        series: [
            { name: "Semana Atual (Disco)", data: somaDiscoPorDia },
            { name: "Última Semana", data: somaDiscoPorDia2 }
        ],
        colors: ["#3b82f6", "#0a1a2f"],
        xaxis: { categories: categorias }
    };

    if (chartHardware) chartHardware.destroy();

    chartHardware = new ApexCharts(
        document.querySelector("#tempAlertChart"),
        totalAlertas
    );

    chartHardware.render();
}

function compararTEMP() {

    if (chartHardware) chartHardware.destroy();

    var totalAlertas = {
        chart: { type: "line", height: 300 },
        stroke: { curve: "smooth", width: 3 },
        series: [
            { name: "Semana Atual (Disco)", data: somaTempPorDia },
            { name: "Última Semana", data: somaTempPorDia2 }
        ],
        colors: ["#3b82f6", "#0a1a2f"],
        xaxis: { categories: categorias }
    };

    if (chartHardware) chartHardware.destroy();

    chartHardware = new ApexCharts(
        document.querySelector("#tempAlertChart"),
        totalAlertas
    );

    chartHardware.render();
}

document.getElementById("select_hardware_comparacao").onchange =
    () => ({ CPU: compararCPU, RAM: compararRAM, TEMP: compararTEMP, DISCO: compararDisco }
    [select_hardware_comparacao.value]());