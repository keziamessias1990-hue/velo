# Legado — Page Objects (classes)

Neste repositório **não há** arquivos de Page Object em estilo `class` / herança para mover para cá.

A suíte E2E já está no padrão **Actions** (`create*Actions`) + fixture **`app`** em `playwright/support/fixtures.ts`.

Se você adicionar Page Objects antigos durante uma migração, coloque-os nesta pasta (`playwright/backup/legacy/`) para manter o histórico sem misturar com o código ativo.
