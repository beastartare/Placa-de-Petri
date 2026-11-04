<script setup>
import Grade from "./components/Grade.vue";
import Button from "./components/Button.vue";
</script>

<template>
  <div class="app">
    <header>
      <h1>Simulador de Placa de Petri</h1>
      <p>Instruções: adicione uma célula em um dos campos abaixo.</p>
    </header>

    <main>
      <Grade />
    </main>
    <Button>Iniciar Simulação</Button>
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
  text-align: center;
  margin-bottom: 30px;
}

main {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
