# Orlando 2026 Trip Planner

PWA mobile-first para acompanhar a viagem em família a Orlando entre 30/10/2026 e 14/11/2026.

## Rodar localmente

Este projeto não precisa de build nem backend. Sirva a pasta por HTTP para que `fetch`, manifesto e service worker funcionem corretamente:

```bash
cd orlando-trip-planner
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

## Testes básicos

1. Abra a aba **Hoje** e troque o dia para 03/11/2026. O alternador deve mostrar **Universal Studios** e **Islands of Adventure**.
2. Toque em **O que fazer agora?**. A sugestão deve ignorar atrações marcadas como **feito** ou **pular**.
3. Toque em **Feito** em uma atração. O cartão deve ficar riscado e o botão deve virar **Desfazer**.
4. Toque em **Reserva**, escolha tipo e horário, salve e confira a aba **Reservas**.
5. Recarregue a página. Status, reserva, horário e notas devem continuar salvos no `localStorage`.
6. Desligue a rede depois do primeiro carregamento e recarregue. A PWA deve abrir a partir do cache.

## Publicar como PWA

1. Publique todos os arquivos desta pasta em uma hospedagem estática com HTTPS, como GitHub Pages, Netlify, Vercel ou Cloudflare Pages.
2. Confirme que `index.html`, `app.js`, `styles.css`, `data.json`, `strategy-kb.json`, `manifest.webmanifest`, `service-worker.js` e a pasta `icons/` estão publicados.
3. Abra a URL no celular. No iPhone, use **Compartilhar > Adicionar à Tela de Início**. No Android/Chrome, use o prompt **Instalar** ou o menu do navegador.
4. A cada nova versão, altere o nome do cache em `service-worker.js` para forçar atualização dos arquivos offline.

## Usar offline no iPhone

1. Publique o app em uma URL HTTPS. Acesso por `file://` ou por IP local do Mac serve para teste visual, mas não é confiável para service worker/offline no iPhone.
2. No iPhone, abra a URL HTTPS no Safari.
3. Espere a página carregar totalmente.
4. Vá em **Dados > Modo offline** e confirme se aparece `cache offline ativo`. Se aparecer que o cache está sendo preparado, recarregue a página uma vez.
5. Toque em **Compartilhar > Adicionar à Tela de Início**.
6. Abra o app pelo ícone da tela inicial enquanto ainda estiver online.
7. Teste antes da viagem: ative o Modo Avião e abra o app pelo ícone. A tela **Hoje**, **Parques**, **Reservas** e **Dados** devem abrir com os dados locais.

O progresso de feito, pular, reservas e notas fica salvo no `localStorage` do iPhone. Antes da viagem, use **Dados > Exportar JSON** para guardar um backup.

## Arquivos principais

- `data.json`: roteiro oficial, atrações e preferências originais da família.
- `strategy-kb.json`: base local de estratégia criada a partir das fontes de roteiro.
- `seaworld-orlando-atracoes-parque-principal.xlsx`: fonte usada para atrações do SeaWorld Orlando.
- `legoland-florida-atracoes-parque-principal.xlsx`: fonte usada para atrações da LEGOLAND Florida.
- `app.js`: estado local, filtros, recomendações, reservas e persistência.
- `styles.css`: layout mobile-first e estados visuais.
- `SPEC.md`: especificação do produto.

## Persistência

O progresso fica no `localStorage` do navegador. Use a aba **Dados** para exportar/importar um backup JSON entre aparelhos.

Ao importar, o app preserva a base atual do `data.json` e aplica apenas os campos editáveis: status, tipo de reserva, horário e notas.

## Atualizar a base do roteiro

A lista de dias e atrações vem de `data.json`. Quando a planilha estiver mais completa, gere um novo JSON com a mesma estrutura (`itinerary` e `attractions`) e use **Dados > Atualizar base**.

Essa atualização fica salva no `localStorage` do aparelho e preserva progresso, reservas, horários e notas quando os IDs das atrações continuam iguais.

Use **Backup > Importar JSON** apenas para trocar progresso entre aparelhos. Use **Base do roteiro > Atualizar base** para trocar roteiro e atrações.
