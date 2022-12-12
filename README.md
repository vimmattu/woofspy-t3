# Woofspy

Codebase for woofspy, made using slightly modified version of the [T3-stack](https://init.tips).

## Setup for local development

### Prerequisites

- [node](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [docker](https://docs.docker.com/engine/install/)

### Install

```bash
pnpm install
cp .env-example .env
docker compose up --build
```

Until a credentials login is implemented, the client ids and secrets for next-auth providers should be retrieved from their corresponding places, e.g. github for github auth.
