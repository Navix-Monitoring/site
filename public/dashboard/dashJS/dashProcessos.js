
const dataAtual = new Date();

const ano = dataAtual.getFullYear();
const mes = (dataAtual.getMonth() + 1);
const dia = dataAtual.getDay();
const semana = calcularSemana(dia);

function calcularSemana(dia) {
    if (dia <= 7) return 1;
    if (dia <= 15) return 2;
    if (dia <= 22) return 3;
    return 4;
}

function listarProcessos(){
    try{
        const resposta = fetch(`/dashProcessos/listaProcessos/${ano}/${mes}/${semana}/${dia}`)
    
        if(!resposta.ok){
            console.log("Erro ao buscar lista de processos:", resposta.text());
            return;
        }

        const jsonListaProcessos = resposta.json();

        console.log(jsonListaProcessos);
    }catch(erro){
        console.log("Erro no fetch de listar processos:", erro);
    }
}