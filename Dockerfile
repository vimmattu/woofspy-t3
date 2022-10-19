FROM node:16.18.0-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm i
CMD ["pnpm", "dev"]
