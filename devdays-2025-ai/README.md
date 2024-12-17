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

```bash
bun run src/index.ts "country code"
```

```
1. **Issue:** "Invalid country code in RGP rostering" for tenant `8619140`.
   **Context:** Grégoire noted a prior request for tenants `7835607` & `8731389` but now raised the issue for a new tenant, referencing discussions with Anaïs, Marion, and an email thread with Danita. Marion suggested scheduling a meeting with Danita to investigate account provisioning errors.
   **Dates:** Discussion occurred on **2024-11-26** and **2024-11-27**.
   **Team members with context:** Grégoire, Marion, Anaïs, and potentially Danita.

2. **Issue:** "Job Failed: demo-districts-pipeline-28876500" on `us-east-1-staging-purple-cluster`.
   **Comments:** None provided.
   **Resolution:** Unknown.
   **Date:** Not specified.

3. **Issue:** Another instance of "Invalid country code in RGP rostering."
   **Comments:** None provided.
   **Resolution:** Unknown.
   **Date:** Not specified.

4. **Issue:** "Job Failed: set-onboarding-notification-6" on `us-east-1-production-purple-cluster`.
   **Comments:** None provided.
   **Resolution:** Unknown.
   **Date:** Not specified.
```

- [ ] Explain the default setup and customization options
- [ ] Explain the default workflow and how to customize it
  - Llama Index
  - Vercel AI SDK
- [ ] Add more examples in db
