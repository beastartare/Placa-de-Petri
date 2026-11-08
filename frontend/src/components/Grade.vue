<script setup>
import { ref } from "vue";

const tam = ref(10);

const props = defineProps({
  simulando: Boolean,
  editando: Boolean,
});

const emit = defineEmits(["alterada"]);

const grade = ref(
  Array.from(
    { length: tam.value },
    () => Array(tam.value).fill(false)
  )
);

function adicionarCelula(linha, coluna) {
  if (props.simulando || !props.editando) return;

  grade.value[linha][coluna] = !grade.value[linha][coluna];
  emit("alterada");
}

function obterGrade() {
  return grade.value.map((linha) => [...linha]);
}

function atualizarGrade(novaGrade) {
  grade.value = novaGrade;
  tam.value = novaGrade.length;
}

function alterarTamanho() {
  if (tam.value < 3) {
    tam.value = 3;
  }

  if (tam.value > 30) {
    tam.value = 30;
  }

  const novaGrade = [];

  for (let linha = 0; linha < tam.value; linha++) {
    const novaLinha = [];

    for (let coluna = 0; coluna < tam.value; coluna++) {
      novaLinha.push(false);
    }

    novaGrade.push(novaLinha);
  }

  grade.value = novaGrade;
  emit("alterada");
}

function diminuirTamanho() {
  if (props.simulando || !props.editando || tam.value <= 1) return;

  tam.value--;
  alterarTamanho();
}

function aumentarTamanho() {
  if (props.simulando || !props.editando || tam.value >= 30) return;

  tam.value++;
  alterarTamanho();
}

defineExpose({
  obterGrade,
  atualizarGrade,
});
</script>

<template>
  <div class="grade">
    <div class="configuracao">
      <div class="configuracao-info">
        <span class="configuracao-titulo">Dimensão da grade</span>
        <span class="configuracao-descricao">{{ tam }} × {{ tam }} células</span>
      </div>
      <div class="seletor-tamanho">
        <button
          type="button"
          class="botao-tamanho"
          @click="diminuirTamanho"
          :disabled="tam <= 1 || props.simulando || !props.editando"
          aria-label="Diminuir tamanho da grade"
        >
          −
        </button>
        <span class="valor-tamanho">{{ tam }}</span>
        <button
          type="button"
          class="botao-tamanho"
          @click="aumentarTamanho"
          :disabled="tam >= 30 || props.simulando || !props.editando"
          aria-label="Aumentar tamanho da grade"
        >
          +
        </button>
      </div>
    </div>
    <div
      class="tabuleiro"
      :class="{ bloqueado: props.simulando || !props.editando }"
      :style="{
        gridTemplateColumns: `repeat(${tam}, minmax(0, 1fr))`,
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
    <div class="legenda">
      <div class="item-legenda">
        <span class="amostra"></span>
        <span>Célula morta</span>
      </div>
      <div class="item-legenda">
        <span class="amostra viva"></span>
        <span>Célula viva</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  color: #d20066;
}

.configuracao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  padding: 12px 16px;
  border: 1px solid #d0d0d7;
  border-radius: 10px;
  box-sizing: border-box;
}

.configuracao-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.configuracao-titulo {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.configuracao-descricao {
  color: #777985;
  font-size: 12px;
}

.seletor-tamanho {
  display: flex;
  align-items: center;
  gap: 12px;
}

.botao-tamanho {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #d20066;
  color: #fafafa;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}

.botao-tamanho:hover:not(:disabled) {
  background-color: #b80059;
  transform: translateY(-1px);
}

.botao-tamanho:active:not(:disabled) {
  transform: translateY(0);
}

.botao-tamanho:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.valor-tamanho {
  min-width: 24px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.tabuleiro {
  display: grid;
  width: min(80vw, 500px);
  aspect-ratio: 1;
  gap: 3px;
}

.celula {
  min-width: 0;
  min-height: 0;
  background-color: #41495b;
  border: 1px solid #555e70;
  border-radius: 3px;
  cursor: pointer;
}

.celula:hover {
  background-color: #596477;
  transform: scale(1.04);
}

.celula.viva {
  background-color: #d20066;
  border-color: #b80059;
}

.celula.viva:hover {
  background-color: #b80059;
}

.tabuleiro.bloqueado .celula {
  cursor: default;
}

.tabuleiro.bloqueado .celula:hover {
  transform: none;
}

.legenda {
  display: flex;
  justify-content: center;
  gap: 25px;
  color: #666;
  font-size: 13px;
}

.item-legenda {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amostra {
  width: 12px;
  height: 12px;
  background-color: #41495b;
  border-radius: 3px;
}

.amostra.viva {
  background-color: #d20066;
}
</style>