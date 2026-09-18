# LAB 04 — Falha às 18:47

Escape Room Digital para a Semana Tecnológica. Projeto escolar do 2º ano do Ensino Médio.

O jogador é o monitor do turno que ficou para desligar as máquinas do Laboratório 04.
Às 18:47 a rotina de backup trava, o sistema bloqueia e a porta só libera pelo terminal principal.
É preciso investigar 5 estações, anotar pistas e restaurar o sistema antes do modo de segurança.

Tempo estimado de jogo: 10 a 15 minutos.

## Tecnologias

Somente HTML, CSS e JavaScript puro. Sem frameworks, sem backend, sem dependências externas.

IA, GitHub, Codespaces e OpenCode são ferramentas de apoio. O jogo final continua só com as 3 tecnologias acima.

## Como executar

Opção 1 — duplo clique (mais simples para a apresentação):
1. Abra a pasta do projeto.
2. Dê duplo clique em `index.html`.

Opção 2 — servidor local (recomendado no Codespaces):
```
python3 -m http.server 8000
```
Depois abra `http://localhost:8000`.

O jogo funciona sem internet. Não há imagens ou sons externos nesta etapa.

## Estrutura

```
/
├── index.html          # 3 telas: menu, jogo, fim + modal genérico
├── src/
│   ├── css/
│   │   └── style.css   # identidade visual (grafite + papel + âmbar)
│   ├── js/
│   │   └── main.js     # estado, telas, timer, exploração base
│   └── assets/
│       ├── images/     # vazio na Etapa 2 (uso futuro e opcional)
│       └── sounds/     # vazio na Etapa 2 (áudio sempre opcional)
└── README.md
```

Por que `script` clássico e não `type="module"`:
para o jogo abrir com duplo clique via `file://` sem erro de CORS.
Quando o JS for dividido, usar várias tags `<script>` clássicas, não `import`.

## Estado atual — Etapa 2 (estrutura base)

Pronto:
- Menu com briefing curto e como jogar.
- Mapa com 5 estações clicáveis.
- Registro, inventário e lista de pistas.
- Cronômetro de 15 minutos com tela de falha.
- Tela final com tempo, erros, pistas e dicas.
- Reinício e layout responsivo básico.

Placeholder (entra nas próximas etapas):
- Puzzles reais, códigos e senha final.
- Uso de itens (ex: chave no armário).
- Sistema de dicas graduais.
- Sons opcionais.

## Como continuar no Codespaces com a IA do GitHub

Este repositório foi preparado para desenvolvimento por etapas.
Cole na IA do Codespaces o próximo bloco, um por vez:

Etapa 3 — ambiente:
"Leia index.html, src/css/style.css e src/js/main.js. Sem reescrever os arquivos, expanda a função inspecionar() para cada estação ter descrição própria de 2 a 4 linhas, sem emojis e sem texto genérico. Mantenha HTML+CSS+JS puro e funcionamento via file://. Teste: clicar nas 5 estações, reabrir modal, Esc fecha."

Etapa 4 — mecânicas:
"Adicione inventário usável e registro de erros em src/js/main.js. Ex: encontrar chave na bancada e usar no armário. Não duplicar item em clique rápido. Erro de código soma em jogo.erros. Preserve timer, telas e reinício."

Etapa 5 — puzzles:
"Implemente 4 puzzles ligados à história (bilhete + etiqueta, login 4 dígitos, sequência do painel, senha final). Dificuldade crescente, respostas com trim, sem quebrar com letras/espaços. Vitória só pelo terminal principal via encerrar(true,...)."

Regra para a IA: ler o código atual antes de mudar, fazer alteração pequena, revisar efeitos colaterais e não reescrever arquivos inteiros.

## Uso de IA

IA usada como apoio para planejamento, estrutura e revisão.
Decisões de história, puzzles e visual foram definidas pelo aluno.
Cada etapa é testada antes de avançar (botões, timer, puzzles, inventário, vitória, derrota, reinício, console sem erros).

## Autor

Projeto escolar — 2º ano do Ensino Médio — Semana Tecnológica.
