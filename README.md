# Portfólio de Lucas Fassolo

Site pessoal publicado em **https://fassololucas.github.io**.

Página única em HTML, CSS e JavaScript, sem framework e sem etapa de build.

## Editar o conteúdo

Projetos, destaque e habilidades ficam em [`projetos.js`](projetos.js). Para incluir um projeto, acrescente um item em `PROJETOS`:

```js
{
  nome: "Nome do projeto",
  resumo: "Uma frase sobre o que ele resolve.",
  area: "contabil", // "contabil", "ia" ou "apps"
  tecnologias: ["Python", "FastAPI"],
  link: "https://github.com/FassoloLucas/repositorio",
},
```

Textos fixos (apresentação, sobre e contato) ficam em [`index.html`](index.html).

## Ver localmente

Abra o `index.html` no navegador ou rode um servidor simples na pasta:

```bash
python -m http.server 8000
```

Depois de um `git push`, o GitHub Pages atualiza o site em um ou dois minutos.
