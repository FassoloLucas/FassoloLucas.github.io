const $ = (sel) => document.querySelector(sel);
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, attrs = {}, ...filhos) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  node.append(...filhos);
  return node;
}

function icone(nome) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "icone");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", `#i-${nome}`);
  svg.append(use);
  return svg;
}

const etiquetas = (lista) =>
  el("ul", { class: "etiquetas" }, ...lista.map((t) => el("li", { class: "etiqueta", text: t })));

// ───────────── Destaque (bento) ─────────────
function montarDestaque() {
  const d = DESTAQUE;
  const link = el("a", { class: "botao", href: d.link, target: "_blank", rel: "noopener" }, d.rotuloLink, icone("seta"));
  $("#destaque-bento").append(
    el("article", { class: "bloco b-titulo revelar" },
      el("span", { class: "status", text: "Projeto corporativo em uso" }),
      el("h3", { text: d.titulo }),
      el("p", { class: "b-resumo", text: d.resumo }),
      link),
    ...d.numeros.map((n) =>
      el("div", { class: "bloco b-numero revelar" },
        el("strong", { "data-contar": n.valor, text: n.valor }),
        el("span", { text: n.rotulo }))),
    el("div", { class: "bloco b-pontos revelar" },
      el("p", { class: "rotulo", text: "O que faz" }),
      el("ul", { class: "pontos" }, ...d.pontos.map((p) => el("li", { text: p })))),
    el("div", { class: "bloco b-modulos revelar" }, el("p", { class: "rotulo", text: "Módulos" }), etiquetas(d.modulos)),
    el("div", { class: "bloco b-tec revelar" }, el("p", { class: "rotulo", text: "Tecnologias" }), etiquetas(d.tecnologias)),
  );
}

// Números que contam de zero até o valor quando aparecem ("1.400+" → 0…1400 + "+").
function contar(node) {
  const texto = node.dataset.contar;
  const m = texto.match(/^([\d.]+)(.*)$/);
  if (!m || semMovimento) return;
  const alvo = Number(m[1].replace(/\./g, ""));
  const sufixo = m[2];
  const inicio = performance.now();
  const duracao = 1400;
  const passo = (agora) => {
    const t = Math.min(1, (agora - inicio) / duracao);
    const suave = 1 - Math.pow(2, -10 * t); // easeOutExpo
    node.textContent = Math.round(alvo * (t === 1 ? 1 : suave)).toLocaleString("pt-BR") + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

// ───────────── Projetos e filtro ─────────────
function cartao(p, i) {
  const a = el("a", {
    class: `bloco cartao entrando${p.grande ? " grande" : ""}`,
    href: p.link, target: "_blank", rel: "noopener", "data-area": p.area,
  },
    el("div", { class: "cartao-topo" },
      el("span", { class: "area", text: AREAS[p.area] }),
      el("span", { class: "cartao-seta" }, icone("seta"))),
    el("h3", { text: p.nome }),
    el("p", { text: p.resumo }),
    etiquetas(p.tecnologias),
  );
  a.style.setProperty("--i", i);
  return a;
}

function mostrarProjetos(area) {
  const lista = area === "todos" ? PROJETOS : PROJETOS.filter((p) => p.area === area);
  $("#grade").replaceChildren(...lista.map(cartao));
}

function moverFundoFiltro() {
  const ativo = $("#filtro [aria-pressed='true']");
  const fundo = $("#filtro-fundo");
  if (!ativo) return;
  fundo.style.width = `${ativo.offsetWidth}px`;
  fundo.style.height = `${ativo.offsetHeight}px`;
  fundo.style.transform = `translate(${ativo.offsetLeft}px, ${ativo.offsetTop}px)`;
}

function montarFiltro() {
  const opcoes = [["todos", "Todos"], ...Object.entries(AREAS)];
  const filtro = $("#filtro");
  for (const [valor, rotulo] of opcoes) {
    const b = el("button", { type: "button", "aria-pressed": String(valor === "todos"), text: rotulo });
    b.addEventListener("click", () => {
      filtro.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: semMovimento ? "auto" : "smooth" });
      moverFundoFiltro();
      mostrarProjetos(valor);
    });
    filtro.append(b);
  }
  mostrarProjetos("todos");
  moverFundoFiltro();
  window.addEventListener("resize", moverFundoFiltro);
  document.fonts?.ready.then(moverFundoFiltro);
}

// Brilho que segue o mouse: cada bloco recebe a posição do ponteiro em --x/--y.
function montarBrilho() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  document.addEventListener("pointermove", (e) => {
    const bloco = e.target.closest?.(".bloco");
    if (!bloco) return;
    const r = bloco.getBoundingClientRect();
    bloco.style.setProperty("--x", `${e.clientX - r.left}px`);
    bloco.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, { passive: true });
}

// ───────────── Habilidades ─────────────
function montarHabilidades() {
  $("#habilidades-lista").append(
    ...HABILIDADES.map((h) => el("div", {}, el("dt", { text: h.grupo }), el("dd", {}, etiquetas(h.itens)))),
  );
}

// ───────────── Ilha ─────────────
function montarIlha() {
  const ilha = $("#ilha");
  const pilula = $("#ilha-pilula");
  const menu = $("#ilha-menu");
  const secao = $("#ilha-secao");
  const toque = window.matchMedia("(hover: none)").matches;
  let aberta = false;

  // A ilha tem o tamanho da camada visível, e a transição em mola faz o resto.
  function medir() {
    const alvo = aberta ? menu : pilula;
    ilha.style.width = `${alvo.offsetWidth}px`;
    ilha.style.height = `${alvo.offsetHeight}px`;
  }

  function definir(valor) {
    if (aberta === valor) return;
    aberta = valor;
    ilha.classList.toggle("aberta", aberta);
    pilula.setAttribute("aria-expanded", String(aberta));
    menu.querySelectorAll("a").forEach((a) => (a.tabIndex = aberta ? 0 : -1));
    medir();
  }

  menu.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
  pilula.addEventListener("click", (e) => {
    definir(!aberta);
    // Só leva o foco para o menu quando foi aberto pelo teclado.
    if (aberta && e.detail === 0) menu.querySelector("a")?.focus({ preventScroll: true });
  });
  if (!toque) {
    ilha.addEventListener("mouseenter", () => definir(true));
    ilha.addEventListener("mouseleave", () => definir(false));
  }
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) definir(false); });
  ilha.addEventListener("focusout", (e) => { if (!ilha.contains(e.relatedTarget)) definir(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aberta) { definir(false); pilula.focus(); }
  });
  document.addEventListener("click", (e) => { if (aberta && !ilha.contains(e.target)) definir(false); });
  window.addEventListener("resize", medir);
  document.fonts?.ready.then(medir);
  medir();

  // Recolhida, a ilha mostra em que seção a pessoa está.
  let atual = "";
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const nome = e.target.dataset.secao;
      if (nome === atual) continue;
      atual = nome;
      menu.querySelectorAll("a").forEach((a) => a.classList.toggle("atual", a.getAttribute("href") === `#${e.target.id}`));
      secao.classList.add("trocando");
      setTimeout(() => {
        secao.textContent = nome;
        secao.classList.remove("trocando");
        medir();
      }, 160);
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("[data-secao]").forEach((s) => observador.observe(s));
}

// ───────────── Entrada ao rolar ─────────────
function montarRevelar() {
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("visivel");
      e.target.querySelectorAll("[data-contar]").forEach(contar);
      observador.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".revelar").forEach((n) => {
    // Itens irmãos entram em sequência (início e blocos do destaque).
    const irmaos = [...n.parentElement.children].filter((x) => x.classList.contains("revelar"));
    const ordem = irmaos.indexOf(n);
    if (ordem > 0) n.style.transitionDelay = `${Math.min(ordem, 8) * 70}ms`;
    observador.observe(n);
  });

  // Os cartões entram em sequência quando o topo da grade aparece.
  const grade = $("#grade");
  const observaGrade = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    grade.classList.add("pronta");
    observaGrade.disconnect();
  }, { rootMargin: "0px 0px -8% 0px" });
  observaGrade.observe(grade);
}

// ───────────── Copiar e-mail ─────────────
function montarCopiar() {
  const botao = $("#copiar-email");
  const rotulo = botao.querySelector("span");
  const uso = botao.querySelector("use");
  let timer;
  botao.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(botao.dataset.email);
      rotulo.textContent = "Copiado";
      uso.setAttribute("href", "#i-ok");
      botao.classList.add("copiado");
    } catch {
      rotulo.textContent = "Não deu para copiar";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      rotulo.textContent = "Copiar";
      uso.setAttribute("href", "#i-copiar");
      botao.classList.remove("copiado");
    }, 1800);
  });
}

$("#ano").textContent = new Date().getFullYear();
montarDestaque();
montarFiltro();
montarHabilidades();
montarIlha();
montarBrilho();
montarRevelar();
montarCopiar();
