const ordemCores = ["vermelho", "laranja", "amarelo", "verde"];
var listaCompletaLotes = []; // Armazena todos os lotes para evitar fetchs repetidos desnecessários

// Mapeamento de classes para as cores (Borda lateral e badge)
const coresMap = {
"vermelho": "border-red-500",
"laranja": "border-orange-500",
"amarelo": "border-yellow-400",
"verde": "border-green-500"
};

const badgeMap = {
"vermelho": "bg-red-100 text-red-700",
"laranja": "bg-orange-100 text-orange-800",
"amarelo": "bg-yellow-100 text-yellow-800",
"verde": "bg-green-100 text-green-700"
};

function listarLotes() {
console.log("Estou na função listarLotes...");

fetch(`/dashboard/listar/${sessionStorage.id_empresa_ss}`, { method: "GET" })
.then(res => res.json())
.then(json => {
console.log("Entrei na resposta do fetch listar lotes");

// Processa os dados adicionando a cor baseada no índice (regra do seu negócio)
listaCompletaLotes = json.map((lote, index) => ({
...lote,
corStatus: gerarCorBolinha(index)
}));

// Ordena inicial (Crítico -> Leve)
listaCompletaLotes.sort((a, b) => ordemCores.indexOf(a.corStatus) - ordemCores.indexOf(b.corStatus));

// Renderiza na tela
renderizarLotes(listaCompletaLotes);
})
.catch(err => console.error("Erro ao listar lotes:", err));
}

// --- FUNÇÃO CENTRAL PARA GERAR O HTML (Visual Novo) ---
function renderizarLotes(lista) {
const container = document.getElementById("lotes");
const contador = document.getElementById("contadorLotes");

container.innerHTML = "";
const idsRegistrados = [];

// Atualiza o contador de itens
if (contador) contador.innerText = `Total: ${lista.length}`;

if (lista.length === 0) {
container.innerHTML = `
<div class="p-4 text-center text-gray-500">
<i class='bx bx-info-circle text-2xl mb-2'></i>
<p>Nenhum lote encontrado.</p>
</div>`;
return;
}

lista.forEach(lote => {
// Evita duplicatas
if (idsRegistrados.includes(lote.idLote)) return;
idsRegistrados.push(lote.idLote);

let modelo = lote.nomeModelo == null ? "N/A" : lote.nomeModelo;

// Classes de cor baseadas na regra da bolinha
const classeBorda = coresMap[lote.corStatus] || "border-gray-300";

// Define a cor do badge de Status (Ativo/Inativo)
let badgeStatus = "bg-gray-100 text-gray-600";
if (lote.statusLote === 'Ativo') badgeStatus = "bg-green-100 text-green-700";
if (lote.statusLote === 'Manutenção') badgeStatus = "bg-yellow-100 text-yellow-800";
if (lote.statusLote === 'Inativo') badgeStatus = "bg-red-100 text-red-700";

// HTML do Card em formato de Linha/Lista
container.innerHTML += `
<div class="grid grid-cols-5 gap-4 items-center p-4 rounded-md bg-white text-gray-900 shadow-sm hover:shadow-md transition-all cursor-pointer mb-2"
onclick="abrirLote(${lote.idLote})">
<div class="font-bold text-gray-800 text-sm truncate flex flex-col">
<span class="text-xs text-gray-500 font-normal">Lote</span>
${lote.codigo_lote}
</div>
<div class="text-gray-600 text-sm flex items-center gap-1">
<i class='bx bx-calendar text-gray-400'></i>
${lote.data_fabricacao ? formatarData(lote.data_fabricacao) : "--/--/----"}
</div>
<div class="text-center">
<span class="px-3 py-1 rounded-full text-xs font-bold ${badgeStatus}">
${lote.statusLote}
</span>
</div>

<div class="text-right flex justify-end gap-2">
<button onclick="event.stopPropagation(); buscarLote(${lote.idLote})"
class="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
<i class='bx bx-edit-alt text-lg'></i>
</button>

<button onclick="event.stopPropagation(); removerLote(${lote.idLote})"
class="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors" title="Remover">
<i class='bx bx-trash text-lg'></i>
</button>
</div>
</div>
`;
});
}

// --- FUNÇÕES DE LÓGICA ---

function gerarCorBolinha(index) {
const cores = ["vermelho", "laranja", "amarelo", "verde"];
return cores[index % cores.length];
}

function formatarData(dataISO) {
if (!dataISO) return "";
const data = new Date(dataISO);
return data.toLocaleDateString('pt-BR');
}

function abrirLote(idLote) {
localStorage.setItem('lote', idLote);
const dashboardSelecionada = sessionStorage.getItem("dashboardSelecionada");

if (dashboardSelecionada === "EngenheiroQualidade") {
window.location = "/dashboard/dashboardSaude.html";
} else if (dashboardSelecionada === "EngenheiroProcesso") {
window.location = "/dashboard/dashProcessos.html";
} else if (dashboardSelecionada === "EngenheiroBateria") {
window.location = "/dashboard/dashboardBateria.html"
} else {
window.location = "/dashboard/lote.html";
}
}

// --- FILTROS E PESQUISA ---

function filtrar() {
const filtroStatus = document.getElementById("select_Status").value;
const filtroOrdem = document.getElementById("ordem").value;

// 1. Filtra a lista completa (cópia)
let listaFiltrada = listaCompletaLotes.filter(lote => {
if (filtroStatus === "#") return true;
return lote.statusLote === traduzirStatus(filtroStatus);
});

// 2. Ordena a lista filtrada
if (filtroOrdem === "asc") {
// Verde -> Vermelho
listaFiltrada.sort((a, b) => ordemCores.indexOf(b.corStatus) - ordemCores.indexOf(a.corStatus));
} else {
// Vermelho -> Verde
listaFiltrada.sort((a, b) => ordemCores.indexOf(a.corStatus) - ordemCores.indexOf(b.corStatus));
}

// 3. Renderiza
renderizarLotes(listaFiltrada);
}

function pesquisar() {
const conteudo = document.getElementById("ipt_pesquisa").value.trim().toLowerCase();

if (conteudo === "") {
renderizarLotes(listaCompletaLotes);
return;
}

const listaFiltrada = listaCompletaLotes.filter(lote => {
const codigo = lote.codigo_lote?.toLowerCase() || "";
const nomeModelo = lote.nomeModelo?.toLowerCase() || "";
return codigo.includes(conteudo) || nomeModelo.includes(conteudo);
});

renderizarLotes(listaFiltrada);
}

function filtrarPorData() {
const dataSelecionada = document.getElementById("data").value;

if (!dataSelecionada) {
renderizarLotes(listaCompletaLotes);
return;
}

// Normaliza a data do input (YYYY-MM-DD)
const dataFiltro = new Date(dataSelecionada).toISOString().split("T")[0];

const listaFiltrada = listaCompletaLotes.filter(lote => {
if (!lote.data_fabricacao) return false;
const dataLote = new Date(lote.data_fabricacao).toISOString().split("T")[0];
return dataLote === dataFiltro;
});

renderizarLotes(listaFiltrada);
}

function traduzirStatus(filtroStatus) {
if (filtroStatus === "ati") return "Ativo";
if (filtroStatus === "man") return "Manutenção";
if (filtroStatus === "ina") return "Inativo";
return null;
}

// --- EDIÇÃO E REMOÇÃO ---

function buscarLote(idLote) {
fetch(`/dashboard/buscarLoteparaEditar/${idLote}`, { method: "GET" })
.then(res => res.json())
.then(json => {
console.log("Editando lote...");
const lote = json[0];
const dataFabricacao = new Date(lote.data_fabricacao);
const dataFormatadaInput = dataFabricacao.toISOString().split('T')[0];

const divCriarEditar = document.getElementById("criarEditar");

divCriarEditar.innerHTML = `
<dialog id="loteDialog" class="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 backdrop:bg-gray-900/50">
<div class="flex justify-between items-center mb-6">
<h2 class="text-xl font-bold text-gray-800">Editar Lote</h2>
<button onclick="fecharDialog()" class="text-gray-400 hover:text-gray-600"><i class='bx bx-x text-2xl'></i></button>
</div>

<label class="block mb-1 text-sm font-semibold text-gray-600">Código do Lote</label>
<input type="text" id="inputCodigoLote" value="${lote.codigo_lote}"
class="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none">

<label class="block mb-1 text-sm font-semibold text-gray-600">Data de fabricação</label>
<input type="date" id="inputDataFabricacao" value="${dataFormatadaInput}"
class="w-full border border-gray-300 rounded-md p-2 mb-6 focus:ring-2 focus:ring-blue-500 outline-none">

<div class="flex justify-end gap-3">
<button onclick="fecharDialog()"
class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button>
<button onclick="salvarLote(${lote.idLote})"
class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm">Salvar Alterações</button>
</div>
</dialog>
`;

const dialog = document.getElementById("loteDialog");
dialog.showModal();
})
.catch(erro => console.error("Erro ao buscar lote:", erro));
}

function fecharDialog() {
const dialog = document.getElementById("loteDialog");
if (dialog) dialog.close();
}

function salvarLote(idLote) {
const codigoLote = document.getElementById("inputCodigoLote").value;
const dataFabricacao = document.getElementById("inputDataFabricacao").value;

fetch(`/dashboard/editarLote/${idLote}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
codigo_lote: codigoLote,
data_fabricacao: dataFabricacao
})
}).then(res => res.json())
.then(json => {
Swal.fire({
icon: 'success',
title: 'Sucesso!',
text: 'Lote atualizado com sucesso.',
confirmButtonColor: '#1e3a8a'
}).then(() => {
fecharDialog();
listarLotes(); // Recarrega a lista
});
})
.catch(err => {
console.error(err);
Swal.fire('Erro', 'Não foi possível atualizar o lote.', 'error');
});
}

function removerLote(idLote) {
Swal.fire({
title: 'Tem certeza?',
text: "Você não poderá reverter isso!",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Sim, remover!',
cancelButtonText: 'Cancelar'
}).then((result) => {
if (result.isConfirmed) {
// Aqui você faria o fetch de delete
// fetch(`/dashboard/deletarLote/${idLote}`, { method: "DELETE" })...
console.log(`Lote ${idLote} removido (simulação)`);

// Simulação de remoção visual
listaCompletaLotes = listaCompletaLotes.filter(l => l.idLote !== idLote);
renderizarLotes(listaCompletaLotes);

Swal.fire('Removido!', 'O lote foi removido.', 'success');
}
})
}

