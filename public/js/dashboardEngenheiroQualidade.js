const ordemCores = ["vermelho", "laranja", "amarelo", "verde"];
var listaLotes;
function listarLotes() {
    console.log("Estou na função listarLotes...");
    var idsRegistrados = [];

    fetch(`/dashboard/listar/${sessionStorage.id_empresa_ss}`, { method: "GET" })
        .then(res => res.json())
        .then(json => {
            lotes.innerHTML = "";
            console.log("Entrei na resposta do fetch listar lotes");

            // Gera a cor de cada lote
            let listaLotes = json.map((lote, index) => ({
                ...lote,
                corStatus: gerarCorBolinha(index)
            }));

            // Ordena do mais crítico (vermelho) para menos crítico (verde)
            listaLotes.sort((a, b) => ordemCores.indexOf(a.corStatus) - ordemCores.indexOf(b.corStatus));

            // Renderiza os lotes
            for (let c = 0; c < listaLotes.length; c++) {
                const lote = listaLotes[c];
                const idLote = lote.idLote;

                if (idsRegistrados === idLote) continue;
                idsRegistrados.push(idLote);

                let modelo = lote.nomeModelo == null ? "N/A" : lote.nomeModelo;
                const corFundo = c % 2 === 0 ? "bg-black" : "bg-blue-900";

                lotes.innerHTML += `
                    <div class="${corFundo} p-4 rounded-lg text-white cards-lotes" 
                        onclick="abrirLote(${idLote})" 
                        style="cursor: pointer;">
                        <p>Lote: ${lote.codigo_lote}</p>
                        <p>Situação: ${lote.statusLote}</p>
                        <p>Modelo: ${modelo}</p>
                        <p>Status:</p>
                        <div class="bolinha ${lote.corStatus}"></div>

                        <div class="botoes">
                            <button onclick="event.stopPropagation(); buscarLote(${idLote})"
                                class="cursor-pointer w-150px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                Editar
                            </button>

                            <button onclick="event.stopPropagation(); removerLote(${idLote})"
                                class="cursor-pointer w-30px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                Remover
                            </button>
                        </div>
                    </div>
                `;
            }

            listarModelos();
        })
        .catch(err => console.error("Erro ao listar lotes:", err));
}

function gerarCorBolinha(index) {
    const cores = ["vermelho", "laranja", "amarelo", "verde"];
    return cores[index % cores.length];
}

function abrirLote(idLote) {
    // Guarda o lote selecionado
    localStorage.setItem('lote', idLote);

    // Recupera a dashboard selecionada do sessionStorage
    const dashboardSelecionada = sessionStorage.getItem("dashboardSelecionada");

    // Faz o redirecionamento de acordo com o valor salvo
    if (dashboardSelecionada === "EngenheiroQualidade") {
        window.location = "/dashboard/dashboardSaude.html";
    } else if (dashboardSelecionada === "EngenheiroProcesso") {
        window.location = "/dashboard/dashProcessos.html";
    } else if (dashboardSelecionada === "EngenheiroBateria") {
        window.location = "/dashboard/dashboardBateria.html"
    } else {
        // Caso não seja nenhum dos dois, mantém o padrão
        window.location = "/dashboard/lote.html";
    }
}

function filtrarModelo() {
    var filtroModelo = select_modelo.value;
    if (filtroModelo == "#") {
        listarLotes();
    } else {


        fetch(`/dashboard/filtroModelo/${filtroModelo}`, {
            method: "GET"
        }).then(res => {
            res.json().then(json => {
                console.log("Entrei na resposta do fetch do filtrar modelos")
                listaLotes = json;
                lotes.innerHTML = ""
                for (let c = 0; c < listaLotes.length; c++) {
                    let modelo = listaLotes[c].nomeModelo == null ? "N/A" : listaLotes[c].nomeModelo
                    lotes.innerHTML +=
                        `
               <div class="bg-blue-900 p-4 rounded-lg text-white cards-lotes" onclick="abrirLote(${json[c].idLote})" style="cursor: pointer;">
                        <p>Lote: ${listaLotes[c].codigo_lote}</p>
                        <p>Situação: ${listaLotes[c].statusLote}</p>
                        <p>Modelo: ${modelo}</p>
                        <p>Status:</p>
                        <div class="bolinha"></div>

                        <div class="botoes">
                            <button onclick="event.stopPropagation(); buscarLote(${c + 1})"
                            class="cursor-pointer w-150px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                            Editar
                            </button>

                            <button onclick="event.stopPropagation(); removerLote(${json[c].idLote})"
                            class="cursor-pointer w-30px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                            Remover
                            </button>
                        </div>
                    </div>
                `
                }
            })
        })
    }

}

function buscarLote(idLote) {

    fetch(`/dashboard/buscarLoteparaEditar/${idLote}`, {
        method: "GET"
    }).then(res => res.json())
        .then(json => {
            console.log("Entrei na resposta do fetch do buscar lote para editar...");

            const lote = json[0];
            const dataFabricacao = new Date(lote.data_fabricacao);

            // Formata no padrão yyyy-mm-dd para input[type=date]
            const dataFormatadaInput = `${dataFabricacao.getFullYear()}-${String(dataFabricacao.getMonth() + 1).padStart(2, '0')}-${String(dataFabricacao.getDate()).padStart(2, '0')}`;

            criarEditar.innerHTML = `
            <dialog id="lote${idLote}" class="editarLote rounded-md w-1/3 p-6">
                <h2 class="text-xl font-bold mb-4">Editar Lote: ${lote.codigo_lote}</h2>

                <label class="block mb-2 font-semibold">Código do Lote:</label>
                <input type="text" id="codigoLote${idLote}" value="${lote.codigo_lote}" class="w-full border rounded-md p-2 mb-4">

                <label class="block mb-2 font-semibold">Data de fabricação:</label>
                <input type="date" id="dataFabricacao${idLote}" value="${dataFormatadaInput}" class="w-full border rounded-md p-2 mb-4">

                <div class="flex justify-end gap-2 mt-4">
                    <button onclick="fecharDialog(${idLote})" class="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">Cancelar</button>
                    <button onclick="salvarLote(${idLote})" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
                </div>
            </dialog>
        `;
            // <label class="block mb-2 font-semibold">Quantidade de veículos:</label>
            // <input type="number" id="qtdVeiculos${idLote}" value="${lote.qtd_veiculos}" class="w-full border rounded-md p-2 mb-4"></input>

            const dialog = document.getElementById(`lote${idLote}`);
            if (dialog) dialog.showModal();
            else console.error("Dialog não encontrado!");
        })
        .catch(erro => console.error("Erro ao buscar lote:", erro));
}

function fecharDialog(idLote) {
    const dialog = document.getElementById(`lote${idLote}`);
    if (dialog) dialog.close();
}

function salvarLote(idLote) {
    const codigoLote = document.getElementById(`codigoLote${idLote}`).value;
    const dataFabricacao = document.getElementById(`dataFabricacao${idLote}`).value;
    //const qtdVeiculos = document.getElementById(`qtdVeiculos${idLote}`).value;
    console.log(codigoLote)
    fetch(`/dashboard/editarLote/${idLote}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            codigo_lote: codigoLote,
            data_fabricacao: dataFabricacao
            // qtd_veiculos: qtdVeiculos
        })
    }).then(res => res.json())
        .then(json => {
            console.log("Entrei na resposta do fetch de editar lote...")

        })
}


function listarModelos() {
    fetch(`/dashboard/listarModelos`, {
        method: "GET"
    }).then(res => {
        res.json().then(json => {
            console.log("Entrei na resposta do fetch do listar modelos")

            modelos = json;
            select_modelo.innerHTML = "<option value='#'>Selecione</option>"
            for (let c = 0; c < modelos.length; c++) {
                select_modelo.innerHTML +=
                    `
                <option value="${c + 1}">${modelos[c].nome}</option>
                `
            }
        })
    })

}

function filtrar() {
    const filtroStatus = select_Status.value;
    const filtroOrdem = document.getElementById("ordem").value;
    const ordemCores = ["vermelho", "laranja", "amarelo", "verde"];

    fetch(`/dashboard/listar/${sessionStorage.id_empresa_ss}`, { method: "GET" })
        .then(res => res.json())
        .then(json => {
            let listaLotes = json;
            lotes.innerHTML = "";
            const idsRegistrados = [];

            // Gera a cor de cada lote usando a função já existente
            listaLotes = listaLotes.map((lote, index) => ({
                ...lote,
                corStatus: gerarCorBolinha(index)
            }));

            // Ordena pelo critério de cores
            if (filtroOrdem === "asc") {
                listaLotes.sort((a, b) => ordemCores.indexOf(b.corStatus) - ordemCores.indexOf(a.corStatus));
            } else if (filtroOrdem === "desc") {
                listaLotes.sort((a, b) => ordemCores.indexOf(a.corStatus) - ordemCores.indexOf(b.corStatus));
            }

            // Renderiza os lotes
            for (let c = 0; c < listaLotes.length; c++) {
                const lote = listaLotes[c];
                const idLote = lote.idLote;

                if (idsRegistrados === idLote) continue;
                idsRegistrados.push(idLote);

                const modelo = lote.nomeModelo ?? "N/A";
                const corFundo = c % 2 === 0 ? "bg-black" : "bg-blue-900";

                // Filtra pelo status se houver seleção
                if (filtroStatus === "#" || lote.statusLote === traduzirStatus(filtroStatus)) {
                    lotes.innerHTML += `
                        <div class="${corFundo} p-4 rounded-lg text-white cards-lotes" 
                             onclick="abrirLote(${idLote})" 
                             style="cursor: pointer;">
                            <p>Lote: ${lote.codigo_lote}</p>
                            <p>Situação: ${lote.statusLote}</p>
                            <p>Modelo: ${modelo}</p>
                            <p>Status:</p>
                            <div class="bolinha ${lote.corStatus}"></div>

                            <div class="botoes">
                                <button onclick="event.stopPropagation(); buscarLote(${c + 1})"
                                    class="cursor-pointer w-150px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Editar
                                </button>

                                <button onclick="event.stopPropagation(); removerLote(${idLote})"
                                    class="cursor-pointer w-30px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Remover
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        });
}


function pesquisar() {
    const conteudo = ipt_pesquisa.value.trim().toLowerCase();
    const idsRegistrados = [];

    fetch(`/dashboard/listar/${sessionStorage.id_empresa_ss}`, { method: "GET" })
        .then(res => res.json())
        .then(json => {
            const listaLotes = json;
            lotes.innerHTML = "";

            if (conteudo === "") {
                listarLotes();
                return;
            }

            for (let c = 0; c < listaLotes.length; c++) {
                const lote = listaLotes[c];
                const idLote = lote.idLote;

                // Evita duplicados
                if (idsRegistrados === idLote) continue;
                idsRegistrados.push(idLote);

                const modelo = lote.nomeModelo == null ? "N/A" : lote.nomeModelo;

                // Pesquisa por nome do modelo ou código do lote
                const codigo = lote.codigo_lote?.toLowerCase() || "";
                const nomeModelo = lote.nomeModelo?.toLowerCase() || "";

                if (codigo.includes(conteudo) || nomeModelo.includes(conteudo)) {
                    const corFundo = c % 2 === 0 ? "bg-black" : "bg-blue-900";

                    lotes.innerHTML += `
                        <div class="${corFundo} p-4 rounded-lg text-white cards-lotes" 
                            onclick="abrirLote(${idLote})" style="cursor: pointer;">
                            <p>Lote: ${lote.codigo_lote}</p>
                            <p>Situação: ${lote.statusLote}</p>
                            <p>Modelo: ${modelo}</p>
                            <p>Status:</p>
                            <div class="bolinha"></div>

                            <div class="botoes">
                                <button onclick="event.stopPropagation(); buscarLote(${c + 1})"
                                    class="cursor-pointer w-150px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Editar
                                </button>

                                <button onclick="event.stopPropagation(); removerLote(${idLote})"
                                    class="cursor-pointer w-30px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Remover
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        })
        .catch(err => console.error("Erro na pesquisa:", err));
}

function filtrarPorData() {
    const dataSelecionada = document.getElementById("data").value;
    const idsRegistrados = [];

    if (!dataSelecionada) {
        listarLotes();
        return;
    }

    fetch(`/dashboard/listar/${sessionStorage.id_empresa_ss}`, { method: "GET" })
        .then(res => res.json())
        .then(json => {
            const listaLotes = json;
            lotes.innerHTML = "";

            // Normaliza a data selecionada
            const dataFiltro = new Date(dataSelecionada).toISOString().split("T")[0];

            for (let c = 0; c < listaLotes.length; c++) {
                const lote = listaLotes[c];
                const idLote = lote.idLote;

                // Evita duplicados
                if (idsRegistrados === idLote) continue;
                idsRegistrados.push(idLote);

                // Normaliza a data do lote
                const dataLote = new Date(lote.data_fabricacao).toISOString().split("T")[0];

                // Se as datas coincidirem
                if (dataLote === dataFiltro) {
                    const modelo = lote.nomeModelo == null ? "N/A" : lote.nomeModelo;
                    const corFundo = c % 2 === 0 ? "bg-black" : "bg-blue-900";

                    lotes.innerHTML += `
                         <div class="${corFundo} p-4 rounded-lg text-white cards-lotes" 
                            onclick="abrirLote(${idLote})" style="cursor: pointer;">
                            <p>Lote: ${lote.codigo_lote}</p>
                            <p>Situação: ${lote.statusLote}</p>
                            <p>Modelo: ${modelo}</p>
                            <p>Status:</p>
                            <div class="bolinha"></div>

                            <div class="botoes">
                                <button onclick="event.stopPropagation(); buscarLote(${c + 1})"
                                    class="cursor-pointer w-150px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Editar
                                </button>

                                <button onclick="event.stopPropagation(); removerLote(${idLote})"
                                    class="cursor-pointer w-30px bg-white border-2 border-blue-900 text-black rounded-md text-center py-2 hover:text-blue-900 hover:font-medium">
                                    Remover
                                </button>
                            </div>
                        </div>
                    `;
                }
            }

            // Se nada foi encontrado
            if (lotes.innerHTML === "") {
                lotes.innerHTML = `<p class="text-gray-500 mt-4">Nenhum lote encontrado para essa data.</p>`;
            }
        })
        .catch(err => console.error("Erro ao filtrar por data:", err));
}
function traduzirStatus(filtroStatus) {
    if (filtroStatus === "ati") return "Ativo";
    if (filtroStatus === "man") return "Manutenção";
    if (filtroStatus === "ina") return "Inativo";
    return null;
}


