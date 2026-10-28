# EVOLVE Beta — protótipo multiusuário de evolução pessoal

**Pasta publicada:** `/beta/` do repositório `opedromoedas/EVOLVE`.

**Link após habilitar GitHub Pages:** https://opedromoedas.github.io/EVOLVE/beta/

## O que funciona hoje, sem credenciais

- Onboarding guiado, objetivos semanais e prioridades.
- Gerador de rotina de 28 dias com conflitos de trabalho, deslocamento e intervalos de 10 min.
- Agenda semanal, atividades manuais, marcação de conclusão e falta.
- Check-ins: sono, energia, humor, água, alimentação e notas.
- Gráficos, insights baseados em regras, revisão semanal e Coach com respostas locais.
- Replanejamento de atividades não realizadas (sem alterar eventos externos).
- Compartilhar resumo, feedback Beta por issue pública, exportação/importação JSON, CSV e exportação .ics para Apple Calendar.
- Layout mobile-first, modo claro e escuro, PWA e cache offline após primeira visita.

**IMPORTANTE:** sem projeto Supabase, os dados ficam SOMENTE no `localStorage` do navegador. **Não há contas reais sem configuração.** Demonstração é um ambiente local, não um login. O Google Calendar não é acessado sem OAuth. O .ics **não lê** eventos do iPhone e não oferece sincronização bidirecional. A versão PWA não implementa EventKit nativo da Apple. O Coach local usa regras, não um modelo de IA generativa. Compartilhamento é de texto, não acompanhamento de amigos em tempo real.

## Habilitar contas reais para testadores com Supabase

1. Crie um projeto em https://supabase.com/dashboard (você administra o acesso).
2. No painel SQL Editor, execute `supabase/schema.sql` deste repositório.
3. Em Authentication, habilite e configure `Email`/magic links e configure URLs permitidas:
   - Site URL: `https://opedromoedas.github.io/EVOLVE/beta/`
   - Redirect URL: `https://opedromoedas.github.io/EVOLVE/beta/`
4. Copie **Project URL** e chave **anon/publishable** (pública) para `beta/config.js`.
5. **Nunca** publique `service_role`, JWT secret, `client_secret` do Google ou chave de OpenAI no GitHub.
6. Os testadores poderão usar **Configurações → Entrar com e-mail**. Cada usuário terá sua linha em `evolve_workspaces`, protegida por RLS.

*Limites da versão beta:* estado do usuário persistido em um JSON por conta; sincronização por último salvamento (não abra o mesmo usuário simultaneamente em vários aparelhos sem backups). Para produção, separar tabelas (goals/events/checkins), migrations e resolver conflitos multi-dispositivo.

## Habilitar Google Calendar (opcional, requer Google Cloud)

1. Crie um projeto no Google Cloud Console e habilite a **Google Calendar API**.
2. Configure a **OAuth consent screen**, incluindo as contas de teste enquanto estiver em modo de teste, e solicite apenas permissões de calendário necessárias.
3. Crie um OAuth 2.0 **Web application client ID**. Authorized JavaScript origins: `https://opedromoedas.github.io`. Não use a URL com `/EVOLVE/beta/` como origem.
4. Adicione o **Client ID público** a `beta/config.js` em `googleClientId`.
5. O testador escolhe **Configurações → Conectar Google → Ler horários ocupados → Gerar rotina → Enviar eventos**. A aplicação pede confirmação antes de criar cada lote de eventos.

A permissão atual usa `calendar.events`. Tokens são mantidos apenas na memória da sessão. O app lê eventos ocupados para o planejamento somente quando solicitado e não sincroniza modificações após o envio. Eventos criados registram `extendedProperties.private.evolveId` para reconhecimento posterior. Para versão de produção, implementar refresh seguro no backend, validação bidirecional, tratamento de recorrência, expiração e gestão de quotas.

## Calendário Apple

O aplicativo web oferece **Agenda → Calendário Apple (.ics)**. Abra o arquivo e importe manualmente no seu calendário Apple. Leitura e criação direta de eventos locais requer app iOS nativo com EventKit/Expo Calendar e permissões específicas, que fazem parte da evolução do produto.

## IA generativa e recursos sociais

Coach base utiliza regras locais e dados de check-in para explicar padrões, sugerir foco e replanejar. `app.js` tem gancho para Supabase Edge Function `coach` (`supabase.functions.invoke`) — servidor e credenciais seguras ainda não foram provisionados. Em produção, a Edge Function precisa autenticar o usuário, aplicar rate limit e chamar o provedor de IA por variável de ambiente privada. **Nunca** coloque chave de IA no app.

Compartilhamento permite enviar um resumo (texto) pelos mecanismos nativos do dispositivo. Conexões entre usuários, convites e desafios em tempo real exigem tabelas e políticas adicionais de autorização — não estão presentes nesta Beta.

## Publicação

Os arquivos estáticos estão em `/beta`. Não substituem o antigo `/index.html` e não migram automaticamente os dados da versão anterior. Exporte backup do painel antigo antes de testar. Mantenha GitHub Pages configurado com `main / (root)`.

## Privacidade e testes

- Avisar claramente aos usuários que a versão Beta não tem backup em nuvem antes do Supabase.
- Nenhum dado de perfil ou registro pessoal deve entrar no repositório GitHub.
- Issues abertas no GitHub são **públicas**; não envie registros privados em feedback.
- Após provisionar produção, adotar LGPD, política de privacidade, consentimento para calendários, retenção, exclusão de dados e processo de segurança.

## Teste rápido

1. Abra `/beta/` no navegador, clique **Explorar demonstração**.
2. **Minhas metas → Montar rotina → Aplicar meu plano**.
3. **Minha agenda → Concluir atividade**; **Registro diário → Salvar check-in**.
4. **Sua evolução** para ver gráfico e feedback; **Configurações** para backups.
5. Em Safari iPhone, **Compartilhar → Adicionar à Tela de Início**.
