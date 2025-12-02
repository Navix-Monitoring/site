async function listaProcessos(url){
    console.log("Entrei no model listar processos")

    try{
        const resposta = await fetch(url);
        if(!resposta.ok){
            console.log("Erro ao buscar lista de processos:", resposta.status);
            return null;
        }
        return await resposta.json();
    }catch(erro){
        console.log("Erro no fetch:", erro);
        return null;
    }
}

module.exports = {
    listaProcessos
}