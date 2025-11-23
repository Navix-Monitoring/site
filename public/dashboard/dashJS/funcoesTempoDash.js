async function verificarDia() {
    const hoje = new Date();
    const dataBR = hoje.toLocaleDateString("pt-BR");

    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const ontemBR = ontem.toLocaleDateString("pt-BR");

    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;

    let semana;
    let numeroDiaSemana = ontem.getDate();
    if (numeroDiaSemana <= 7) semana = 1;
    else if (numeroDiaSemana <= 15) semana = 2;
    else if (numeroDiaSemana <= 22) semana = 3;
    else semana = 4;

    document.getElementById("select_ontem").innerHTML = `${ontemBR}`;

    try {
        const resposta = await fetch(`/dashboard/diario/${ano}/${mes}/${semana}/${numeroDiaSemana}`);

        if (!resposta.ok) {
            console.error("Erro ao buscar:", await resposta.text());
            return;
        }

        const json = await resposta.json();

        // --- LOTES ---
        const lote1 = json.find(d => d.lote === 1);
        const lote2 = json.find(d => d.lote === 2);
        const lote3 = json.find(d => d.lote === 3);
        const lote4 = json.find(d => d.lote === 4);
        const lote5 = json.find(d => d.lote === 5);
        const lote6 = json.find(d => d.lote === 6);

        const listaLotes = [lote1, lote2, lote3, lote4, lote5, lote6];

        const top6 = listaLotes.sort((a, b) => b.totalAvisos - a.totalAvisos);

        // --- SOMATÓRIOS DE NÍVEIS DE ALERTA ---
        const somaBaixo =
            lote1.totalBaixo + lote2.totalBaixo + lote3.totalBaixo +
            lote4.totalBaixo + lote5.totalBaixo + lote6.totalBaixo;

        const somaNeutro =
            lote1.totalNeutro + lote2.totalNeutro + lote3.totalNeutro +
            lote4.totalNeutro + lote5.totalNeutro + lote6.totalNeutro;

        const somaAtencao =
            lote1.totalAlerta + lote2.totalAlerta + lote3.totalAlerta +
            lote4.totalAlerta + lote5.totalAlerta + lote6.totalAlerta;

        const somaCritico =
            lote1.totalCritico + lote2.totalCritico + lote3.totalCritico +
            lote4.totalCritico + lote5.totalCritico + lote6.totalCritico;

        const somaTodosAlertas =
            somaBaixo + somaNeutro + somaAtencao + somaCritico;

            document.getElementById("tituloLote").innerHTML = `Modelo NAV-M100 - 06 lotes - ${somaTodosAlertas} alertas`

        // --- SOMATÓRIOS POR HARDWARE ---
        const somaCPU =
            lote1.cpuCritico + lote2.cpuCritico + lote3.cpuCritico +
            lote4.cpuCritico + lote5.cpuCritico + lote6.cpuCritico;

        const somaRAM =
            lote1.ramCritico + lote2.ramCritico + lote3.ramCritico +
            lote4.ramCritico + lote5.ramCritico + lote6.ramCritico;

        const somaDisco =
            lote1.discoCritico + lote2.discoCritico + lote3.discoCritico +
            lote4.discoCritico + lote5.discoCritico + lote6.discoCritico;

        const somaTemp =
            lote1.tempCritico + lote2.tempCritico + lote3.tempCritico +
            lote4.tempCritico + lote5.tempCritico + lote6.tempCritico;

        // --- KPIs STATUS ---
        document.getElementById("porcentagemBaixo").innerHTML =
            `${Math.round((somaBaixo * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaBaixoKPI").innerHTML =
            `${somaBaixo} alertas`;

        document.getElementById("porcentagemNeutro").innerHTML =
            `${Math.round((somaNeutro * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaNeutroKPI").innerHTML =
            `${somaNeutro} alertas`;

        document.getElementById("porcentagemAtencao").innerHTML =
            `${Math.round((somaAtencao * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaAtencaoKPI").innerHTML =
            `${somaAtencao} alertas`;

        document.getElementById("porcentagemCritico").innerHTML =
            `${Math.round((somaCritico * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaCriticoKPI").innerHTML =
            `${somaCritico} alertas`;

        // --- KPIs HARDWARE ---
        document.getElementById("criticoRAM").innerHTML =
            `RAM ${Math.round((somaRAM * 100) / somaCritico).toFixed(0)}%`;

        document.getElementById("criticoCPU").innerHTML =
            `CPU ${Math.round((somaCPU * 100) / somaCritico).toFixed(0)}%`;

        document.getElementById("criticoDISCO").innerHTML =
            `DISCO ${Math.round((somaDisco * 100) / somaCritico).toFixed(0)}%`;

        document.getElementById("criticoTEMP").innerHTML =
            `TEMP ${Math.round((somaTemp * 100) / somaCritico).toFixed(0)}%`;

        // --- RANKING ---
        for (let i = 0; i < top6.length; i++) {
            document.getElementById(`numero_lote_top${i + 1}`).innerHTML =
                `${i + 1}. LOTE A00${top6[i].lote}`;
            document.getElementById(`alertas_lote_top${i + 1}`).innerHTML =
                `${top6[i].totalCritico} alertas`;
        }

        // Gráfico de barras com os alertas juntos por lote

        var alertasSemana = {
            chart: { type: "bar", height: 350, stacked: true, toolbar: { show: false } },

            title: {
                text: `ALERTAS CRÍTICOS GERADOS - ${ontemBR}`,
                align: "center"
            },

            colors: [
                "#0a1a2f",
                "#102f57",
                "#1c47a1",
                "#3d73ff",
                "#253f6e",
                "#4f83d1"
            ],

            series: [
                { name: "Lote A001", data: [20, lote1.totalCritico] },
                { name: "Lote A002", data: [19, lote2.totalCritico] },
                { name: "Lote A003", data: [30, lote3.totalCritico] },
                { name: "Lote A004", data: [20, lote4.totalCritico] },
                { name: "Lote A005", data: [19, lote5.totalCritico] },
                { name: "Lote A006", data: [50, lote6.totalCritico] }
            ],

            xaxis: { categories: ["Dia anterior", `${ontemBR}`] }
        };

        new ApexCharts(document.querySelector("#alertasSemana"), alertasSemana).render();

        // Comparacao entre hardware
        var totalAlertas = {
            chart: { type: "bar", height: 300 },
            stroke: { curve: "smooth", width: 3 },
            series: [
                { name: "CPU", data: [10, 12] },
                { name: "RAM", data: [8, 10] },
                { name: "Disco", data: [3, 5] },
                { name: "Temperatura", data: [35, 52] },
            ],
            xaxis: {
                categories: ["Seg", "Ter"]
            }
        };

        new ApexCharts(document.querySelector("#tempAlertChart"), totalAlertas).render();


        // Comparativo de alertas do dia com outro


        document.getElementById("tituloAlertasTotais").innerHTML = `Comparativo - Alertas Totais`;
        document.getElementById("subtituloAlertasTotais").innerHTML = `${ontemBR} x dia Anterior`;

        const valorDiaAnterior = 60;

        var comparativoAlertas = {
            chart: { type: "bar", height: 330 },
            plotOptions: { bar: { horizontal: true, distributed: true } },

            colors: ["#3b82f6", "#0a1a2f"],

            series: [
                {
                    name: "Alertas Críticos",
                    data: [valorDiaAnterior, somaCritico]
                }
            ],

            xaxis: { categories: ["Dia anterior", `${ontemBR}`] }
        };

        new ApexCharts(document.querySelector("#comparativoAlertas"), comparativoAlertas).render();

    } catch (erro) {
        console.error("ERRO NO FETCH:", erro);
    }
}
