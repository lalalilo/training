# training-devdays

To install dependencies:

```bash
brew install bun
bun install
```

Copy environment variables:

```bash
cp .env.local.example .env.local
```

Modify .env with values from 1password "LaliloAIOpenAI".

To run:

```bash
bun run src/reset.ts

bun run src/index.ts "query string"
```
