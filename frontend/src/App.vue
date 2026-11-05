<script setup>
import { ref, onBeforeUnmount } from "vue";
import { evoluirGrade } from "./services/jogoService";

import Grade from "./components/Grade.vue";
import Button from "./components/Button.vue";
import Metrics from "./components/Metrics.vue";

const gradeRef = ref(null);
const simulando = ref(false);
let intervalo = null;
let processando = false;

async function executarGeracao() {
  if(processando || !simulando.value) return;

  processando = true;

  try {
    const gradeAtual = gradeRef.value.obterGrade();
    const proximaGrade = await evoluirGrade(gradeAtual);
    gradeRef.value.atualizarGrade(proximaGrade);
  } catch(erro) {
    console.error("Erro na simulação: ", erro);
    clearInterval(intervalo);
    intervalo = null;
    simulando.value = false;
  } finally {
    processando = false;
  }
}

function iniciarSimulacao() {
  if(simulando.value) {
    clearInterval(intervalo);
    intervalo = null;
    simulando.value = false;
  } else {
    simulando.value = true;
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
          <Grade ref="gradeRef" :simulando="simulando"/>
        </main>
        <Button @click="iniciarSimulacao">{{ simulando ? "Pausar simulação" : "Iniciar Simulação"}}</Button>
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
</style>
