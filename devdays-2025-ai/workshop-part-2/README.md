# AI Sample RAG System

This project demonstrates a simple RAG system over a Slack messages database about some monitoring alerts.
It is meant to provide a working starting point to try out related AI technologies.

## Project overview

### Setup

1. This project uses Bun. Install it and the project dependencies with:

```bash
brew install bun
bun install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Modify .env with values from 1password

### Running the Project

To run the project, use the following commands:

```bash
bun run src/index.ts "your query string"
```

For instance:

```bash
bun run src/index.ts "country code"
```

### Database content

You can connect to the database locally using an new SQLite Connection.
Choosing the path of your local.db file for "Database path"

## Tasks

The goal of this workshop is to have have you hands-on experience with an AI project. Feel free to do whatever you want with the project, but here are some suggestions:

### Understand the starting point

Read through the code and/or ask Copilot questions about the project with the `#codebase` context.
Go through `./src/openai.ts` and `./src/index.ts` to understand the AI models used and the workflow. Try to modify the prompt that generates the message to see how it affects the output.

Technology choices:
- **Database**: `libSQL`, a rewrite of SQLite that includes vectors support. It allows to store a database in a file and commit it (`local.db`).
- **AI**: [`openai`](https://github.com/openai/openai-node) since this starting point uses only openAI models.

### Improve the message generation

Use a structured output to have the AI structure the generated message better. For instance, you could generate a title and a body, use formatting that matches the slack API, etc.

### Improve the messages ingestion

Instead of embedding messages directly, you could try to extract structured data using an LLM and use it to populate other fields in the database that the AI could use to generate the summary message at the end.

### Create an agent

Setup a slack tool for the AI to interact with a message, for instance adding a comment in a thread summarizing the error context whenever there is something relevant to highlight.

### Try other AI libraries

Replace the openai library with another one, like [Vercel's AI SDK](https://sdk.vercel.ai/docs/introduction), or [Llama Index](https://ts.llamaindex.ai/).
It's probably not necessary with the current setup, but it's a good exercise to understand how the they abstract concepts like tools or RAG and how they can be used in a project.

### Delete everything and start another prototype from scratch

If you want to use another usecase, feel free to do so. You can use the config and the boilerplate as a starting point.

## TODO

- [x] Explain the default setup and customization options
- [x] Explain the default workflow and how to customize it
  - Llama Index
  - Vercel AI SDK
- [ ] Add more examples in db
