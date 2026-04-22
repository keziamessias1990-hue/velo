# Documento de Casos de Testes - Velô Sprint

Este documento contém os casos de teste funcionais para o sistema Velô Sprint, cobrindo os módulos de Landing Page, Configurador de Veículo, Checkout/Pedido, Análise de Crédito, Confirmação e Consulta de Pedidos, para o perfil Cliente.

---

### CT01 - Acesso e Navegação na Landing Page

#### Objetivo
Garantir que o Cliente consegue acessar a página inicial, visualizar as informações do Velô Sprint e ser redirecionado para o Configurador.

#### Pré-Condições
- O sistema deve estar acessível na URL base.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL base do sistema | A Landing Page é carregada com sucesso exibindo o Hero, Especificações, FAQ e CTA. |
| 2  | Clicar no botão para configurar ou reservar o veículo | O sistema deve redirecionar o Cliente para a página do Configurador (`/configure`). |

#### Resultados Esperados
- O sistema apresenta as informações corretamente e navega para a página de configuração ao ser acionado o CTA.

#### Critérios de Aceitação
- A página carrega sem erros visuais.
- O redirecionamento para o configurador (`/configure`) funciona.

---

### CT02 - Configuração do Veículo (Cores e Rodas) e Cálculo do Preço Base

#### Objetivo
Validar se as escolhas de cores e rodas ("Sport") refletem corretamente no preço final exibido.

#### Pré-Condições
- Estar na página do Configurador (`/configure`).
- Preço base inicial deve ser de R$ 40.000,00 (Cor padrão + Rodas "Aero").

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Verificar o preço inicial de venda | O preço de venda deve ser R$ 40.000,00. |
| 2  | Selecionar uma cor exterior diferente ("Midnight Black" ou "Lunar White") | A cor do veículo no preview é alterada, mas o preço permanece R$ 40.000,00. |
| 3  | Selecionar a opção de roda "Sport Wheels" | A roda do veículo no preview é alterada e o preço total é atualizado com acréscimo de R$ 2.000,00 (Total: R$ 42.000,00). |
| 4  | Selecionar novamente a roda "Aero Wheels" | O preço total é decrementado em R$ 2.000,00, voltando para R$ 40.000,00. |

#### Resultados Esperados
- O preço dinâmico do veículo deve ser atualizado instantaneamente apenas ao alterar a roda para "Sport".

#### Critérios de Aceitação
- Rodas "Sport" devem custar exatamente +R$ 2.000.
- Trocar apenas a cor do exterior/interior não altera o preço base.

---

### CT03 - Configuração do Veículo (Adição de Opcionais) e Cálculo de Preço

#### Objetivo
Validar se a seleção de opcionais ("Precision Park" e "Flux Capacitor") atualiza dinamicamente o preço do veículo.

#### Pré-Condições
- Estar na página do Configurador.
- Veículo sem opcionais selecionados (Preço R$: 40.000,00).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Marcar o checkbox do opcional "Precision Park" | O preço de venda deve ser acrescido de R$ 5.500,00 (Total temporário: R$ 45.500,00). |
| 2  | Marcar o checkbox do opcional "Flux Capacitor" | O preço de venda deve ser acrescido de R$ 5.000,00 (Total temporário: R$ 50.500,00). |
| 3  | Desmarcar os checkboxes dos opcionais | O preço total deve subtrair os valores respectivos e voltar a R$ 40.000,00. |
| 4  | Clicar no botão "Monte o Seu" (Checkout) | O usuário é redirecionado para a página de checkout (`/order`) com os valores persistidos. |

#### Resultados Esperados
- O preço total acompanha de forma exata a marcação e desmarcação dos opcionais.
- O redirecionamento leva a configuração e o preço corretos para o Checkout.

#### Critérios de Aceitação
- O opcional "Precision Park" custa +R$ 5.500 e "Flux Capacitor" custa +R$ 5.000.

---

### CT04 - Checkout - Validação de Campos Obrigatórios e Dados Inválidos

#### Objetivo
Validar os critérios de obrigatoriedade dos campos de dados pessoais no Checkout.

#### Pré-Condições
- O cliente configurou o carro e está na página de Checkout (`/order`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar todos os campos do formulário em branco e clicar em "Confirmar Pedido" | O sistema não avança e exibe mensagens de erro sob os campos (Nome, Sobrenome, Email, Tel, CPF, Loja, Termos). |
| 2  | Inserir apenas 1 letra no campo "Nome" e "Sobrenome" e confirmar | O sistema exibe erro: "Nome deve ter pelo menos 2 caracteres". |
| 3  | Inserir um e-mail sem formato válido (ex: `cliente@.com`) e confirmar | O sistema exibe erro: "Email inválido". |
| 4  | Inserir CPF incompleto ou inválido e confirmar | O sistema exibe erro de "CPF inválido". |
| 5  | Preencher todos os campos corretamente, mas não marcar "Li e aceito os Termos" | O sistema exibe erro: "Aceite os termos". |

#### Resultados Esperados
- Nenhuma submissão real é feita se o formulário apresentar erros de validação nos dados fornecidos pelo cliente.

#### Critérios de Aceitação
- Nome e Sobrenome devem exigir mínimo de 2 caracteres.
- Telefone e CPF exigem formato e quantidade mínima de caracteres completados (máscara preenchida).
- O checkbox de termos deve ser obrigatoriamente marcado.

---

### CT05 - Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)

#### Objetivo
Validar a criação de um pedido bem-sucedido com pagamento à vista.

#### Pré-Condições
- Estar na rota de Checkout com um carro de configuração básica (R$ 40.000,00).
- Dados pessoais preenchidos e válidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher o formulário com dados válidos e selecionar a loja | Os campos não apresentam erros. |
| 2  | Selecionar a aba "À Vista" na Forma de Pagamento | O valor total de "Resumo" e "À Vista" exibem R$ 40.000,00. |
| 3  | Marcar o aceite dos termos de uso e clicar em "Confirmar Pedido" | O botão mostra status de carregamento e o pedido é direcionado para a página de Confirmação (`/success`). |
| 4  | Verificar a página de Confirmação | A página exibe "Pedido Aprovado!", gerando um número de pedido e informações do cliente e resumo. |

#### Resultados Esperados
- Pedido à vista é criado imediatamente com status de `APROVADO`.

#### Critérios de Aceitação
- Pedido `APROVADO` para pagamentos à vista (sem análise de crédito necessária).

---

### CT06 - Checkout e Análise de Crédito - Financiamento com Score Alto (Aprovado)

#### Objetivo
Validar a regra de aprovação automática de crédito quando o score do CPF for maior que 700 no financiamento.

#### Pré-Condições
- Estar no Checkout com um carro base (R$ 40.000,00).
- Utilizar um CPF de teste que retorne `Score > 700` na API de análise.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher formulário válido usando um CPF com score alto | Sem erros de preenchimento. |
| 2  | Selecionar "Financiamento" e preencher "Valor da Entrada" como `0` | Parcela (12x) reflete o cálculo com 2% a.m: `(40000 / 12) * 1.02`. |
| 3  | Aceitar os termos e clicar em "Confirmar Pedido" | Sistema envia CPF para análise de crédito e processa a requisição. |
| 4  | Observar a navegação pós-submissão | O sistema direciona à página de sucesso exibindo "Pedido Aprovado!". |

#### Resultados Esperados
- O pedido é registrado no sistema com o status `APROVADO` de forma automática, validando o Score Alto.

#### Critérios de Aceitação
- Se o campo modalidade de pagamento for Financiamento e o Score retornado for > 700, o status é Aprovado.

---

### CT07 - Checkout e Análise de Crédito - Financiamento com Score Médio (Em análise)

#### Objetivo
Validar a regra do score de crédito moderado, que destina o pedido para verificação manual.

#### Pré-Condições
- Estar no checkout com um veículo e entrada configuradas.
- Utilizar um CPF de teste que retorne um Score entre `501 e 700` na API.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher dados válidos com CPF de score entre 501 e 700 | Campos válidos. |
| 2  | Selecionar "Financiamento", entrada `0`, aceitar termos e confirmar | Sistema processa a requisição de crédito. |
| 3  | Observar a confirmação de criação do pedido | A rota redireciona, mas o aviso visual deve demonstrar que o pedido foi criado com status "EM ANÁLISE" (ícone de relógio na consulta do pedido ou texto correspondente). |

#### Resultados Esperados
- O pedido é registrado no sistema com o status `EM_ANALISE`.

#### Critérios de Aceitação
- Pedidos com Score de 501 a 700 recebem status `EM_ANALISE`.

---

### CT08 - Checkout e Análise de Crédito - Financiamento com Score Baixo (Reprovado)

#### Objetivo
Validar a regra de reprovação de crédito quando o Score for menor ou igual a 500 no financiamento.

#### Pré-Condições
- Estar no checkout com veículo configurado e sem entrada (ou entrada menor que 50%).
- Utilizar um CPF de teste que retorne `Score <= 500`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher dados com formulário válido, inserindo um CPF com score baixo | Os campos ficam válidos. |
| 2  | Na aba Financiamento, informar entrada inferior a 50% do total | Formulário preenchido e parcelas calculadas da diferença. |
| 3  | Aceitar termos e clicar em "Confirmar Pedido" | Sistema processa e avalia o crédito pela API. |
| 4  | Observar a página resultante (`/success`) | O redirecionamento ocorre, mas a página exibe "Crédito Reprovado" ou falha visual (ícone de X) com a mensagem apropriada. |

#### Resultados Esperados
- O pedido de financiamento com score baixo é salvo como `REPROVADO` e o usuário não prossegue no fluxo feliz.

#### Critérios de Aceitação
- Score <= 500 e entrada < 50% resultam na reprovação absoluta do pedido.

---

### CT09 - Checkout e Exceção de Crédito - Financiamento com Entrada >= 50% e Score Baixo (Aprovado)

#### Objetivo
Validar a regra de exceção na aprovação de crédito, garantindo que qualquer Score seja ignorado e o status seja `APROVADO` quando a entrada atinge 50% do total.

#### Pré-Condições
- Veículo base R$ 40.000,00 no Checkout.
- Utilizar um CPF de teste que retorne `Score <= 500` (que deveria reprovar normalmente).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher campos obrigatórios e usar CPF de Score Baixo | Tudo preenchido corretamente. |
| 2  | Escolher "Financiamento" e definir "Valor da Entrada" igual a `20000` (50% do total) ou `25000` | Resumo atualiza e a parcela exibe o valor diluído: `((Total - Entrada) / 12) * 1.02`. |
| 3  | Aceitar termos e clicar em "Confirmar Pedido" | Sistema efetua solicitação em background. |
| 4  | Verificar rota de confirmação | Navegação finalizada com a mensagem de "Pedido Aprovado!", comprovando que a exceção da entrada sobrepôs a reprovação do score baixo. |

#### Resultados Esperados
- A regra de entrada prevalece e o pedido entra direto com o status `APROVADO`.

#### Critérios de Aceitação
- Quando `(Entrada / Valor Total) >= 0.5`, o resultado é invariavelmente Aprovado independentemente da pontuação < 700.

---

### CT10 - Consulta de Pedidos - Consultar um Pedido Existente com Sucesso

#### Objetivo
Garantir que um usuário comum pode revisar o status de sua compra digitando um número de pedido válido.

#### Pré-Condições
- O cliente deve ter em mãos um número de pedido válido criado anteriormente (ex: `VLO-ABCD10`).
- Acessar a página de Consultar Pedido (`/lookup`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar o número do pedido válido no campo "Número do Pedido" | O campo aceita e permite prosseguir. |
| 2  | Clicar no botão "Buscar Pedido" | O sistema deve entrar em estado de `loading` por uns instantes. |
| 3  | Aguardar a apresentação dos dados | O componente exibe um card com: Status atual (Aprovado/Em Analise/Reprovado), Informações do Carro (Core, Opcionais), Dados do Cliente e Valores Financeiros. |

#### Resultados Esperados
- A exibição do pedido consultado confere perfeitamente com os dados do pedido recém efetuado no banco.

#### Critérios de Aceitação
- Somente com um `order_number` real o sistema retorna os dados do pedido com segurança.

---

### CT11 - Consulta de Pedidos - Número de Pedido Não Encontrado (Inválido)

#### Objetivo
Validar que ordens não cadastradas ou strings aleatórias não vazam dados nem travam a consulta, demonstrando erro de não existência.

#### Pré-Condições
- Acessar a página de Consultar Pedido (`/lookup`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir um número de pedido que não existe ou formato incorreto (ex: `VLO-INEXISTENTE`) | Form preenchido com ordem fake. |
| 2  | Clicar em "Buscar Pedido" | O sistema busca na API e não encontra correspondente. |
| 3  | Observar o feedback na interface | O sistema mostra de forma visível a mensagem "Pedido não encontrado" e o ícone de X num painel vermelho. Dados em branco continuam ocultos. |
| 4  | Clicar em buscar com o campo de pedido vazio | O botão deve permanecer desabilitado antes de fornecer algum caractere. |

#### Resultados Esperados
- Segurança e estabilidade de tela diante de consultas inválidas. Nenhuma exception exposta.

#### Critérios de Aceitação
- Se `orderId` não retorna dados exatos pela API, o feedback de falha "Pedido não encontrado" é retornado de forma amigável ao cliente.