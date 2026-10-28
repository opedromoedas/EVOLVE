# EVOLVE Design Lab — Sci-Fi / Future Interface 0.2

**Ambiente experimental isolado:** `https://opedromoedas.github.io/EVOLVE/design-lab/`

A aplicação principal (`/`) e a beta (`/beta/`) **não são modificadas**. Este diretório contém uma variante visual da beta anterior e uma vitrine de design system com estética Sci-Fi.

## Experiências

- **EVOLVE Future Lab:** `/design-lab/` — interface mobile-first com gráficos de telemetria local, HUD, controles e transições.
- **Motion Kit:** `/design-lab/design-system.html` — biblioteca interativa de tipografia, paleta, botões, radar, gráficos vetoriais, indicadores e exemplos de microinterações.
- **Design original da beta:** `/beta/` — permanece inalterado.

## Visualizações e animações

- Grade espacial, reflexos sutis, transições de cartões, navegação e botões.
- Painel **MISSION CONTROL** exibe apenas contagens reais de atividades dos últimos 7 dias, número de metas e dias com atividades realizadas. Sem registros, os indicadores são apresentados como `0` (não são inventados).
- Radar geométrico, anel de progresso, linhas SVG animadas, scanner de fundo e indicador de status decorativos.
- Motion Kit com controles funcionais para ligar/desligar animações, esconder radar, repetir gráfico e animar indicadores.
- Preferência de animações armazenada em `evolve_scifi_motion_v02` no navegador; segue `prefers-reduced-motion` do sistema operacional.

## Arquivos alterados / criados apenas neste diretório

- `index.html` adiciona `scifi.css` e `scifi.js`.
- `scifi.css` contém tokens experimentais e estados visuais responsivos.
- `scifi.js` lê a versão local para alimentar **apenas** indicadores de contagem e registra as preferências de movimento.
- `design-system.html` adiciona exemplos e controles de motion.
- `scifi-kit.css` e `scifi-kit.js` implementam os exemplos interativos da vitrine.
- `sw.js` usa cache `evolve-designlab-v02-scifi` e mantém escopo exclusivo `/design-lab/`.

## Privacidade e qualidade

- O app mantém a chave local **`evolve_designlab_v1`**; não compartilha localStorage com o app principal ou beta.
- Nenhuma meta, nota pessoal ou detalhe de saúde é enviada pelos componentes de design. `scifi.js` somente deriva quantidades locais e não faz requisições externas.
- `config.js` permanece sem credenciais de terceiros; Google e Supabase não são habilitados por esta mudança.
- A biblioteca demonstra números fictícios com aviso explícito; o gráfico do app usa os dados reais locais.
- Tema claro/escuro, foco via teclado, dispositivos móveis e preferência por movimento reduzido são contemplados.

Este design é exploratório: validar legibilidade, compreensão dos gráficos e fluidez com usuários antes de aplicar qualquer componente à beta principal.