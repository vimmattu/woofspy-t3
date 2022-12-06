FROM node:18-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* tsconfig.signaler.json ./
RUN yarn global add pnpm && pnpm i
COPY . .
RUN pnpm build:signaler
CMD ["pnpm", "start:signaler"]
