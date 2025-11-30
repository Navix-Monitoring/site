function renderizarKPIS(dados, dadosDash) {
    // Elementos dos cartões
    const kpiSaudeCard = document.getElementById('kpi-saude-card');
    const kpiCargaCard = document.getElementById('kpi-carga-card');
    const kpiTempCard = document.getElementById('kpi-temp-card');

    // Novos elementos de Ícones e Backgrounds
    const kpiSaudeIconeBg = document.getElementById('kpi-saude-icone-bg');
    const kpiSaudeIcone = document.getElementById('kpi-saude-icone');
    const kpiCargaIconeBg = document.getElementById('kpi-carga-icone-bg');
    const kpiCargaIcone = document.getElementById('kpi-carga-icone');
    const kpiTempIconeBg = document.getElementById('kpi-temp-icone-bg');
    const kpiTempIcone = document.getElementById('kpi-temp-icone');

    // Função auxiliar para remover classes Tailwind de cor e background
    const limparClasses = (element) => {
        if (!element) return;
        // Regex para remover classes de borda (border-cor-num), texto (text-cor-num) e background (bg-cor-num)
        element.className = element.className.replace(/\b((border|text|bg)-(green|red|amber|blue|orange|red)-\d{2,3})\b/g, '').trim();
    };


    if (!dados || !dados.labelsModelos || dados.labelsModelos.length === 0) {
        // Define valores padrão/vazios
        document.getElementById('kpi-saude-val').innerText = `N/A`;
        document.getElementById('kpi-carga-val').innerText = `N/A`;
        document.getElementById('kpi-temp-val').innerText = `N/A`;
        document.getElementById('listaAlertas').innerHTML = '<div class="text-center text-slate-500 mt-10">Nenhum dado encontrado para o período.</div>';

        // Limpa todas as classes de cor (borda, ícone e background)
        [kpiSaudeCard, kpiCargaCard, kpiTempCard, kpiSaudeIconeBg, kpiSaudeIcone, kpiCargaIconeBg, kpiCargaIcone, kpiTempIconeBg, kpiTempIcone].forEach(limparClasses);

        // Re-adiciona as classes base removidas pelo replace
        const baseClasses = ['bg-white', 'p-6', 'rounded-xl', 'shadow-lg', 'border-t-4', 'flex', 'flex-col', 'justify-between', 'hover:-translate-y-1', 'transition-transform', 'duration-300'];
        if (kpiSaudeCard) kpiSaudeCard.classList.add(...baseClasses);
        if (kpiCargaCard) kpiCargaCard.classList.add(...baseClasses);
        if (kpiTempCard) kpiTempCard.classList.add(...baseClasses);
        if (kpiSaudeIconeBg) kpiSaudeIconeBg.classList.add('p-2', 'rounded-full');
        if (kpiCargaIconeBg) kpiCargaIconeBg.classList.add('p-2', 'rounded-full');
        if (kpiTempIconeBg) kpiTempIconeBg.classList.add('p-2', 'rounded-full');

        return;
    }

    // Lógica de cálculo e atualização de KPIs
    const mediaGeralSaude = (dados.dataSaude.reduce((a, b) => a + Number(b), 0) / dados.dataSaude.length).toFixed(0);
    const mediaGeralCarga = (dados.dataCarga.reduce((a, b) => a + Number(b), 0) / dados.dataCarga.length).toFixed(0);
    const mediaGeralTemp = (dados.dataTempMedia.reduce((a, b) => a + Number(b), 0) / dados.dataTempMedia.length).toFixed(0);

    document.getElementById('kpi-saude-val').innerText = `${mediaGeralSaude}%`;
    document.getElementById('kpi-carga-val').innerText = `${mediaGeralCarga}%`;
    document.getElementById('kpi-temp-val').innerText = `${mediaGeralTemp}°C`;

    // -----------------------------------------------------
    // LÓGICA DE STATUS, COR DA BORDA E COR DO ÍCONE
    // -----------------------------------------------------

    // --- SAÚDE (HEART) ---
    let statusSaude = "Saudável";
    let classeSaude = "text-green-600 bg-green-100";
    let classeBordaSaude = "border-green-500";
    let classeIconeSaude = "text-green-600";
    let classeBgSaude = "bg-green-100";

    if (mediaGeralSaude < 70) {
        statusSaude = "Crítico";
        classeSaude = "text-red-600 bg-red-100";
        classeBordaSaude = "border-red-500";
        classeIconeSaude = "text-red-600";
        classeBgSaude = "bg-red-100";
    } else if (mediaGeralSaude < 85) {
        statusSaude = "Atenção";
        classeSaude = "text-amber-600 bg-amber-100";
        classeBordaSaude = "border-amber-500";
        classeIconeSaude = "text-amber-600";
        classeBgSaude = "bg-amber-100";
    }

    // --- TEMPERATURA (THERMOMETER) ---
    let statusTemp = "Normal";
    let classeTemp = "text-blue-600 bg-blue-100";
    let classeBordaTemp = "border-blue-500";
    let classeIconeTemp = "text-blue-600";
    let classeBgTemp = "bg-blue-100";

    if (mediaGeralTemp > 40) {
        statusTemp = "Alerta";
        classeTemp = "text-red-600 bg-red-100";
        classeBordaTemp = "border-red-500";
        classeIconeTemp = "text-red-600";
        classeBgTemp = "bg-red-100";
    } else if (mediaGeralTemp > 30) {
        statusTemp = "Atenção";
        classeTemp = "text-orange-600 bg-orange-100";
        classeBordaTemp = "border-orange-500";
        classeIconeTemp = "text-orange-600";
        classeBgTemp = "bg-orange-100";
    }

    // --- CARGA (BATTERY) ---
    // Carga é mantida como Normal/Azul
    let classeBordaCarga = "border-blue-500";
    let classeIconeCarga = "text-blue-600";
    let classeBgCarga = "bg-blue-100";


    // -----------------------------------------------------
    // APLICAÇÃO DAS CLASSES (BORDA, ÍCONE E BACKGROUND)
    // -----------------------------------------------------

    // 1. Aplica Borda (Card)
    const aplicarBorda = (element, newClass) => {
        if (!element) return;
        limparClasses(element); // Limpa cores de borda antigas
        const baseClasses = ['bg-white', 'p-6', 'rounded-xl', 'shadow-lg', 'border-t-4', 'flex', 'flex-col', 'justify-between', 'hover:-translate-y-1', 'transition-transform', 'duration-300'];
        element.classList.add(...baseClasses, newClass);
    };

    aplicarBorda(kpiSaudeCard, classeBordaSaude);
    aplicarBorda(kpiCargaCard, classeBordaCarga);
    aplicarBorda(kpiTempCard, classeBordaTemp);

    // 2. Aplica Cor do Ícone e Background do Ícone
    const aplicarIcone = (iconeEl, bgEl, iconeClass, bgClass) => {
        if (!iconeEl || !bgEl) return;
        limparClasses(iconeEl);
        limparClasses(bgEl);
        bgEl.classList.add('p-2', 'rounded-full', bgClass);
        iconeEl.classList.add(iconeClass);
    };

    aplicarIcone(kpiSaudeIcone, kpiSaudeIconeBg, classeIconeSaude, classeBgSaude);
    aplicarIcone(kpiCargaIcone, kpiCargaIconeBg, classeIconeCarga, classeBgCarga);
    aplicarIcone(kpiTempIcone, kpiTempIconeBg, classeIconeTemp, classeBgTemp);


    // -----------------------------------------------------
    // APLICAÇÃO DOS STATUS DE TEXTO
    // -----------------------------------------------------

    document.getElementById('kpi-saude-status').innerText = statusSaude;
    document.getElementById('kpi-saude-status').className = `text-xs font-bold ${classeSaude} px-2 py-1 rounded-full ml-2`;

    document.getElementById('kpi-carga-status').innerText = "Normal";
    document.getElementById('kpi-carga-status').className = `text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-2`;

    document.getElementById('kpi-temp-status').innerText = statusTemp;
    document.getElementById('kpi-temp-status').className = `text-xs font-bold ${classeTemp} px-2 py-1 rounded-full ml-2`;


    // --- Lógica de Alertas Recentes ---
    const listaAlertas = document.getElementById('listaAlertas');
    listaAlertas.innerHTML = '';
    let htmlAlertas = '';

    dadosDash.forEach(d => { // Usa os dados não agrupados
        const modelo = d.Modelo;
        const saude = d.Media_Saude;
        const temp = d.Media_Temperatura;

        if (!modelo || saude === undefined || temp === undefined) return;

        let tipoAlerta = null;
        let classeCard = '';
        let classeIcone = '';
        let icone = '';
        let mensagem = '';

        if (saude < 70 || temp > 40) {
            tipoAlerta = 'Crítico';
            classeCard = 'bg-red-50 border-red-500';
            classeIcone = 'text-red-500';
            icone = 'fa-solid fa-triangle-exclamation';
            mensagem = saude < 70 ? `Saúde Crítica: ${saude}%` : `Temp. Crítica: ${temp}°C`;

        } else if (saude < 85 || temp > 30) {
            tipoAlerta = 'Atenção';
            classeCard = 'bg-orange-50 border-orange-400';
            classeIcone = 'text-orange-500';
            icone = 'fa-solid fa-circle-exclamation';
            mensagem = saude < 85 ? `Saúde Baixa: ${saude}%` : `Temp. Alta: ${temp}°C`;
        }

        if (tipoAlerta) {
            htmlAlertas += `
                <div class="flex items-start gap-3 p-3 ${classeCard} rounded-lg border-l-4 hover:shadow-md transition-shadow">
                    <i class="${icone} ${classeIcone} mt-1"></i>
                    <div>
                        <p class="text-sm font-bold ${classeIcone.replace('500', '800')}">${modelo}</p>
                        <p class="text-xs ${classeIcone.replace('500', '600')}">${tipoAlerta}: ${mensagem}</p>
                    </div>
                </div>
            `;
        }
    });

    if (htmlAlertas === '') {
        htmlAlertas = `
            <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <i class="fa-solid fa-check-circle text-green-500 mt-1"></i>
                <div>
                    <p class="text-sm font-bold text-green-800">Sem Alertas</p>
                    <p class="text-xs text-green-600">A frota está operando dentro dos parâmetros normais.</p>
                </div>
            </div>
        `;
    }
    listaAlertas.innerHTML = htmlAlertas;
}