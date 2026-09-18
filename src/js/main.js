/* LAB 04 — Falha às 18:47
   Etapa 2: estrutura base do jogo.
   Somente JS puro, sem biblioteca, sem internet.
   Arquivo propositalmente simples para um aluno explicar:
   - estado central
   - troca de telas
   - cronômetro
   - exploração placeholder (puzzles entram na Etapa 5)
*/

"use strict";

// Tempo total da partida: 15 minutos (em segundos).
var TEMPO_TOTAL = 15 * 60;

// Estado oficial da partida. Todo progresso fica aqui.
var jogo = {
  tela: "menu",          // menu | jogo | fim
  tempoRestante: TEMPO_TOTAL,
  timerId: null,
  objetivo: "Objetivo: inspecione a bancada.",
  visitadas: {},         // ex: { bancada: true }
  inventario: [],        // ex: ["chave do armário"]
  pistas: [],            // ex: ["bilhete: ..."]
  erros: 0,
  dicasUsadas: 0,
  venceu: false
};

// Textos placeholder da Etapa 2. Na Etapa 3/5 cada local ganha
// cena própria, itens, códigos e verificações.
var LOCAIS = {
  bancada: {
    titulo: "Bancada 01",
    texto: "Bancada do monitor. Uma gaveta entreaberta, um bilhete dobrado e ferramentas arrumadas. (Etapa 3: aqui entra a primeira pista física.)",
    pista: "Bilhete da bancada: backup travou em 47%."
  },
  auxiliar: {
    titulo: "Terminal auxiliar",
    texto: "Tela de login pedindo 4 dígitos. Um post-it desbotado diz: ver etiqueta do monitor. (Etapa 5: aqui entra o puzzle 1.)",
    pista: null
  },
  armario: {
    titulo: "Armário técnico",
    texto: "Porta metálica com tranca simples. Cheiro de poeira e cabo. (Etapa 4: aqui entra o uso da chave.)",
    pista: null
  },
  painel: {
    titulo: "Painel de energia",
    texto: "Fileira de chaves e uma etiqueta de sequência apagada pela metade. (Etapa 5: aqui entra o puzzle de sequência.)",
    pista: null
  },
  principal: {
    titulo: "Terminal principal",
    texto: "Tela bloqueada: AGUARDANDO LIBERAÇÃO DAS ESTAÇÕES. (Etapa 5: aqui entra a senha final.)",
    pista: null
  }
};

function $(id) {
  return document.getElementById(id);
}

function formatarTempo(segundos) {
  var m = Math.floor(segundos / 60);
  var s = segundos % 60;
  return (m < 10 ? "0" + m : "" + m) + ":" + (s < 10 ? "0" + s : "" + s);
}

function atualizarCronometro() {
  var el = $("cronometro");
  el.textContent = formatarTempo(jogo.tempoRestante);
  if (jogo.tempoRestante <= 180) {
    el.classList.add("alerta");
  } else {
    el.classList.remove("alerta");
  }
}

function mostrarTela(nome) {
  jogo.tela = nome;
  $("tela-menu").classList.toggle("ativa", nome === "menu");
  $("tela-jogo").classList.toggle("ativa", nome === "jogo");
  $("tela-fim").classList.toggle("ativa", nome === "fim");
}

function registrar(msg) {
  var log = $("log");
  var p = document.createElement("p");
  var agora = formatarTempo(jogo.tempoRestante);
  p.innerHTML = '<span class="hora">[' + agora + ']</span> ' + msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function renderObjetivo() {
  $("objetivo-atual").textContent = jogo.objetivo;
  var total = Object.keys(LOCAIS).length;
  var feitas = Object.keys(jogo.visitadas).length;
  $("progresso").textContent = feitas + " / " + total + " inspecionadas";
}

function renderInventario() {
  var box = $("inventario");
  box.innerHTML = "";
  if (jogo.inventario.length === 0) {
    var v = document.createElement("span");
    v.className = "vazio";
    v.textContent = "Nenhum item. Clique nas estações para investigar.";
    box.appendChild(v);
    return;
  }
  jogo.inventario.forEach(function (item) {
    var s = document.createElement("span");
    s.className = "item";
    s.textContent = item;
    box.appendChild(s);
  });
}

function renderPistas() {
  var ul = $("pistas");
  ul.innerHTML = "";
  if (jogo.pistas.length === 0) {
    var li = document.createElement("li");
    li.className = "vazio";
    li.textContent = "Nenhuma pista anotada ainda.";
    ul.appendChild(li);
    return;
  }
  jogo.pistas.forEach(function (p) {
    var item = document.createElement("li");
    item.textContent = p;
    ul.appendChild(item);
  });
}

function marcarVisitada(local) {
  jogo.visitadas[local] = true;
  var el = document.querySelector('[data-estado="' + local + '"]');
  if (el) {
    el.textContent = "inspecionada";
    el.closest(".estacao").classList.add("visitada");
  }
}

// --- Cronômetro ---

function iniciarTimer() {
  pararTimer();
  jogo.timerId = setInterval(function () {
    if (jogo.tela !== "jogo") return;
    jogo.tempoRestante -= 1;
    if (jogo.tempoRestante <= 0) {
      jogo.tempoRestante = 0;
      atualizarCronometro();
      encerrar(false, "O sistema entrou em modo de segurança e isolou o servidor.");
      return;
    }
    atualizarCronometro();
  }, 1000);
}

function pararTimer() {
  if (jogo.timerId !== null) {
    clearInterval(jogo.timerId);
    jogo.timerId = null;
  }
}

// --- Fluxo principal ---

function iniciarJogo() {
  jogo.tempoRestante = TEMPO_TOTAL;
  jogo.objetivo = "Objetivo: inspecione a bancada.";
  jogo.visitadas = {};
  jogo.inventario = [];
  jogo.pistas = [];
  jogo.erros = 0;
  jogo.dicasUsadas = 0;
  jogo.venceu = false;

  document.querySelectorAll(".estacao").forEach(function (b) {
    b.classList.remove("visitada");
  });
  var estadosIniciais = {
    bancada: "não inspecionada",
    auxiliar: "bloqueado",
    armario: "trancado",
    painel: "desligado",
    principal: "bloqueado"
  };
  Object.keys(estadosIniciais).forEach(function (k) {
    var el = document.querySelector('[data-estado="' + k + '"]');
    if (el) el.textContent = estadosIniciais[k];
  });

  $("log").innerHTML = "";
  atualizarCronometro();
  renderObjetivo();
  renderInventario();
  renderPistas();
  mostrarTela("jogo");
  iniciarTimer();
  registrar("18:47 — bloqueio confirmado. Servidor local isolado.");
  registrar("Comece pela bancada. Anote tudo que parecer fora do lugar.");
}

function encerrar(venceu, mensagem) {
  pararTimer();
  jogo.venceu = venceu;
  fecharModal();
  $("fim-etiqueta").textContent = venceu ? "Relatório do turno — sucesso" : "Relatório do turno — falha";
  $("fim-titulo").textContent = venceu ? "Sistema restaurado" : "Conexão perdida";
  $("fim-texto").textContent = mensagem;
  $("res-tempo").textContent = formatarTempo(jogo.tempoRestante);
  $("res-erros").textContent = String(jogo.erros);
  $("res-pistas").textContent = String(jogo.pistas.length);
  $("res-dicas").textContent = String(jogo.dicasUsadas);
  mostrarTela("fim");
}

// --- Modal ---

function abrirModal(titulo, html) {
  $("modal-titulo").textContent = titulo;
  $("modal-conteudo").innerHTML = html;
  $("modal-fundo").hidden = false;
}

function fecharModal() {
  $("modal-fundo").hidden = true;
}

// ETAPA 3/4/5: expandir esta função.
// Hoje ela só registra visita e uma pista de exemplo.
// Depois: verificar itens, pedir códigos, liberar próxima estação.
function inspecionar(local) {
  var info = LOCAIS[local];
  if (!info) return;

  var jaVisitada = !!jogo.visitadas[local];
  marcarVisitada(local);

  if (info.pista && jogo.pistas.indexOf(info.pista) === -1) {
    jogo.pistas.push(info.pista);
    renderPistas();
    registrar("Pista anotada: " + info.pista);
  } else if (!jaVisitada) {
    registrar("Inspeção: " + info.titulo + ".");
  } else {
    registrar("Revisão: " + info.titulo + " (nada novo).");
  }

  // Exemplo de progressão simples da base. Será substituído pelos puzzles.
  if (local === "bancada") {
    jogo.objetivo = "Objetivo: verifique o terminal auxiliar.";
  }

  renderObjetivo();
  abrirModal(info.titulo, "<p>" + info.texto + "</p>");

  // TODO Etapa 5: vitória real sai daqui e vai para o terminal principal.
  // Linha temporária só para testar a tela final sem travar o fluxo:
  // (remover quando o puzzle final existir)
  if (Object.keys(jogo.visitadas).length === 5 && !jogo.venceu) {
    jogo.objetivo = "Objetivo: base explorada. Puzzles entram na próxima etapa.";
    renderObjetivo();
  }
}

function ligarEventos() {
  $("btn-iniciar").addEventListener("click", iniciarJogo);
  $("btn-reiniciar").addEventListener("click", function () {
    if (jogo.tela === "jogo") {
      iniciarJogo();
    } else {
      mostrarTela("menu");
      pararTimer();
      jogo.tempoRestante = TEMPO_TOTAL;
      atualizarCronometro();
    }
  });
  $("btn-jogar-novamente").addEventListener("click", iniciarJogo);
  $("btn-voltar-menu").addEventListener("click", function () {
    pararTimer();
    mostrarTela("menu");
  });
  $("btn-ajuda").addEventListener("click", function () {
    abrirModal(
      "Como jogar",
      "<p>Clique nas estações, leia com atenção e anote códigos.</p>" +
      "<p>Itens vão para o inventário. Pistas ficam na lista ao lado.</p>" +
      "<p>Você tem 15 minutos. Errar código conta como erro no relatório.</p>"
    );
  });
  $("btn-fechar-modal").addEventListener("click", fecharModal);
  $("modal-fundo").addEventListener("click", function (e) {
    if (e.target === $("modal-fundo")) fecharModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("modal-fundo").hidden) fecharModal();
  });

  // Evita duplo processamento em clique rápido: o estado impede duplicar pista/item.
  document.querySelectorAll(".estacao").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (jogo.tela !== "jogo") return;
      inspecionar(btn.getAttribute("data-local"));
    });
  });
}

// Inicialização
atualizarCronometro();
renderObjetivo();
renderInventario();
renderPistas();
ligarEventos();
