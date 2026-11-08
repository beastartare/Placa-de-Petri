<script setup>
import { ref } from "vue";

const tam = ref(10);
const props = defineProps({
  simulando: Boolean,
});

const grade = ref(
  Array.from(
    { length: tam.value },
    () => Array(tam.value).fill(false)
  )
);
const emit = defineEmits(["alterada"]);

function adicionarCelula(linha, coluna) {
  if(props.simulando) return;

  grade.value[linha][coluna] = !grade.value[linha][coluna];
  emit("alterada");
}

function obterGrade() {
  return grade.value.map((linha) => [...linha]);
}

function atualizarGrade(novaGrade) {
  grade.value = novaGrade;
}

function alterarTamanho() {
  if (tam.value < 1) {
    tam.value = 1;
  }

  if (tam.value > 30) {
    tam.value = 30;
  }

  let novaGrade = [];

  for (let linha = 0; linha < tam.value; linha++) {
    let novaLinha = [];

    for (let coluna = 0; coluna < tam.value; coluna++) {
      novaLinha.push(false);
    }

    novaGrade.push(novaLinha);
  }

  grade.value = novaGrade;
  emit("alterada");
}

defineExpose({
  obterGrade,
  atualizarGrade,
});
</script>

<template>
  <div class="grade">
    <h3>Grade:</h3>

    <label>
      Tamanho da grade:
      <input
        type="number"
        v-model="tam"
        min="1"
        max="30"
        @change="alterarTamanho"
        :disabled="props.simulando"
      />
    </label>

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
