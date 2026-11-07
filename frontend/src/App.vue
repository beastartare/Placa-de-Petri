<script setup>
import { ref, onBeforeUnmount } from "vue";
import { evoluirGrade } from "./services/jogoService";

import Grade from "./components/Grade.vue";
import Button from "./components/Button.vue";
import Metrics from "./components/Metrics.vue";

const gradeRef = ref(null);
const simulando = ref(false);
const mensagem = ref("");

let intervalo = null;
let processando = false;
const numGeracoes = ref(0);

function alterarConfiguracao() {
  numGeracoes.value = 0;
  mensagem.value = "";
}

function pausarSimulacao() {
  clearInterval(intervalo);
  intervalo = null;
  simulando.value = false;
}

function reiniciarSimulacao() {
  pausarSimulacao();

  let gradeAtual = gradeRef.value.obterGrade();
  let gradeVazia = [];

  for (let linha = 0; linha < gradeAtual.length; linha++) {
    let novaLinha = [];

    for (let coluna = 0; coluna < gradeAtual[linha].length; coluna++) {
      novaLinha.push(false);
    }

    gradeVazia.push(novaLinha);
  }

  gradeRef.value.atualizarGrade(gradeVazia);
  numGeracoes.value = 0;
  mensagem.value = "";
}

async function executarGeracao() {
  if(processando) return;

  processando = true;

  try {
    const gradeAtual = gradeRef.value.obterGrade();
    const proximaGrade = await evoluirGrade(gradeAtual);
    gradeRef.value.atualizarGrade(proximaGrade);
    numGeracoes.value++;
    console.log(numGeracoes.value);

    const existemCelulasVivas = proximaGrade.some(
      linha => linha.some(celula => celula)
    );

    if(!existemCelulasVivas) {
      pausarSimulacao();
      mensagem.value = "A simulação foi encerrada: não há mais células vivas.";
    }

  } catch(erro) {
    console.error("Erro na simulação: ", erro);
    mensagem.value = "Ocorreu um erro ao evoluir a grade.";
    pausarSimulacao();
  } finally {
    processando = false;
  }
}

function iniciarSimulacao() {
  if(simulando.value) {
    pausarSimulacao();
  } else {
    simulando.value = true;
    mensagem.value = "";
    intervalo = setInterval(() => {
      executarGeracao();
    }, 500);
  }
}

onBeforeUnmount(() => {
  clearInterval(intervalo);
});

</script>

<template>
  <div class="app">
    <div class="conteudo">
      <div class="simulador">
        <header>
          <h1>Simulador de Placa de Petri</h1>
          <p>Instruções: adicione uma célula em um dos campos abaixo.</p>
        </header>
        <main>
          <Grade ref="gradeRef" :simulando="simulando" @alterada="alterarConfiguracao"/>
        </main>
        <Button @click="iniciarSimulacao">{{ simulando ? "Pausar simulação" : "Iniciar Simulação"}}</Button>
        <p v-if="mensagem" class="mensagem"> {{ mensagem }} </p>
        <Button v-if="!simulando" @click="executarGeracao">
          Avançar uma geração
        </Button>
        <Button @click="reiniciarSimulacao">
          Reiniciar
        </Button>
      </div>
      <aside class="metricas">
        <Metrics />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

header {
  text-align: left;
  margin-bottom: 30px;
}

main {
  width: 100%;
  display: flex;
  justify-content: center;
}

.conteudo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1100px;
  gap: 40px;
}

.simulador {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.metricas {
  width: 250px;
  flex-shrink: 0;
}

.mensagem {
    margin-top: 15px;
    padding: 12px;
    color: #b00020;
    font-weight: bold;
    text-align: center;
}
</style>
