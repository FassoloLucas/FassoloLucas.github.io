// Conteúdo do portfólio. Para incluir um projeto, acrescente um item em PROJETOS.
// area: "contabil" (Contábil e fiscal), "ia" (IA e web) ou "apps" (Apps e automação).
// grande: true ocupa duas colunas na grade (use em até dois projetos).

const AREAS = {
  contabil: "Contábil e fiscal",
  ia: "IA e web",
  apps: "Apps e automação",
};

const DESTAQUE = {
  titulo: "Plataforma contábil e fiscal",
  resumo:
    "Plataforma interna integrada ao ERP Consinco (Oracle) que centraliza análise contábil, auditoria fiscal, contratos e orçamento de uma rede de varejo. Substitui dezenas de planilhas manuais e aplica as regras contábeis e tributárias direto na fonte de dados.",
  numeros: [
    { valor: "19", rotulo: "lojas atendidas" },
    { valor: "55+", rotulo: "telas" },
    { valor: "201", rotulo: "rotas de API" },
    { valor: "1.400+", rotulo: "testes automatizados" },
  ],
  modulos: ["Contabilidade", "Fiscal", "Orçamento", "Financeiro", "Comercial", "Contratos"],
  pontos: [
    "DRE contábil e gerencial por loja, Livro Razão em PDF, arrendamento (CPC 06), depreciação e budget anual por setor.",
    "Conferência item a item entre XML de entrada e lançamentos do ERP, apurações de F100, FECP e DIFAL e leitor de SPED Fiscal.",
    "Contratos de aluguel com reajuste por IGP-M, IPCA, INPC e IGP-DI, leitura de contratos em PDF e assistente com IA nas telas.",
  ],
  tecnologias: ["Python", "FastAPI", "Oracle SQL", "MongoDB", "JavaScript", "Chart.js", "pandas", "LLMs", "pytest"],
  link: "https://github.com/FassoloLucas/gestao-contratos-locacao-ia",
  rotuloLink: "Ver estudo de caso",
};

const PROJETOS = [
  {
    nome: "Gerador de Livro Razão (ECD)",
    resumo: "Indexa o TXT da ECD em SQLite, gera PDFs por grupo de contas e confere os movimentos contra os saldos da escrituração.",
    area: "contabil",
    grande: true,
    tecnologias: ["Python", "SQLite", "Tkinter", "ReportLab", "pytest", "GitHub Actions"],
    link: "https://github.com/FassoloLucas/gerador-razao-ecd",
  },
  {
    nome: "Extrator de XML fiscal",
    resumo: "App desktop que lê os XMLs fiscais de uma pasta e exporta os dados para um Excel formatado, tudo processado localmente.",
    area: "contabil",
    tecnologias: ["Python", "CustomTkinter", "pandas", "XlsxWriter"],
    link: "https://github.com/FassoloLucas/extrator-xml-fiscal",
  },
  {
    nome: "Relatório gerencial CGO × filial",
    resumo: "Cruza relatórios CSV por produto e filial e separa numa aba de auditoria os produtos ligados a mais de um CGO.",
    area: "contabil",
    tecnologias: ["Python", "Tkinter", "pandas", "openpyxl"],
    link: "https://github.com/FassoloLucas/relatorio-gerencial-cgo",
  },
  {
    nome: "Conversor de planilhas",
    resumo: "Converte vários arquivos XLS para XLSX pelo navegador e devolve tudo num ZIP pronto para baixar.",
    area: "contabil",
    tecnologias: ["Python", "Flask", "pandas", "JavaScript"],
    link: "https://github.com/FassoloLucas/Conversor2",
  },
  {
    nome: "Mundo das IAs",
    resumo: "Cidade simulada com moradores, economia e eleições, onde agentes de IA decidem e o mapa se atualiza ao vivo no navegador.",
    area: "ia",
    grande: true,
    tecnologias: ["Python", "FastAPI", "WebSocket", "JavaScript", "Agentes de IA"],
    link: "https://github.com/FassoloLucas/mundo-das-ias",
  },
  {
    nome: "J.A.R.V.I.S.",
    resumo: "Assistente de voz que conecta reconhecimento de fala, um modelo de linguagem e automações do Windows, com cliente Flutter.",
    area: "ia",
    tecnologias: ["Python", "FastAPI", "Flutter", "MongoDB", "LLMs"],
    link: "https://github.com/FassoloLucas/jarvis-assistente",
  },
  {
    nome: "10 e Faixa",
    resumo: "Gestão de vendas na web: produtos, estoque, compras, clientes e registro de vendas numa só aplicação.",
    area: "ia",
    tecnologias: ["Python", "Flask", "PostgreSQL", "JavaScript"],
    link: "https://github.com/FassoloLucas/10efaixa2",
  },
  {
    nome: "Ilha de Tarefas",
    resumo: "Ilha preta no topo da tela com tarefas recorrentes, consultas SQL do Obsidian e uma aba que conversa com o Claude Code.",
    area: "apps",
    tecnologias: ["Tauri", "Rust", "React", "TypeScript"],
    link: "https://github.com/Viadoces/ilha-de-tarefas",
  },
  {
    nome: "TV no PC",
    resumo: "Transforma o PC numa TV box com LDPlayer e usa o celular como controle remoto pela rede local.",
    area: "apps",
    tecnologias: ["Node.js", "PowerShell", "Android", "ADB"],
    link: "https://github.com/FassoloLucas/tv-no-pc",
  },
  {
    nome: "Bot de música para Discord",
    resumo: "Fila por servidor, botões de controle e playlists salvas, com scripts de implantação para Ubuntu.",
    area: "apps",
    tecnologias: ["Python", "discord.py", "yt-dlp", "FFmpeg"],
    link: "https://github.com/FassoloLucas/discord-music-bot",
  },
];

const HABILIDADES = [
  {
    grupo: "Contábil e fiscal",
    itens: ["ECD", "EFD ICMS/IPI", "XML de NF-e", "DRE", "Livro Razão", "CPC 06", "Depreciação", "DIFAL e FECP", "Conciliações"],
  },
  {
    grupo: "Back-end e dados",
    itens: ["Python", "FastAPI", "Flask", "Oracle SQL", "PostgreSQL", "MongoDB", "SQLite", "pandas"],
  },
  {
    grupo: "Front-end e apps",
    itens: ["JavaScript", "TypeScript", "React", "Chart.js", "Tauri", "Flutter", "Android"],
  },
  {
    grupo: "Relatórios",
    itens: ["ReportLab", "WeasyPrint", "XlsxWriter", "openpyxl"],
  },
  {
    grupo: "IA",
    itens: ["LLMs (Gemini e Groq)", "Agentes", "Leitura de documentos"],
  },
  {
    grupo: "Qualidade",
    itens: ["pytest", "GitHub Actions", "Testes automatizados"],
  },
];
