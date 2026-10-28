# EVOLVE Life Intelligence / Owner Lab (experimento)

- **Meus Lugares:** `design-lab/lugares.html`, cadastro local de locais associados a metas; check-ins manuais; geolocalização pontual apenas sob interação; backups JSON.
- **Central do Proprietário:** `design-lab/owner.html`, dados fictícios para UX demo e, quando Supabase estiver configurado, acesso real **somente** ao usuário presente na tabela `evolve_research_admins`.
- A central real lê apenas eventos consentidos e categorias já permitidas pelo esquema `supabase/research.sql`. **Não armazena IP bruto, nome ou descrição livre das metas**; isso exigiria políticas e consentimento próprios, backend restrito e avaliação da finalidade.
- Para ativar dados reais: configure `design-lab/config.js` com credenciais *publicáveis* do Supabase; execute `supabase/schema.sql` e `supabase/research.sql`; crie conta e adicione o UUID dela à tabela de administradores via SQL Editor, nunca pelo frontend.
- Não use o botão de demonstração como prova de tráfego real. Não há rastreamento de GPS em segundo plano ou sincronização entre aparelhos nesta versão.
