//Select pra mês

document.getElementById("select_hardware_comparacao").onchange = null;


async function ultimasSemanas() {

    if (chartAlertasSemana) chartAlertasSemana.destroy();
    if (chartComparativo) chartComparativo.destroy();



    document.getElementById("input1").style.display = "none"
    document.getElementById("input2").style.display = "none"


    document.getElementById("select_periodo").style.alignSelf = "flex-end"

    if (chartHardware) {
        chartHardware.destroy();
        chartHardware = null;
    }



    document.getElementById("select_hardware_comparacao").style.display = "inline-block"

    mesAtual = "Relatorio-UltimasSemanas"
    mesPassado = "Relatorio-UltimasSemanas-Anteriores"

    try {
        const [resposta, resposta2] = await Promise.all([
            fetch(`/dashboard/mensal/${mesAtual}`),
            fetch(`/dashboard/mensal/${mesPassado}`),
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

        //Gráfico de barra com os lotes separados em 4 semanas
        const dias = json.dias;

        const semanas = [];
        for (let i = 0; i < 4; i++) {
            semanas.push(dias.slice(i * 7, (i + 1) * 7));
        }

        semanas.reverse()

        // Críticos por lote
        let semana1Totais = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        semanas[0].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana1Totais[lote.lote] += lote.totalCritico;
            });
        });

        let semana2Totais = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        semanas[1].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana2Totais[lote.lote] += lote.totalCritico;
            });
        });

        let semana3Totais = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        semanas[2].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana3Totais[lote.lote] += lote.totalCritico;
            });
        });

        let semana4Totais = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        semanas[3].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana4Totais[lote.lote] += lote.totalCritico;
            });
        });


        let seriesSemanas = [
            {
                name: "Lote A001",
                data: [
                    semana1Totais[1],
                    semana2Totais[1],
                    semana3Totais[1],
                    semana4Totais[1]
                ]
            },
            {
                name: "Lote A002",
                data: [
                    semana1Totais[2],
                    semana2Totais[2],
                    semana3Totais[2],
                    semana4Totais[2]
                ]
            },
            {
                name: "Lote A003",
                data: [
                    semana1Totais[3],
                    semana2Totais[3],
                    semana3Totais[3],
                    semana4Totais[3]
                ]
            },
            {
                name: "Lote A004",
                data: [
                    semana1Totais[4],
                    semana2Totais[4],
                    semana3Totais[4],
                    semana4Totais[4]
                ]
            },
            {
                name: "Lote A005",
                data: [
                    semana1Totais[5],
                    semana2Totais[5],
                    semana3Totais[5],
                    semana4Totais[5]
                ]
            },
            {
                name: "Lote A006",
                data: [
                    semana1Totais[6],
                    semana2Totais[6],
                    semana3Totais[6],
                    semana4Totais[6]
                ]
            }
        ];

        let categoriasSemanas = [];

        for (let i = 0; i < 4; i++) {

            let primeira = semanas[i][0];
            let ultima = semanas[i][6];

            categoriasSemanas.push(
                ` ${ultima.numeroDia}/${ultima.numeroMes} - ${primeira.numeroDia}/${primeira.numeroMes}`
            );
        }


        const graficoSemanas = {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: { show: false }
            },
            title: { text: "ALERTAS CRÍTICOS POR SEMANA (28 DIAS)", align: "center" },
            plotOptions: { bar: { horizontal: false } },

            xaxis: { categories: categoriasSemanas },
            series: seriesSemanas,
            colors: ["#1b2a41", "#0e3b75", "#2f6fff", "#5a8bf0"]
        };


        chartSemanas = new ApexCharts(
            document.querySelector("#alertasSemana"),
            graficoSemanas
        );

        chartSemanas.render();



        // Gráfico comparativo de alertas totais

        somaCriticosTotaisSemana1 =
            semana1Totais[1] +
            semana1Totais[2] +
            semana1Totais[3] +
            semana1Totais[4] +
            semana1Totais[5] +
            semana1Totais[6];

        somaCriticosTotaisSemana2 =
            semana2Totais[1] +
            semana2Totais[2] +
            semana2Totais[3] +
            semana2Totais[4] +
            semana2Totais[5] +
            semana2Totais[6];

        somaCriticosTotaisSemana3 =
            semana3Totais[1] +
            semana3Totais[2] +
            semana3Totais[3] +
            semana3Totais[4] +
            semana3Totais[5] +
            semana3Totais[6];

        somaCriticosTotaisSemana4 =
            semana4Totais[1] +
            semana4Totais[2] +
            semana4Totais[3] +
            semana4Totais[4] +
            semana4Totais[5] +
            semana4Totais[6];


        // Separar semanas anteriores corretamente
        const semanas2 = [];
        for (let i = 0; i < 4; i++) {
            semanas2.push(json2.dias.slice(i * 7, (i + 1) * 7));
        }
        semanas2.reverse();

        // Totais semanais dos 6 lotes
        let semana1Totais2 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        let semana2Totais2 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        let semana3Totais2 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        let semana4Totais2 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        // Semana 1
        semanas2[0].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana1Totais2[lote.lote] += lote.totalCritico;
            });
        });

        // Semana 2
        semanas2[1].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana2Totais2[lote.lote] += lote.totalCritico;
            });
        });

        // Semana 3
        semanas2[2].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana3Totais2[lote.lote] += lote.totalCritico;
            });
        });

        // Semana 4
        semanas2[3].forEach(dia => {
            dia.lotes.forEach(lote => {
                semana4Totais2[lote.lote] += lote.totalCritico;
            });
        });

        let somaCriticosTotaisSemana1_2 =
            semana1Totais2[1] +
            semana1Totais2[2] +
            semana1Totais2[3] +
            semana1Totais2[4] +
            semana1Totais2[5] +
            semana1Totais2[6];

        let somaCriticosTotaisSemana2_2 =
            semana2Totais2[1] +
            semana2Totais2[2] +
            semana2Totais2[3] +
            semana2Totais2[4] +
            semana2Totais2[5] +
            semana2Totais2[6];

        let somaCriticosTotaisSemana3_2 =
            semana3Totais2[1] +
            semana3Totais2[2] +
            semana3Totais2[3] +
            semana3Totais2[4] +
            semana3Totais2[5] +
            semana3Totais2[6];

        let somaCriticosTotaisSemana4_2 =
            semana4Totais2[1] +
            semana4Totais2[2] +
            semana4Totais2[3] +
            semana4Totais2[4] +
            semana4Totais2[5] +
            semana4Totais2[6];
        document.getElementById("tituloAlertasTotais").innerHTML = `COMPARATIVO - ALERTAS CRÍTICOS TOTAIS`;
        document.getElementById("subtituloAlertasTotais").innerHTML = `4 semanas atuais x últimas 4 semanas`;

        var comparativoAlertas = {
            chart: { type: "area", height: 330 },
            plotOptions: { bar: { horizontal: true, distributed: true } },
            colors: ["#3b82f6", "#0a1a2f"],
            series: [
                { name: "6/11 - 4/12", data: [somaCriticosTotaisSemana1, somaCriticosTotaisSemana2, somaCriticosTotaisSemana3, somaCriticosTotaisSemana4] },
                { name: "9/10 - 5/11", data: [somaCriticosTotaisSemana1_2, somaCriticosTotaisSemana2_2, somaCriticosTotaisSemana3_2, somaCriticosTotaisSemana4_2] },
            ],
            xaxis: { categories: categoriasSemanas }
        };

        if (chartComparativo) chartComparativo.destroy();

        chartComparativo = new ApexCharts(
            document.querySelector("#comparativoAlertas"),
            comparativoAlertas
        );

        chartComparativo.render();

    } catch {

    }

}