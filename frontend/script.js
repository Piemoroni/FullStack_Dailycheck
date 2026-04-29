const url = "http://localhost:3000/tarefas";
const key = "648c9e4ef64735fd4b4f0db1222f825f";

const tarefas = [];

function carregarTarefas() {
    fetch(url + "/listar")
    .then(res => res.json())
    .then(data => {
        tarefas.length = 0;
        tarefas.push(...data);
        mostrarTarefas();
    });
}

function mostrarTarefas(lista = tarefas) {
    const container = document.getElementById("tarefas-container");
    if (!container) return;

    container.innerHTML = "";

    lista.forEach(t => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h2>${t.nome}</h2>
            <p>Início: ${new Date(t.inicio).toLocaleDateString()}</p>
            <p>Fim: ${new Date(t.fim).toLocaleDateString()}</p>
            <p>${t.descricao}</p>
            <button class="btn-excluir" onclick="excluirTarefa(${t.id})">Excluir</button>
        `;

        container.appendChild(card);
    });
}

function excluirTarefa(id) {
    fetch(url + "/excluir/" + id, { method: "DELETE" })
    .then(() => carregarTarefas());
}

function salvarTarefa() {
    const nome = document.getElementById("nome").value;
    const inicio = document.getElementById("inicio").value;
    const fim = document.getElementById("fim").value;
    const descricao = document.getElementById("descricao").value;

    if (!nome || !inicio || !fim || !descricao) {
        alert("Preencha tudo!");
        return;
    }

    fetch(url + "/cadastrar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome,
            inicio: new Date(inicio),
            fim: new Date(fim),
            descricao
        })
    })
    .then(() => {
        document.getElementById("modal").style.display = "none";
        carregarTarefas();
    });
}

function abrirModal() {
    document.getElementById("modal").style.display = "block";
}

async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
    .then(res => res.json());

    criarCardClima(dados);
}

function criarCardClima(dados) {
    const container = document.getElementById("clima-container");

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h2 class="cidade">${dados.name}</h2>
        <p class="temp">${Math.floor(dados.main.temp)} °C</p>
        <div class="caixa-menor">
            <img src="https://openweathermap.org/img/wn/${dados.weather[0].icon}.png">
            <p class="texto-previsao">${dados.weather[0].description}</p>
        </div>
        <p class="umidade">Umidade: ${dados.main.humidity}%</p>
    `;

    container.appendChild(card);
}

function cliqueiNoBotao() {
    const cidade = document.querySelector(".input-cidade").value;
    buscarCidade(cidade);
}

function apagarCards() {
    const container = document.getElementById("clima-container");
    if (container) container.innerHTML = "";
}

carregarTarefas();