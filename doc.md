# 📘 Documentacao Tecnica — Fronnexus

> **Fronnexus** e uma agencia digital global especializada em desenvolvimento front-end, design UI/UX, analise de dados e garantia de qualidade. Este documento detalha toda a arquitetura, componentes e funcionamento do projeto.

---

## 📋 Sumario

- [Descricao do Projeto](#-descricao-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquivos de Configuracao](#-arquivos-de-configuracao)
- [Paginas da Aplicacao](#-paginas-da-aplicacao)
- [Componentes Detalhados](#-componentes-detalhados)
- [Servicos e Utilitarios](#-servicos-e-utilitarios)
- [API Routes](#-api-routes)
- [Sistema de Temas e Estilos](#-sistema-de-temas-e-estilos)
- [Assets e Recursos Visuais](#-assets-e-recursos-visuais)
- [Variaveis de Ambiente](#-variaveis-de-ambiente)
- [Como Instalar e Rodar](#-como-instalar-e-rodar)
- [Como Clonar o Repositorio](#-como-clonar-o-repositorio)

---

## 🎯 Descricao do Projeto

O **Fronnexus** e o site institucional de uma agencia digital que oferece servicos de:

- **Desenvolvimento Front-End** (React, Next.js, Tailwind CSS)
- **Design UI/UX** (Figma, layouts pixel-perfect)
- **Analise de Dados** (dashboards, KPIs, relatorios)
- **Garantia de Qualidade** (testes cross-browser, QA automatizado)

O site possui paginas para apresentacao da empresa, portfolio de projetos (carregados dinamicamente do Supabase), pagina de contato com formulario completo, e termos de responsabilidade. Todo o visual segue um tema escuro/claro com paleta roxa (#8b5cf6) como cor de destaque.

---

## 🛠 Tecnologias Utilizadas

### Framework & Runtime
| Tecnologia | Versao | Funcao |
|---|---|---|
| **Next.js** | ^16.1.6 | Framework React com SSR, rotas e API Routes |
| **React** | ^19.1.0 | Biblioteca de UI com componentes reativos |
| **React DOM** | ^19.1.0 | Renderizacao do React no navegador |

### Estilizacao
| Tecnologia | Versao | Funcao |
|---|---|---|
| **Tailwind CSS** | ^4 | Framework CSS utilitario |
| **PostCSS** | - | Processador CSS (com plugin @tailwindcss/postcss) |

### Animacoes & 3D
| Tecnologia | Versao | Funcao |
|---|---|---|
| **GSAP** | ^3.13.0 | Animacoes JavaScript de alta performance |
| **Three.js** | ^0.180.0 | Renderizacao WebGL 3D (efeito PixelBlast) |
| **OGL** | ^1.0.11 | Renderizacao WebGL leve (LightRays e Plasma) |
| **postprocessing** | ^6.37.8 | Efeitos de pos-processamento para Three.js |

### Backend & Dados
| Tecnologia | Versao | Funcao |
|---|---|---|
| **Supabase** | ^2.58.0 | Banco de dados (projetos e contatos) |
| **Nodemailer** | ^7.0.7 | Envio de emails (dependencia instalada) |
| **emailjs** | ^4.0.3 | Servico de email client-side |
| **dotenv** | ^17.2.2 | Variaveis de ambiente |

### Formularios & Validacao
| Tecnologia | Versao | Funcao |
|---|---|---|
| **React Hook Form** | ^7.64.0 | Gerenciamento de formularios |
| **Zod** | ^4.1.11 | Validacao de schemas |

### Icones
| Tecnologia | Versao | Funcao |
|---|---|---|
| **React Icons** | ^5.5.0 | Biblioteca de icones (Feather, Ionicons) |
| **Lucide React** | ^0.543.0 | Icones modernos para React |

### Dev Tools
| Tecnologia | Versao | Funcao |
|---|---|---|
| **ESLint** | ^9 | Linting de codigo |
| **eslint-config-next** | 15.4.6 | Configuracao ESLint para Next.js |

---

## 📁 Estrutura do Projeto

```
fronnexus/
├── public/
│   └── assets/
│       ├── icons/                    # Icones SVG (redes sociais, logo)
│       │   ├── logo.svg              # Logo principal da Fronnexus
│       │   ├── github.svg / githubDark.svg
│       │   ├── linkedin.svg / linkedinDark.svg
│       │   ├── instagram.svg / instagramDark.svg
│       │   ├── facebook.svg / facebookDark.svg
│       │   └── whatsapp.svg / whatsappDark.svg
│       ├── image/                    # Imagens do site
│       │   ├── Ericky.jpg            # Foto membro da equipe
│       │   ├── Gabriel.jpg           # Foto membro da equipe
│       │   ├── Logotype.svg          # Logotipo completo
│       │   ├── logosymbol.svg        # Simbolo do logo
│       │   ├── logosymbol_1x1_high_quality.png
│       │   ├── btnHamburger.svg      # Icone menu mobile
│       │   ├── file.svg / globe.svg / sun.svg
│       │   └── ...
│       └── videos/
│           └── circle.gif            # Animacao GIF decorativa
│
├── src/
│   ├── app/                          # App Router (Next.js)
│   │   ├── layout.js                 # Layout raiz (Header + Footer)
│   │   ├── page.js                   # Pagina inicial (Home)
│   │   ├── globals.css               # Estilos globais + tema + animacoes
│   │   ├── about/
│   │   │   └── page.js               # Pagina "Sobre Nos"
│   │   ├── contact/
│   │   │   └── page.js               # Pagina de contato
│   │   ├── projects/
│   │   │   └── page.js               # Pagina de projetos (portfolio)
│   │   ├── terms/
│   │   │   └── responsability/
│   │   │       └── page.jsx          # Termos de responsabilidade
│   │   └── api/
│   │       └── send-email/
│   │           └── route.js          # API Route para envio de emails
│   │
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx            # Navbar principal (sticky, glass)
│   │   │   ├── HeaderBg.jsx          # Hero section reutilizavel
│   │   │   └── LightRays.jsx         # Efeito WebGL de raios de luz
│   │   ├── Animation/
│   │   │   └── Plasma.jsx            # Efeito WebGL de plasma animado
│   │   ├── Popup/
│   │   │   └── Popup.jsx             # Modal de detalhes do projeto
│   │   ├── about/
│   │   │   ├── Main.jsx              # Secao principal da pagina About
│   │   │   └── Skills.jsx            # Marquee animado de skills
│   │   ├── client/
│   │   │   ├── ClientHomeProjectInfo.jsx  # Wrapper client-side para projetos
│   │   │   └── ClientSegundaCTA.jsx       # Wrapper client-side para CTA
│   │   ├── contact/
│   │   │   └── ContactForm.jsx       # Formulario de contato completo
│   │   ├── cta/
│   │   │   ├── PrimeiraCTA/
│   │   │   │   ├── PrimeiraCTA.jsx   # Primeira secao CTA (cards)
│   │   │   │   └── CardSwap.jsx      # Animacao de troca de cards (GSAP)
│   │   │   └── segundacta/
│   │   │       ├── SegundaCTA.jsx     # Secao CTA reutilizavel
│   │   │       └── PixelBlast.jsx     # Efeito WebGL de pixels animados
│   │   ├── footer/
│   │   │   └── Footer.jsx            # Rodape com links e redes sociais
│   │   ├── hero/
│   │   │   └── HeroComponent.jsx     # Componente hero basico (legado)
│   │   ├── homeProjectInfo/
│   │   │   └── HomeProjectInfo.jsx   # Grid de projetos na Home
│   │   ├── modals/
│   │   │   └── MobileMenu.jsx        # Menu mobile (dropdown glass)
│   │   ├── projects/
│   │   │   └── ProjectCard.jsx       # Card de projeto para portfolio
│   │   ├── services/
│   │   │   └── ServicesSection.jsx    # Secao de servicos (4 cards)
│   │   └── utils/
│   │       ├── LazyMount.jsx          # Montagem lazy com IntersectionObserver
│   │       ├── ScrollReveal.jsx       # Animacao de scroll reveal
│   │       └── heroInfo.js            # Dados estaticos para heroes
│   │
│   ├── lib/
│   │   └── validateContact.js         # Validacao do formulario de contato
│   │
│   └── services/
│       └── supabase.js                # Cliente Supabase + queries
│
├── .gitignore
├── eslint.config.mjs                  # Configuracao ESLint
├── instagram-caption.md               # Legenda para post Instagram
├── instagram-post.html                # Template visual para post Instagram
├── jsconfig.json                      # Alias de importacao (@/*)
├── next.config.mjs                    # Configuracao Next.js (imagens remotas)
├── package.json                       # Dependencias e scripts
├── package-lock.json                  # Lock file
├── postcss.config.mjs                 # Configuracao PostCSS
└── README.md                          # Documentacao principal
```

---

## ⚙ Arquivos de Configuracao

### `package.json`
Define o projeto como **ESM** (`"type": "module"`), versao `0.1.0`, com os scripts:
- `dev` — Servidor de desenvolvimento com **Turbopack** (`next dev --turbopack`)
- `build` — Build de producao (`next build`)
- `start` — Servidor de producao (`next start`)
- `lint` — Linting com ESLint (`next lint`)

### `next.config.mjs`
Configura dominios permitidos para `<Image>` do Next.js:
- `i.pinimg.com` (Pinterest)
- `images.unsplash.com` (Unsplash)

### `postcss.config.mjs`
Habilita o plugin `@tailwindcss/postcss` para processar classes Tailwind v4.

### `eslint.config.mjs`
Usa o formato flat config do ESLint v9 com a extensao `next/core-web-vitals`.

### `jsconfig.json`
Define o alias `@/*` apontando para `./src/*`, permitindo importacoes como `@/components/...`.

### `.gitignore`
Ignora `node_modules`, `.next`, `.env*`, `.vercel`, arquivos de build e debug.

---

## 📄 Paginas da Aplicacao

### 🏠 Home (`src/app/page.js`)
Pagina principal com as seguintes secoes:
1. **HeaderBg** — Hero animado com titulo, descricao e CTA
2. **ServicesSection** — 4 cards de servicos (Front-End, Design, Dados, QA)
3. **SegundaCTA** — Call-to-action "Turn your idea into digital reality"
4. **HomeProjectInfo** — Grid de projetos carregados do Supabase com popup de detalhes
5. **SegundaCTA** — Segundo CTA "Ready to grow your online presence?"

Usa `dynamic()` e `Suspense` para carregamento lazy dos componentes pesados.

### 👥 About (`src/app/about/page.js`)
Pagina institucional com:
1. **HeaderBg** — Hero com titulo "Built on Passion, Driven by Precision"
2. **Skills** — Marquee horizontal infinito com tecnologias (Tailwind, Figma, React, Next.js, etc.)
3. **Main** — Card da agencia com descricao, links sociais. Suporte para cards de membros da equipe (carregados do Supabase, atualmente comentado)
4. **SegundaCTA** — CTA para contato

### 💼 Projects (`src/app/projects/page.js`)
Pagina de portfolio que:
- Carrega projetos do Supabase via `getProjects()`
- Fallback para `/project.json` caso o Supabase falhe
- Normaliza dados com `normalizeRecord()` para suportar diferentes schemas
- Exibe cards alternados (normal/reversed) com `ProjectCard`
- Mostra skeleton loading enquanto carrega

### 📧 Contact (`src/app/contact/page.js`)
Formulario de contato completo com:
- Campos: nome, sobrenome, email, telefone (opcional), pais, idioma
- Selecao de servicos (checkboxes): Front-End, Data Analysis, Web Design, QA, Full-Stack, Other
- Textarea para detalhes do projeto
- Checkbox de termos de servico
- Validacao client-side em tempo real
- Envio via API Route `/api/send-email`
- Mensagens de sucesso/erro

### 📜 Termos (`src/app/terms/responsability/page.jsx`)
Pagina de termos de responsabilidade e protecao de dados com 7 secoes:
1. Introducao
2. Responsabilidade do Desenvolvedor
3. Protecao de Dados e Privacidade (LGPD/GDPR)
4. Propriedade Intelectual
5. Limitacao de Responsabilidade
6. Alteracoes nos Termos
7. Contato

---

## 🧩 Componentes Detalhados

### 🔝 Header (`components/Header/Header.jsx`)
- **Tipo:** Client Component
- **Funcao:** Barra de navegacao principal, sticky no topo com efeito glassmorphism
- **Caracteristicas:**
  - Efeito glass ao rolar (background blur + borda)
  - Navegacao desktop com indicador de pagina ativa (underline roxo)
  - Botao CTA "Get in Touch" com efeito shine
  - Menu hamburger para mobile (abre `MobileMenu`)
  - Acessibilidade: `aria-label`, `aria-expanded`, `aria-current`

### 🌅 HeaderBg (`components/Header/HeaderBg.jsx`)
- **Tipo:** Client Component reutilizavel
- **Funcao:** Hero section com fundo animado, usada em todas as paginas
- **Props:** `title`, `highlight`, `subtitle`, `description`, `buttonText`, `buttonLink`
- **Efeitos visuais:**
  - 3 orbs flutuantes com blur e gradiente radial
  - Grid sutil de fundo
  - Gradiente de fade na parte inferior
  - Badge "Digital Agency" com dot pulsante
  - Animacoes escalonadas de entrada do texto

### ✨ LightRays (`components/Header/LightRays.jsx`)
- **Tipo:** Client Component WebGL (OGL)
- **Funcao:** Efeito visual de raios de luz renderizado com shaders GLSL
- **Caracteristicas:**
  - Raios configuraveeis por origem, cor, velocidade, spread, comprimento
  - Suporte a mouse follow com smoothing
  - Modo pulsante opcional
  - Visibilidade controlada por IntersectionObserver (performance)
  - Cleanup completo de WebGL context

### 🌊 Plasma (`components/Animation/Plasma.jsx`)
- **Tipo:** Client Component WebGL 2 (OGL)
- **Funcao:** Efeito de plasma animado com shaders GLSL
- **Props:** `color`, `speed`, `direction` (forward/reverse/pingpong), `scale`, `opacity`, `mouseInteractive`
- **Caracteristicas:**
  - Shader WebGL 2 com 60 iteracoes
  - Interacao com mouse
  - Cor customizavel com conversao hex para RGB
  - Suporte a direcao pingpong

### 💥 PixelBlast (`components/cta/segundacta/PixelBlast.jsx`)
- **Tipo:** Client Component WebGL 2 (Three.js + postprocessing)
- **Funcao:** Background interativo com pixels animados, dithering e ripples
- **Caracteristicas:**
  - Formas configuraveeis: square, circle, triangle, diamond
  - FBM noise para padrao organico
  - Ripple effect em cliques do mouse
  - Efeito liquid com touch texture
  - Efeito noise opcional
  - Auto-pause quando fora da viewport
  - Edge fade configuravel
  - Bayer dithering para visual retro

### 🃏 CardSwap (`components/cta/PrimeiraCTA/CardSwap.jsx`)
- **Tipo:** Client Component com GSAP
- **Funcao:** Animacao de troca automatica de cards empilhados com perspectiva 3D
- **Props:** `width`, `height`, `cardDistance`, `verticalDistance`, `delay`, `pauseOnHover`, `skewAmount`, `easing`
- **Animacoes:** Drop, promote, return com easing elastico ou power

### 📢 SegundaCTA (`components/cta/segundacta/SegundaCTA.jsx`)
- **Tipo:** Client Component reutilizavel
- **Funcao:** Secao de call-to-action com titulo, subtitulo e botao
- **Props:** `title`, `subtitle`, `buttonText`, `buttonHref`, `actions`
- **Visual:** Fundo com gradiente roxo sutil, orb blur central

### 🗃 ProjectCard (`components/projects/ProjectCard.jsx`)
- **Tipo:** Client Component
- **Funcao:** Card de projeto para pagina de portfolio
- **Props:** `nome`, `url_image`, `repositorio`, `deploy`, `long_description`, `tecnologias`, `reversed`
- **Layout:** Grid 12 colunas com imagem e conteudo, reversivel

### 📬 ContactForm (`components/contact/ContactForm.jsx`)
- **Tipo:** Client Component
- **Funcao:** Formulario de contato completo
- **Caracteristicas:**
  - Busca lista de paises via API `countriesnow.space`
  - Validacao em tempo real com `validateContactForm()`
  - 6 opcoes de servico com checkboxes estilizados
  - Envio via fetch para `/api/send-email`
  - Estados: enviando, sucesso, erro
  - Link para termos de servico

### 🦶 Footer (`components/footer/Footer.jsx`)
- **Tipo:** Client Component
- **Funcao:** Rodape do site com 3 colunas
- **Colunas:** Brand (logo + descricao), Navigation (links), Social (icones)
- **Icones:** Adapta entre versao light/dark conforme `prefers-color-scheme`

### 🔧 ServicesSection (`components/services/ServicesSection.jsx`)
- **Tipo:** Server Component
- **Funcao:** Grid de 4 cards de servicos com icones Feather
- **Servicos:** Front-End Development, Web Design & UI/UX, Data Analysis, Quality Assurance

### 🏠 HomeProjectInfo (`components/homeProjectInfo/HomeProjectInfo.jsx`)
- **Tipo:** Client Component
- **Funcao:** Grid de projetos na Home, carregados do Supabase
- **Caracteristicas:**
  - Cards glass com hover scale na imagem
  - Tags de tecnologias (maximo 4 + contador)
  - Botao "Details" abre popup modal
  - Botao "View all projects" leva para `/projects`

### 💬 Popup (`components/Popup/Popup.jsx`)
- **Tipo:** Client Component
- **Funcao:** Modal de detalhes do projeto
- **Caracteristicas:**
  - Backdrop blur + overlay escuro
  - Fecha com ESC, click fora, ou botao X
  - Bloqueia scroll do body quando aberto
  - Exibe imagem, tecnologias, link de deploy, descricao

### 📱 MobileMenu (`components/modals/MobileMenu.jsx`)
- **Tipo:** Client Component
- **Funcao:** Menu dropdown mobile com glassmorphism
- **Acessibilidade:** Fecha com ESC ou click fora

### 🎬 ScrollReveal (`components/utils/ScrollReveal.jsx`)
- **Tipo:** Client Component utilitario
- **Funcao:** Animacao de entrada ao scroll usando IntersectionObserver
- **Direcoes:** up, left, right, scale
- **Respeita:** `prefers-reduced-motion`

### ⏳ LazyMount (`components/utils/LazyMount.jsx`)
- **Tipo:** Client Component utilitario
- **Funcao:** Monta children apenas quando visivel na viewport (IntersectionObserver)
- **Uso:** Otimizacao de performance para componentes pesados

---

## 🔌 Servicos e Utilitarios

### `services/supabase.js`
Cliente Supabase inicializado com variaveis de ambiente. Exporta:
- `getProjects()` — Busca todos os projetos da tabela `project`
- `getWorkers()` — Busca todos os membros da tabela `workers`

### `lib/validateContact.js`
Funcao `validateContactForm(values)` que valida:
- Nome e sobrenome (minimo 2 caracteres)
- Email (formato valido)
- Telefone (opcional, minimo 8 digitos)
- Pais e idioma (obrigatorios)
- Servico (pelo menos um selecionado)
- Mensagem (minimo 10 caracteres)
- Termos aceitos

### `components/utils/heroInfo.js`
Dados estaticos para secoes hero (titulo, descricao, imagem, botao) — usado como fallback.

---

## 🔀 API Routes

### `POST /api/send-email` (`src/app/api/send-email/route.js`)
Endpoint para processar formularios de contato:

1. **Validacao server-side** — Revalida todos os campos
2. **Envio via Resend** (se `RESEND_API_KEY` estiver configurada):
   - Email HTML formatado com tabela de dados
   - Destinatario: `erickyhenriquesd@gmail.com`
3. **Fallback para Supabase** (se Resend nao configurada):
   - Salva na tabela `contact_submissions`

---

## 🎨 Sistema de Temas e Estilos

### Tema Claro (padrao)
- Background: `#ffffff`
- Texto: `#171717`
- Accent: `#8b5cf6` (roxo)

### Tema Escuro (`prefers-color-scheme: dark`)
- Background: `#0a0a0b`
- Texto: `#ededed`
- Accent: mantido `#8b5cf6`

### Variaveis CSS Customizadas
- `--background`, `--foreground`, `--primary`, `--primary-70`
- `--accent`, `--accent-light`, `--accent-dark`, `--accent-muted`, `--accent-glow`
- `--glass-bg`, `--glass-border`, `--glass-shadow`
- `--surface-elevated`, `--surface-subtle`
- `--stroke-container-divider`
- Gradientes: `--gradient-border-white`, `--gradient-fill-blue`, `--gradient-fill-sunset`

### Animacoes CSS
- **Marquee** — Scroll horizontal infinito (30s)
- **Gradient shift** — Animacao de gradiente de fundo (8s)
- **Float 1/2/3** — Orbs flutuantes (20-25s)
- **Pulse glow** — Pulsacao de brilho (4s)
- **Hero text in** — Entrada de texto com blur (1s, escalonado)
- **Shimmer** — Efeito de brilho deslizante (3s)
- **Reveal** — Scroll reveal (translateY 30px -> 0, 0.7s)
- **Reveal left/right** — Scroll reveal lateral (translateX 40px -> 0)
- **Reveal scale** — Scroll reveal com escala (0.9 -> 1)

### Glassmorphism
Classe `.glass-card` com:
- Background semi-transparente
- Borda sutil
- `backdrop-filter: blur(16px)`
- Sombra suave
- Hover: elevacao + borda roxa

---

## 🖼 Assets e Recursos Visuais

### Icones (`public/assets/icons/`)
Icones SVG em versao light e dark para:
- GitHub, LinkedIn, Instagram, Facebook, WhatsApp
- Logo da Fronnexus

### Imagens (`public/assets/image/`)
- Fotos de membros da equipe (Ericky.jpg, Gabriel.jpg)
- Logos em SVG e PNG
- Icones decorativos (hamburger, file, globe, sun)

### Videos (`public/assets/videos/`)
- `circle.gif` — Animacao decorativa

---

## 🔐 Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# Resend (opcional — se nao configurado, contatos sao salvos no Supabase)
RESEND_API_KEY=re_sua_chave_resend
```

---

## 🚀 Como Instalar e Rodar

### Pre-requisitos
- **Node.js** 18+ (recomendado 20+)
- **npm** (incluso com Node.js) ou **yarn** / **pnpm**

### 1. Clonar o repositorio
```bash
git clone https://github.com/dev-erickydias/fronnexus.git
cd fronnexus
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variaveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase e Resend
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

### 5. Build de producao
```bash
npm run build
npm run start
```

### 6. Linting
```bash
npm run lint
```

---

## 📥 Como Clonar o Repositorio

```bash
git clone https://github.com/dev-erickydias/fronnexus.git
```

---

## 📌 Observacoes Importantes

- O projeto usa **Next.js App Router** (nao Pages Router)
- O modo de desenvolvimento usa **Turbopack** para builds mais rapidos
- Os projetos e membros da equipe sao carregados dinamicamente do **Supabase**
- O formulario de contato tem validacao tanto no client quanto no server
- Todos os componentes WebGL (LightRays, Plasma, PixelBlast) tem cleanup adequado e otimizacao de performance com IntersectionObserver
- O tema escuro/claro e automatico via `prefers-color-scheme`
- O site e totalmente responsivo com breakpoints para mobile, tablet e desktop
- Acessibilidade: `aria-labels`, `focus-visible`, `prefers-reduced-motion`

---

> 📝 **Autor:** Ericky Dias
> 🔗 **GitHub:** [dev-erickydias](https://github.com/dev-erickydias)
> 📅 **Ultima atualizacao:** Abril 2026
