<script>
export default {
  props: ["numGeracoes", "numCelulasVivas"],
};
</script>

<template>
  <div class="metrics">
    <h1>Métricas</h1>
    <p>Geração atual: {{ numGeracoes }}</p>
    <p>Células vivas: {{ numCelulasVivas }}</p>
  </div>
</template>

<style scoped>
.metrics {
  background-color: #d20066;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 800px;
  border-radius: 5px;
  color: #fafafa;
  margin-top: 20px;
  font-size: 20px;
  justify-content: flex-start;
}

.metrics p {
  margin-top: 100px;
}
</style>
