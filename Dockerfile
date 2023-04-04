FROM node:hydrogen-alpine3.16
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN yarn global add pnpm
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["pnpm", "dev"]
