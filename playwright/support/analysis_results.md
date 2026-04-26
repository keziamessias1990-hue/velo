# Análise de Falha no teste `valida.pedido.spec.ts`

## 1. O Problema Relatado
Durante a execução, o Playwright reportou que a falha ocorreu na seguinte instrução da fixture associada ao `orderLookupActions`:

```typescript
async open() {
  await page.goto('/lookup')
}
```

## 2. Ponto de Quebra e Diagnóstico
A instrução de falha ocorre logo no gatilho `test.beforeEach`, onde o Playwright tenta renderizar a interface no navegador para **antes** sequer de injetar os dados usando o banco com Kysely:

```typescript
test.beforeEach(async ({ app }) => {
  await app.orderLookup.open() // <--- O erro bloqueante bate aqui
})
```

Como o Playwright não passou desse ponto, isso significa que a conexão com a nossa biblioteca recém-criada (Kysely) sequer rodou e falhou. A razão da exceção não é de banco, e sim uma incapacidade do Playwright de acessar a URL de Front-End configurada no projeto (porta 5173).

## 3. Motivo Principal (`net::ERR_CONNECTION_REFUSED`)
Em `playwright.config.ts`, a automação de iniciar e derrubar o servidor Vite com a execução dos testes está desativada (`webServer` comentado). Portanto:
1. Se o Front-End web (`npm run dev`) não for mantido aberto explicitamente num terminal separado executando na porta `localhost:5173`, o Playwright não consegue renderizar `/lookup`.
2. O teste é abortado antes mesmo do `insertOrder` do Kysely ser chamado no corpo principal do teste.

## 4. Solução Proposta e Próxima Iteração (Ação Tomada)
Vou alterar o `playwright.config.ts` do seu projeto para instruir o motor do Playwright a administrar o servidor web para nós de maneira invisível. Ele abrirá a aplicação rodando `npm run dev` antes dos testes e matará quando os testes acabarem garantindo que o `page.goto` sempre encontre o localhost online.
