<script>
export default {
  props: ["numGeracoes", "numCelulasVivas"],
};
</script>

<template>
  <div class="metrics">
    <h2>Métricas</h2>
    <div class="metric-item">
      <p>Geração atual</p>
      <strong>{{ numGeracoes }}</strong>
    </div>
    <div class="metric-item">
      <p>Células vivas</p>
      <strong>{{ numCelulasVivas }}</strong>
    </div>
  </div>
</template>

<style scoped>
.metrics {
  background-color: #d20066;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 280px;
  box-sizing: border-box;
  border-radius: 10px;
  color: #fafafa;
  padding: 25px 20px;
  margin-top: 0;
  font-size: 18px;
  gap: 20px;
}

.metrics h2 {
  font-size: 24px;
  margin: 0 0 5px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 10px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 8px;
}

.metric-item p {
  margin: 0 0 12px;
  font-size: 15px;
}

.metric-item strong {
  font-size: 32px;
  font-weight: 700;
}
</style>