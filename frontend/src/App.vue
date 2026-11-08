<script setup>
import { ref, onBeforeUnmount } from "vue";
import { evoluirGrade } from "./services/jogoService";

import Grade from "./components/Grade.vue";
import Button from "./components/Button.vue";
import Metrics from "./components/Metrics.vue";

const gradeRef = ref(null);
const simulando = ref(false);
const mensagem = ref("");
const editando = ref(true);

let intervalo = null;
let processando = false;

const numGeracoes = ref(0);
const numCelulasVivas = ref(0);

function contarCelulasVivas(grade) {
  let quantidade = 0;

  for (let linha = 0; linha < grade.length; linha++) {
    for (let coluna = 0; coluna < grade[linha].length; coluna++) {
      if (grade[linha][coluna] === true) {
        quantidade++;
      }
    }
  }

  return quantidade;
}

function alterarConfiguracao() {
  numGeracoes.value = 0;
  mensagem.value = "";

  const gradeAtual = gradeRef.value.obterGrade();

  numCelulasVivas.value = contarCelulasVivas(gradeAtual);
}

function editarConfiguracao() {
  if (simulando.value) return;

  editando.value = true;
  mensagem.value = "";
}

function finalizarEdicao() {
  editando.value = false;
}

function pausarSimulacao() {
  clearInterval(intervalo);
  intervalo = null;
  simulando.value = false;
}

function reiniciarSimulacao() {
  pausarSimulacao();

  const gradeAtual = gradeRef.value.obterGrade();

  const gradeVazia = gradeAtual.map((linha) =>
    linha.map(() => false)
  );

  gradeRef.value.atualizarGrade(gradeVazia);

  numGeracoes.value = 0;
  numCelulasVivas.value = 0;
  mensagem.value = "";

  editando.value = true;
}

async function executarGeracao() {
  if (processando || editando.value) return;

  processando = true;

  try {
    const gradeAtual = gradeRef.value.obterGrade();
    const proximaGrade = await evoluirGrade(gradeAtual);

    gradeRef.value.atualizarGrade(proximaGrade);

    numCelulasVivas.value = contarCelulasVivas(proximaGrade);
    numGeracoes.value++;

    const existemCelulasVivas = proximaGrade.some(
      (linha) => linha.some((celula) => celula)
    );

    if (!existemCelulasVivas) {
      pausarSimulacao();

      mensagem.value =
        "A simulação foi encerrada: não há mais células vivas.";
    }
  } catch (erro) {
    console.error("Erro na simulação:", erro);

    mensagem.value = "Ocorreu um erro ao evoluir a grade.";

    pausarSimulacao();
  } finally {
    processando = false;
  }
}

function iniciarSimulacao() {
  if (simulando.value) {
    pausarSimulacao();
    return;
  }

  if (editando.value) {
    finalizarEdicao();
  }

  simulando.value = true;
  mensagem.value = "";

  intervalo = setInterval(() => {
    executarGeracao();
  }, 500);
}

onBeforeUnmount(() => {
  clearInterval(intervalo);
});
</script>

<template>
  <div class="app">
    <div class="conteudo">
      <header class="cabecalho">
        <div class="titulo">
          <h1>Placa de Petri</h1>
          <p>
            Configure sua grade e observe a evolução das células.
          </p>
        </div>

        <div
          class="status"
          :class="{
            ativo: simulando,
            editando: editando,
          }"
        >
          <span class="status-ponto"></span>

          {{
            simulando
              ? "Simulação ativa"
              : editando
                ? "Modo de edição"
                : "Simulação pausada"
          }}
        </div>
      </header>

      <div class="area-principal">
        
        <section class="area-grade">
                <div
        v-if="mensagem"
        class="mensagem"
      >
        <span class="mensagem-icone">!</span>

        <p>{{ mensagem }}</p>
      </div>
          <main class="grade-container">
            <Grade
              ref="gradeRef"
              :simulando="simulando"
              :editando="editando"
              @alterada="alterarConfiguracao"
            />
          </main>
        </section>

        <aside class="painel-lateral">
          <div class="painel-titulo">
            <h2>Painel de controle</h2>
            <p>Gerencie a simulação.</p>
          </div>

          <div class="metricas">
            <Metrics
              :numGeracoes="numGeracoes"
              :numCelulasVivas="numCelulasVivas"
            />
          </div>

          <div class="controles">
            <span class="titulo-controles">
              AÇÕES
            </span>

            <Button
              v-if="!editando"
              @click="iniciarSimulacao"
            >
              {{
                simulando
                  ? "Pausar simulação"
                  : "Iniciar simulação"
              }}
            </Button>

            <Button
              v-if="!simulando && !editando"
              @click="executarGeracao"
            >
              Avançar uma geração
            </Button>

            <Button
              v-if="!simulando && !editando"
              @click="editarConfiguracao"
            >
              Editar grade
            </Button>

            <Button
              v-if="editando"
              @click="finalizarEdicao"
            >
              Finalizar edição
            </Button>

            <Button
              @click="reiniciarSimulacao"
            >
              Reiniciar
            </Button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.conteudo {
  width: 100%;
  max-width: 1100px;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.cabecalho h1 {
  font-size: 28px;
  margin: 0;
  color: white;
}

.cabecalho p {
  font-size: 14px;
  color: #777080;
  margin-top: 8px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #eeeaf2;
  color: #777080;
  font-size: 13px;
}

.status-ponto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9992a4;
}

.status.ativo {
  background: #e5f7ed;
  color: #16844a;
}

.status.ativo .status-ponto {
  background: #22b66e;
}

.status.editando {
  background: #fce7f1;
  color: #b80059;
}

.status.editando .status-ponto {
  background: #d20066;
}

.area-principal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 30px;
  align-items: start;
}

.area-grade {
  min-width: 0;
  padding: 20px;
  border: 1px solid #eee9f2;
  border-radius: 12px;
}

.grade-container {
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
}

.painel-lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #eee9f2;
  border-radius: 12px;
}

.painel-titulo h2 {
  font-size: 18px;
  margin: 0;
  color: white;
}

.painel-titulo p {
  font-size: 13px;
  color: #91899d;
  margin-top: 6px;
}

.metricas {
  width: 100%;
}

.controles {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 15px;
  border-top: 1px solid #eee9f2;
}

.titulo-controles {
  font-size: 11px;
  font-weight: 700;
  color: #91899d;
  margin-bottom: 5px;
}

.mensagem {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px 15px;
  border-radius: 8px;
  background: #fce7f1;
  color: #a50050;
  font-size: 13px;
}

.mensagem-icone {
  font-weight: bold;
}

.mensagem p {
  margin: 0;
}
</style>