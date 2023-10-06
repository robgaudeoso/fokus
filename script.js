const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const image = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const musicaFocoInput = document.querySelector("#alternar-musica");
const iniciarOuPausarBt = document.querySelector("#start-pause span");
const iconIniciarOuPausar = document.querySelector(
    ".app__card-primary-button-icon"
);
const timer = document.querySelector("#timer");

const musica = new Audio("./sons/luna-rise-part-one.mp3");
const somPlay = new Audio("./sons/play.wav");
const somPause = new Audio("./sons/pause.mp3");
const somZero = new Audio("./sons/beep.mp3");

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener("change", () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto("foco");
});

curtoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto("descanso-curto");
});

longoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto("descanso-longo");
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (target) {
        target.classList.remove("active");
    });
    html.setAttribute("data-contexto", contexto);
    image.setAttribute("src", `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            focoBt.classList.add("active");
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            curtoBt.classList.add("active");
            console.log(tempoDecorridoEmSegundos);
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            longoBt.classList.add("active");
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        somZero.play();
        alert("Tempo finalizado!");
        zerar();

        const focoAtivo = html.getAttribute("data-contexto") === "foco";
        if (focoAtivo) {
            var event = new CustomEvent("TarefaFinalizada", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(event);
            tempoDecorridoEmSegundos = 3;
            mostrarTempo();
        }
        return;
    }
    tempoDecorridoEmSegundos--;
    mostrarTempo();
};

startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar();
        somPause.play();
        return;
    }
    somPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iconIniciarOuPausar.setAttribute("src", "./imagens/pause.png");
    iniciarOuPausarBt.textContent = "Pausar";
}

function zerar() {
    clearInterval(intervaloId);
    iconIniciarOuPausar.setAttribute("src", "./imagens/play_arrow.png");
    iniciarOuPausarBt.textContent = "Começar";
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleString("pt-Br", {
        minute: "2-digit",
        second: "2-digit",
    });
    timer.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
