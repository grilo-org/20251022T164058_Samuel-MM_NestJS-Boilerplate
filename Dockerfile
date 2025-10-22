FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app

ENV HUSKY=0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN pnpm build

FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable
ENV HUSKY=0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000
CMD ["pnpm", "start"]


