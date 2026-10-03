# Orlando 2026 — Especificação do aplicativo

## Objetivo
Aplicativo mobile-first para acompanhar a viagem em tempo real. Deve funcionar como uma lista inteligente do dia: roteiro oficial, atrações, preferências da família, Lightning Lane / Single Pass / Express Pass, reservas e progresso.

## Usuários
Família em viagem a Orlando em 30/10–14/11/2026. Uso principal no celular dentro dos parques.

## Requisitos essenciais
1. Tela **Hoje**: evento do dia, plano, refeições, progresso do parque e recomendações.
2. Tela **Parques**: lista completa por parque, busca e filtros.
3. Cada atração tem: área, altura mínima, restrições, preferência individual, ranking, prioridade, tipo de fila/passe e observações.
4. Status editáveis: `não feito`, `reservado`, `feito`, `pular`.
5. Reserva editável com horário e tipo: Multi Pass, Single Pass, Express Pass, fila normal ou Rider Switch.
6. Tela **Reservas** ordenada por horário.
7. Persistência local e funcionamento offline.
8. Exportar/importar JSON para backup entre aparelhos.
9. Nunca apagar preferências originais ao atualizar status.

## Prioridade inicial
- ranking <= 1,8: obrigatória
- ranking > 1,8 e <= 2,6: se der tempo
- ranking > 2,6: pode pular

## Evoluções desejadas
- separar Universal Studios e Islands no mesmo dia e permitir alternar entre os dois.
- campo de fila atual informado manualmente.
- botão “O que fazer agora?” considerando prioridade + reserva próxima + área atual + altura das crianças.
- perfis dos viajantes e seleção de quem fará cada atração.
- Rider Switch com Grupo A / Grupo B.
- check-in de restaurante, show e compras.
- sincronização entre celulares via Supabase somente numa segunda fase.
- possibilidade de importar novamente a planilha sem perder o progresso local.
