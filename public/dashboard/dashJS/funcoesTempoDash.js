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


    console.log("HOJE:", dataBR);
    console.log("ONTEM:", ontemBR);
    document.getElementById("select_ontem").innerHTML = `${ontemBR}`

    try {
        const resposta = await fetch(`/dashboard/diario/${ano}/${mes}/${semana}/${numeroDiaSemana}`);
        //       /ano /mes /semana /dia

        console.log("Status da resposta:", resposta.status);

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            console.error("Erro ao buscar:", erroTexto);
            return;
        }

        const json = await resposta.json();
        console.log("JSON recebido:", json);

        //Fazendo o ranking de Lotes

        document.getElementById("titulo_TopLotes").innerHTML = `Raking de alertas críticos por lote - Dia ${ontemBR}`
        const lote1 = json.find(dados => dados.lote === 1)
        const lote2 = json.find(dados => dados.lote === 2)
        const lote3 = json.find(dados => dados.lote === 3)
        const lote4 = json.find(dados => dados.lote === 4)
        const lote5 = json.find(dados => dados.lote === 5)
        const lote6 = json.find(dados => dados.lote === 6)

        const listaLotes = [lote1, lote2, lote3, lote4, lote5, lote6]

        const top6 = listaLotes.sort((a, b) => b.totalAvisos - a.totalAvisos);


        for (let i = 0; i < top6.length; i++) {
            document.getElementById(`numero_lote_top${i + 1}`).innerHTML = `${i + 1}. LOTE A00${top6[i].lote}`
            document.getElementById(`alertas_lote_top${i + 1}`).innerHTML = `${top6[i].totalAvisos} alertas`
        }

        //Gráfico de barras comparando o dia anterior com outro



        var alertasSemana = {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: { show: false }
            },

            title: {
                text: `ALERTAS CRÍTICOS GERADOS - ${ontemBR}`,
                align: "center",
                style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000"
                }
            },

            series: [
                {
                    name: "Lote A001",
                    data: [20, lote1.totalCritico]
                },
                {
                    name: "Lote A002",
                    data: [19, lote2.totalCritico]
                },
                {
                    name: "Lote A003",
                    data: [30, lote3.totalCritico]
                },
                {
                    name: "Lote A004",
                    data: [20, lote4.totalCritico]
                },
                {
                    name: "Lote A005",
                    data: [19, lote5.totalCritico]
                },
                {
                    name: "Lote A006",
                    data: [50, lote6.totalCritico]
                }
            ],

            xaxis: {
                categories: ["Dia anterior", `${ontemBR}`]
            },
            annotations: {
                yaxis: [
                    {
                        y: 30, 
                        borderColor: '#ff0000',
                        label: {
                            borderColor: '#ff0000',
                            style: {
                                color: '#fff',
                                background: '#ff0000'
                            },
                            text: 'Limite recomendado'
                        }
                    }
                ]
            },

            dataLabels: { enabled: false },

            colors: [
                "#0a1a2f",
                "#102f57",
                "#1c47a1",
                "#3d73ff",
                "#253f6e",
                "#4f83d1"
            ],

            tooltip: {
                y: {
                    formatter: (val) => `${val} alertas`
                }
            },

            legend: {
                position: "bottom"
            }
        };

        new ApexCharts(document.querySelector("#alertasSemana"), alertasSemana).render();


        var totalAlertas = {

            chart: { type: "line", height: 300 },
            stroke: { curve: "smooth", width: 3 },
            series: [
                { name: "CPU", data: [10, 12, 18, 25, 20, 23, 30] },
                { name: "RAM", data: [8, 10, 12, 18, 15, 20, 22] },
                { name: "Disco", data: [3, 5, 7, 10, 9, 8, 12] },
                { name: "Temperatura", data: [35, 52, 74, 10, 91, 82, 12] },
            ],
            xaxis: {
                categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
            }
        };
        new ApexCharts(document.querySelector("#tempAlertChart"), totalAlertas).render();



        console.log("dashboardGuilherme.js carregado!");


        var comparativoAlertas = {
            chart: {
                type: "area",
                height: 330,
                toolbar: { show: false }
            },

            stroke: {
                curve: "smooth",
                width: 3
            },

            series: [
                {
                    name: "Semana Atual",
                    data: [26, 28, 32, 52, 39, 34, 27]
                },
                {
                    name: "Última Semana",
                    data: [31, 60, 40, 39, 45, 50, 32]
                }
            ],
            dataLabels: { enabled: false },

            colors: ["#3b82f6", "#ef4444"],

            fill: {
                type: "solid",
                opacity: 0.25
            },

            xaxis: {
                categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                labels: {
                    style: { fontSize: "14px" }
                }
            },

            yaxis: {
                min: 0,
                max: 70,
                labels: {
                    style: { fontSize: "13px" }
                }
            },

            legend: {
                position: "bottom",
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12
                }
            },

            tooltip: {
                theme: "light",
                y: { formatter: val => `${val} alertas` }
            }
        };

        new ApexCharts(document.querySelector("#comparativoAlertas"), comparativoAlertas).render();



    } catch (erro) {
        console.error("ERRO NO FETCH:", erro);
    }
}