const $ = (sel) => document.querySelector(sel);

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

const etiquetas = (lista) =>
  el("ul", { class: "etiquetas" }, ...lista.map((t) => el("li", { class: "etiqueta", text: t })));

// ───────────── Destaque ─────────────
function montarDestaque() {
  const d = DESTAQUE;
  $("#destaque-cartao").append(
    el("span", { class: "destaque-status", text: "Projeto corporativo em uso" }),
    el("h3", { text: d.titulo }),
    el("p", { class: "destaque-resumo", text: d.resumo }),
    el("dl", { class: "numeros" },
      ...d.numeros.map((n) => el("div", {}, el("dt", { text: n.valor }), el("dd", { text: n.rotulo })))),
    el("div", { class: "destaque-colunas" },
      el("div", {},
        el("p", { class: "destaque-rotulo", text: "O que faz" }),
        el("ul", { class: "destaque-pontos" }, ...d.pontos.map((p) => el("li", { text: p })))),
      el("div", { class: "destaque-lateral" },
        el("div", {}, el("p", { class: "destaque-rotulo", text: "Módulos" }), etiquetas(d.modulos)),
        el("div", {}, el("p", { class: "destaque-rotulo", text: "Tecnologias" }), etiquetas(d.tecnologias)))),
    el("a", { class: "botao destaque-link", href: d.link, target: "_blank", rel: "noopener", text: d.rotuloLink }),
  );
}

// ───────────── Projetos e filtro ─────────────
function cartao(p, i) {
  const a = el("a", { class: "cartao entrando", href: p.link, target: "_blank", rel: "noopener", "data-area": p.area },
    el("span", { class: "area", text: AREAS[p.area] }),
    el("h3", { text: p.nome }),
    el("p", { text: p.resumo }),
    el("div", { class: "cartao-rodape" }, etiquetas(p.tecnologias), el("span", { class: "cartao-seta", "aria-hidden": "true", text: "↗" })),
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
      b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
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
  pilula.addEventListener("click", () => {
    definir(!aberta);
    if (aberta) menu.querySelector("a")?.focus({ preventScroll: true });
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
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        observador.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".revelar").forEach((n, i) => {
    if (n.closest(".hero")) n.style.transitionDelay = `${i * 70}ms`;
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
  let timer;
  botao.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(botao.dataset.email);
      botao.textContent = "Copiado";
      botao.classList.add("copiado");
    } catch {
      botao.textContent = "Não deu para copiar";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      botao.textContent = "Copiar";
      botao.classList.remove("copiado");
    }, 1800);
  });
}

$("#ano").textContent = new Date().getFullYear();
montarDestaque();
montarFiltro();
montarHabilidades();
montarIlha();
montarRevelar();
montarCopiar();
