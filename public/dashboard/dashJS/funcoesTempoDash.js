document.getElementById("select_hardware_comparacao").onchange = () =>
({ CPU: compararCPU, RAM: compararRAM, TEMP: compararTEMP, DISCO: compararDisco }
[select_hardware_comparacao.value]());

function formatarData(date) {
    return date.toISOString().split("T")[0];
}

function calcularSemana(dia) {
    if (dia <= 7) return 1;
    if (dia <= 15) return 2;
    if (dia <= 22) return 3;
    return 4;
}
let chartAlertasSemana = null;
let chartHardware = null;
let chartComparativo = null;

async function verificarDia() {

    document.getElementById("input1").style.display = "block"
    document.getElementById("input2").style.display = "block"


    document.getElementById("select_periodo").style.alignSelf = "flex-end"

    document.getElementById("select_hardware_comparacao").style.display = "none"


    const hoje = new Date();

    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    const anteontem = new Date(hoje);
    anteontem.setDate(hoje.getDate() - 2);

    const input1 = document.getElementById("date1");
    const input2 = document.getElementById("date2");

    // Se o input estiver vazio deixo como ontem e anteontem
    if (!input1.value) input1.value = formatarData(ontem);
    if (!input2.value) input2.value = formatarData(anteontem);

    const data1 = new Date(input1.value + "T00:00:00");
    const data2 = new Date(input2.value + "T00:00:00");

    const ano = data1.getFullYear();
    const mes = data1.getMonth() + 1;
    const numeroDiaSemana = data1.getDate();
    const semanaOntem = calcularSemana(numeroDiaSemana);

    const ano2 = data2.getFullYear();
    const mes2 = data2.getMonth() + 1;
    const diaAnteontem = data2.getDate();
    const semanaAnteontem = calcularSemana(diaAnteontem);

    const ontemBR = data1.toLocaleDateString("pt-BR");
    const diaAnteOntemBR = data2.toLocaleDateString("pt-BR");

    document.getElementById("select_ontem").innerHTML = `Data`;

    try {
        const [resposta, resposta2] = await Promise.all([
            fetch(`/dashboard/diario/${ano}/${mes}/${semanaOntem}/${numeroDiaSemana}`),
            fetch(`/dashboard/diario/${ano2}/${mes2}/${semanaAnteontem}/${diaAnteontem}`),
        ]);

        if (!resposta.ok) {
            console.error("Erro ao buscar:", await resposta.text());
            return;
        }

        const json = await resposta.json();
        const json2 = await resposta2.json();

        //Dados de anteontem ou input 2

        const lote1_2 = json2.find(d => d.lote === 1);
        const lote2_2 = json2.find(d => d.lote === 2);
        const lote3_2 = json2.find(d => d.lote === 3);
        const lote4_2 = json2.find(d => d.lote === 4);
        const lote5_2 = json2.find(d => d.lote === 5);
        const lote6_2 = json2.find(d => d.lote === 6);

        const somaCriticoAnteOntem = lote1_2.totalCritico + lote2_2.totalCritico + lote3_2.totalCritico +
            lote4_2.totalCritico + lote5_2.totalCritico + lote6_2.totalCritico;

        const somaCPU_2 =
            lote1_2.cpuCritico + lote2_2.cpuCritico + lote3_2.cpuCritico +
            lote4_2.cpuCritico + lote5_2.cpuCritico + lote6_2.cpuCritico;

        const somaRAM_2 =
            lote1_2.ramCritico + lote2_2.ramCritico + lote3_2.ramCritico +
            lote4_2.ramCritico + lote5_2.ramCritico + lote6_2.ramCritico;

        const somaDisco_2 =
            lote1_2.discoCritico + lote2_2.discoCritico + lote3_2.discoCritico +
            lote4_2.discoCritico + lote5_2.discoCritico + lote6_2.discoCritico;

        const somaTemp_2 =
            lote1_2.tempCritico + lote2_2.tempCritico + lote3_2.tempCritico +
            lote4_2.tempCritico + lote5_2.tempCritico + lote6_2.tempCritico;


        //Dados de ontem ou input 1

        const lote1 = json.find(d => d.lote === 1);
        const lote2 = json.find(d => d.lote === 2);
        const lote3 = json.find(d => d.lote === 3);
        const lote4 = json.find(d => d.lote === 4);
        const lote5 = json.find(d => d.lote === 5);
        const lote6 = json.find(d => d.lote === 6);

        const listaLotes = [lote1, lote2, lote3, lote4, lote5, lote6];

        const top6 = listaLotes.sort((a, b) => b.totalCritico - a.totalCritico);

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

        const somaTodosAlertas = somaBaixo + somaNeutro + somaAtencao + somaCritico;

        document.getElementById("tituloLote").innerHTML =
            `Modelo NAV-M100 - 06 lotes - ${somaTodosAlertas} capturas`;

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

        //KPIs

        document.getElementById("porcentagemBaixo").innerHTML =
            `${Math.round((somaBaixo * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaBaixoKPI").innerHTML = `${somaBaixo} capturas`;

        document.getElementById("porcentagemNeutro").innerHTML =
            `${Math.round((somaNeutro * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaNeutroKPI").innerHTML = `${somaNeutro} capturas`;

        document.getElementById("porcentagemAtencao").innerHTML =
            `${Math.round((somaAtencao * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaAtencaoKPI").innerHTML = `${somaAtencao} capturas`;

        document.getElementById("porcentagemCritico").innerHTML =
            `${Math.round((somaCritico * 100) / somaTodosAlertas)}%`;
        document.getElementById("totalAlertaCriticoKPI").innerHTML = `${somaCritico} alertas`;

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

        for (let i = 0; i < top6.length; i++) {
            document.getElementById(`numero_lote_top${i + 1}`).innerHTML =
                `${i + 1}. LOTE A00${top6[i].lote} - ${Math.round(((top6[i].totalCritico) * 100) / somaCritico)}% dos críticos totais`;
            document.getElementById(`alertas_lote_top${i + 1}`).innerHTML =
                `${top6[i].totalCritico} alertas`;
        }

        // Gráfico com total de alertas por lote

        var alertasSemana = {
            chart: { type: "bar", height: 350, stacked: true, toolbar: { show: false } },
            plotOptions: { bar: { barHeight: "90%" } },
            title: { text: `ALERTAS CRÍTICOS GERADOS - ${ontemBR}`, align: "center" },
            
            colors: ["#0a1a2f", "#102f57", "#1c47a1", "#3d73ff", "#253f6e", "#4f83d1"],
            series: [
                { name: "Lote A001", data: [lote1.totalCritico, lote1_2.totalCritico] },
                { name: "Lote A002", data: [lote2.totalCritico, lote2_2.totalCritico] },
                { name: "Lote A003", data: [lote3.totalCritico, lote3_2.totalCritico] },
                { name: "Lote A004", data: [lote4.totalCritico, lote4_2.totalCritico] },
                { name: "Lote A005", data: [lote5.totalCritico, lote5_2.totalCritico] },
                { name: "Lote A006", data: [lote6.totalCritico, lote6_2.totalCritico] }
            ],
            xaxis: { categories: [ontemBR, diaAnteOntemBR] }
        };

        if (chartAlertasSemana) chartAlertasSemana.destroy();

        chartAlertasSemana = new ApexCharts(
            document.querySelector("#alertasSemana"),
            alertasSemana
        );

        chartAlertasSemana.render();
        //Gráfico que compara o hardware

        var totalAlertas = {
            chart: { type: "bar", height: 300 },
            stroke: { curve: "smooth", width: 3 },
            series: [
                { name: "CPU", data: [`${somaCPU}`, `${somaCPU_2}`] },
                { name: "RAM", data: [`${somaRAM}`, `${somaRAM_2}`] },
                { name: "Disco", data: [`${somaDisco}`, `${somaDisco_2}`] },
                { name: "Temperatura", data: [`${somaTemp}`, `${somaTemp_2}`] },
            ],
            colors: ["#0a1a2f", "#102f57", "#1c47a1", "#3d73ff"],
            xaxis: { categories: [ontemBR, diaAnteOntemBR] }
        };

        if (chartHardware) chartHardware.destroy();

        chartHardware = new ApexCharts(
            document.querySelector("#tempAlertChart"),
            totalAlertas
        );

        chartHardware.render();
        // Gráfico comparativo de alertas totais

        document.getElementById("tituloAlertasTotais").innerHTML = `Comparativo - Alertas Críticos Totais`;
        document.getElementById("subtituloAlertasTotais").innerHTML = `${ontemBR} x dia Anterior`;

        var comparativoAlertas = {
            chart: { type: "bar", height: 330 },
            plotOptions: { bar: { horizontal: true, distributed: true } },
            colors: ["#3b82f6", "#0a1a2f"],
            series: [{
                name: "Alertas Críticos",
                data: [somaCritico, somaCriticoAnteOntem]
            }],
            xaxis: { categories: [ontemBR, diaAnteOntemBR] }
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
document.getElementById("date1").addEventListener("change", verificarDia);
document.getElementById("date2").addEventListener("change", verificarDia);