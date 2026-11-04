<script setup>
import { ref } from "vue";

const tam = 10;
const grade = ref(Array.from({ length: tam }, () => Array(tam).fill(false)));

function adicionarCelula(linha, coluna) {
  grade.value[linha][coluna] = !grade.value[linha][coluna];
}
</script>

<template>
  <div class="grade">
    <h3>Grade:</h3>

    <div
      class="tabuleiro"
      :style="{
        gridTemplateColumns: `repeat(${tam}, 1fr)`,
      }"
    >
      <template v-for="(linha, indiceLinha) in grade" :key="indiceLinha">
        <div
          v-for="(celula, indiceColuna) in linha"
          :key="indiceColuna"
          class="celula"
          :class="{ viva: celula }"
          @click="adicionarCelula(indiceLinha, indiceColuna)"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #d20066;
}

.tabuleiro {
  display: grid;
  width: min(80vw, 500px);
  aspect-ratio: 1;
  gap: 3px;
}

.celula {
  background-color: #41495b;
  border: 1px solid #555e70;
  border-radius: 2px;
}

.celula.viva {
  background-color: #d20066;
}
</style>
