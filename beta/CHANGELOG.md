# EVOLVE Beta — Histórico de versões

## 0.3 — 28 de outubro de 2026

- UX Research opcional: consentimento, revogação e exportação de dados locais.
- Eventos de uso restritos a categorias; textos privados e calendários não são coletados.
- Feedback qualitativo voluntário e Research Lab com importação local.
- Esquema SQL de pesquisa com RLS para futura integração autenticada ao Supabase.
- Corrigido o cache offline da PWA: cada página mantém sua própria resposta, sem exibir a tela principal quando o usuário pede o painel de pesquisa.
- Atualização do cache da PWA para que versões antigas sejam substituídas após acesso online.

**Ainda pendente:** autenticação Supabase, coleta centralizada e integração Google Calendar precisam de configuração externa; o Research Lab sem essa configuração usa importação voluntária de arquivos JSON.
