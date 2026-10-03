Quero que você trabalhe neste repositório como meu agente de desenvolvimento para um aplicativo pessoal chamado “Orlando 2026”.

CONTEXTO
É um aplicativo mobile-first para eu usar no celular durante uma viagem em família a Orlando entre 30/10/2026 e 14/11/2026. O arquivo `data.json` já contém meu roteiro oficial e uma base de atrações extraída da minha planilha, com parque, área, altura mínima, restrições, notas de preferência da família, ranking e tipo de Lightning Lane / Single Pass / Express Pass. O arquivo `SPEC.md` descreve o produto.

OBJETIVO DA PRIMEIRA ITERAÇÃO
1. Revise o código existente e rode o app localmente.
2. Corrija bugs e melhore a experiência mobile sem remover nenhuma informação do `data.json`.
3. Preserve o funcionamento offline e a persistência em localStorage.
4. Melhore a tela “Hoje” para parques: mostrar obrigatórias primeiro, reservas próximas em destaque, progresso, e um botão “O que fazer agora?”.
5. No dia 03/11, suporte Universal Studios Florida + Islands of Adventure no mesmo dia e permita alternar os dois parques.
6. Crie uma visualização clara de LL/SL/Express: reservado, horário e tipo.
7. Permita marcar atração como feito com um toque e desfazer.
8. Não crie backend nesta etapa.
9. Faça testes básicos e documente no README como executar localmente e como publicar como PWA.

REGRAS DE PRODUTO
- O app precisa ser rápido de operar com uma mão no celular.
- Evite telas cheias de texto; use cartões, badges e ações grandes.
- Nunca substitua ou recalcul​e as preferências da família. Elas são dados de entrada.
- O ranking menor é melhor.
- A prioridade inicial é: ranking <=1,8 obrigatória; <=2,6 se der tempo; acima disso pode pular.
- Reservas com horário dentro das próximas 2 horas devem ganhar prioridade visual.
- Se a atração já estiver “feito” ou “pular”, não deve aparecer em “O que fazer agora?”.

Ao terminar, me mostre: arquivos alterados, decisões de arquitetura, como testar e 5 melhorias recomendadas para a próxima iteração.