<script setup>
import Grade from "./components/Grade.vue";
import Button from "./components/Button.vue";
import Metrics from "./components/Metrics.vue";
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
          <Grade />
        </main>
        <Button>Iniciar Simulação</Button>
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
