Você é um Analista de Qualidade Sênior experiente em testes funcionais de software.

Sua tarefa é criar um documento completo de Casos de Testes para o sistema descrito abaixo, seguindo rigorosamente as instruções e o modelo fornecidos.

---

## Informações do Sistema

**Nome do sistema:** Velô Sprint - Configurador de Veículo Elétrico

**Descrição:** Uma SPA (Single Page Application) web desenvolvida em React que permite aos usuários configurar, simular financiamentos e realizar a compra do veículo elétrico Velô Sprint. O sistema calcula preços dinamicamente com base nas escolhas do cliente e possui integração com uma API de análise de crédito para validar as compras.

**Módulos/Funcionalidades a cobrir:** Landing Page, Configurador de Veículo, Checkout/Pedido, Análise de Crédito Automática, Confirmação, Consulta de Pedidos.

**Perfis de usuário:** Cliente (Usuário Comum).

**Regras de negócio relevantes:** 
- Precificação: O carro possui um valor base de R$ 40.000. Adicionar rodas "Sport" custa +R$ 2.000. Adicionar "Precision Park" custa +R$ 5.500. Adicionar "Flux Capacitor" custa +R$ 5.000.
- Juros de Financiamento: Se a opção for parcelada, o financiamento é travado em 12x com uma taxa fixa de juros compostos de 2% ao mês.
- Análise de Crédito por Score: Score > 700 (Aprovado), 501 a 700 (Em análise), <= 500 (Reprovado).
- Exceção na Aprovação de Crédito: Entrada >= 50% do valor total aprova automaticamente o pedido, ignorando o score de crédito.
- Segurança de Dados: A consulta de pedidos requer o número do pedido (`order_number`).

---

## Escopo dos Testes

Cobrir obrigatoriamente:
- Testes funcionais (blackbox)
- Cenários positivos (fluxo feliz)
- Cenários negativos (erros, dados inválidos, permissões negadas)
- Validação de campos obrigatórios
- Validação de regras de negócio
- Fluxos principais e alternativos
- Permissões e níveis de acesso por perfil de usuário

Não incluir:
- Testes de performance
- Testes de carga ou estresse
- Testes automatizados
- Testes de segurança avançados

---

## Modelo de Caso de Teste

Cada caso de teste deve seguir exatamente este formato:

---

### CT[NN] - [Nome descritivo do caso de teste]

#### Objetivo
[Descrição clara e objetiva do que está sendo validado.]

#### Pré-Condições
- [Condição 1]
- [Condição 2]
- [...]

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | [Ação do usuário] | [Comportamento esperado do sistema] |
| 2  | [...] | [...] |

#### Resultados Esperados
- [Descreva o estado final esperado do sistema após todos os passos.]

#### Critérios de Aceitação
- [Critério objetivo 1]
- [Critério objetivo 2]
- [...]

---

## Instruções de Geração

1. Numere os casos de teste sequencialmente: CT01, CT02, CT03...
2. Cubra no mínimo os seguintes fluxos base para cada módulo informado:
   - Operação bem-sucedida (fluxo feliz)
   - Operação com dados inválidos ou incompletos
   - Operação sem permissão adequada (quando aplicável)
3. Inclua casos de teste para validação de campos obrigatórios.
4. Inclua casos de teste para cada perfil de usuário listado, sempre que houver comportamentos distintos.
5. Seja detalhado nos passos — cada ação deve ser clara o suficiente para que qualquer pessoa execute o teste sem dúvidas.
6. Gere o resultado em formato Markdown, pronto para ser salvo em um arquivo `.md` dentro da pasta `docs/tests` do projeto.