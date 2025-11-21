console.log("dashboardGuilherme.js carregado!");


var alertasSemana = {
    chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: { show: false }
    },

    title: {
        text: "ALERTAS GERADOS (7 DIAS)",
        align: "center",
        style: {
            fontSize: "18px",
            fontWeight: "bold",
            color: "#000"
        }
    },

    // 👇 6 LOTES
    series: [
        {
            name: "Lote A001",
            data: [5, 4, 3, 6, 5, 3, 4]
        },
        {
            name: "Lote A002",
            data: [6, 5, 4, 7, 5, 4, 5]
        },
        {
            name: "Lote A003",
            data: [8, 9, 6, 10, 8, 6, 7]
        },
        {
            name: "Lote A004",
            data: [10, 11, 8, 13, 10, 7, 9]
        },
        {
            name: "Lote A005",
            data: [4, 5, 3, 5, 4, 3, 4]
        },
        {
            name: "Lote A006",
            data: [3, 4, 3, 4, 3, 2, 3]
        }
    ],

    xaxis: {
        categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
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
