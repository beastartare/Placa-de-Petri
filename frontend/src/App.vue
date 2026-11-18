<script setup>
import { ref, onBeforeUnmount } from "vue"; // função para criar referencias reativas (alteração atualiza automaticamente)
import { evoluirGrade } from "./services/jogoService"; // Importa a função evoluirGrade do serviço jogoService

import Grade from "./components/Grade.vue"; // Importa o componente Grade
import Button from "./components/Button.vue"; // Importa o componente Button
import Metrics from "./components/Metrics.vue"; // Importa o componente Metrics

// Referências reativas para o estado da aplicação
const gradeRef = ref(null); //grade (inicialmente nula)
const simulando = ref(false); // indica se a simulação está em andamento (inicia parado)
const mensagem = ref(""); // mensagem de status ou erro (inicialmente vazia)
const editando = ref(true); // indica se o usuário está editando a configuração da grade (inicia em modo de edição)

let intervalo = null; //identificador de um intervalo
let processando = false; // Indica se uma geração está sendo processada naquele momento.

const numGeracoes = ref(0); // Contador de gerações (inicia em 0)
const numCelulasVivas = ref(0); // Contador de células vivas (inicia em 0)

// função para contar o número de células vivas na grade
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

// função para alterar a configuração da grade, resetando contadores e mensagens
function alterarConfiguracao() {
  numGeracoes.value = 0;
  mensagem.value = "";

  const gradeAtual = gradeRef.value.obterGrade(); // retorna a grade atual

  numCelulasVivas.value = contarCelulasVivas(gradeAtual); // atualiza o contador de células vivas
}

// função para iniciar a edição da configuração da grade
function editarConfiguracao() {
  if (simulando.value) return; // não permite editar se a simulação estiver em andamento

  //seta os valores de editando e mensagem
  editando.value = true;
  mensagem.value = "";
}

//fnaliza modo de edição
function finalizarEdicao() {
  editando.value = false;
}

// função para pausar a simulação
function pausarSimulacao() {
  clearInterval(intervalo); // limpa o intervalo que estava executando a simulação
  intervalo = null; // reseta o identificador do intervalo
  simulando.value = false; // atualiza o estado da simulação para pausada
}

//função para reiniciar a simulação
function reiniciarSimulacao() {
  pausarSimulacao(); //pausa a simulação

  const gradeAtual = gradeRef.value.obterGrade(); //obetem a grade atual
  const gradeVazia = gradeAtual.map((linha) => linha.map(() => false)); //cria uma nova grade com todas as células mortas

  gradeRef.value.atualizarGrade(gradeVazia); //atualiza a grade com a nova grade vazia

  //reseta os contadores e mensagens
  numGeracoes.value = 0;
  numCelulasVivas.value = 0;
  mensagem.value = "";
  editando.value = true;
}

// função para executar a geração da simulação
async function executarGeracao() {
  // Se já estiver processando uma geração ou se estiver em modo de edição, não faz nada
  if (processando || editando.value) return;

  processando = true; //inicia o processamento da geração

  //tenta evoluir a grade e atualizar os contadores, tratando erros caso ocorram
  try {
    const gradeAtual = gradeRef.value.obterGrade(); // obtém a grade atual
    const proximaGrade = await evoluirGrade(gradeAtual); // chama a função evoluirGrade para obter a próxima geração da grade
    gradeRef.value.atualizarGrade(proximaGrade); // atualiza a grade com a nova geração

    numCelulasVivas.value = contarCelulasVivas(proximaGrade); // atualiza o contador de células vivas
    numGeracoes.value++; // incrementa o contador de gerações

    // Verifica se ainda existem células vivas na próxima grade
    const existemCelulasVivas = proximaGrade.some((linha) =>
      linha.some((celula) => celula),
    );

    // se nao houver, pausa a simulação e exibe mensagem
    if (!existemCelulasVivas) {
      pausarSimulacao();
      mensagem.value = "A simulação foi encerrada: não há mais células vivas.";
    }
  } catch (erro) {
    //tratamento de erros
    console.error("Erro na simulação:", erro);
    mensagem.value = "Ocorreu um erro ao evoluir a grade.";
    pausarSimulacao(); // pausa a simulação
  } finally {
    // garante que o processamento seja finalizado mesmo em caso de erro
    processando = false;
  }
}

// função para iniciar a simulação
function iniciarSimulacao() {
  //se já estiver simulando, pausa a simulação
  if (simulando.value) {
    pausarSimulacao();
    return;
  }
  //se estiver em modo de edição, finaliza a edição antes de iniciar a simulação
  if (editando.value) {
    finalizarEdicao();
  }

  //seta os valores
  simulando.value = true;
  mensagem.value = "";

  //inicia o intervalo que executa a geração a cada 500ms
  intervalo = setInterval(() => {
    executarGeracao();
  }, 500);
}

// garante que o intervalo seja limpo quando o componente for destruído, evitando vazamentos de memória
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
          <p>Configure sua grade e observe a evolução das células.</p>
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
          <div v-if="mensagem" class="mensagem">
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
            <span class="titulo-controles">AÇÕES</span>
            <Button v-if="!editando" @click="iniciarSimulacao">
              {{ simulando ? "Pausar simulação" : "Iniciar simulação" }}
            </Button>
            <Button v-if="!simulando && !editando" @click="executarGeracao">
              Avançar uma geração
            </Button>
            <Button v-if="!simulando && !editando" @click="editarConfiguracao">
              Editar grade
            </Button>
            <Button v-if="editando" @click="finalizarEdicao">
              Finalizar edição
            </Button>
            <Button @click="reiniciarSimulacao"> Reiniciar </Button>
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
