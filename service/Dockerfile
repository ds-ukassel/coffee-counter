FROM node:lts-slim as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV COREPACK_DEFAULT_TO_LATEST=0
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    corepack pnpm install
COPY . .
RUN corepack pnpm run build

FROM node:lts-slim
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=production \
    COREPACK_DEFAULT_TO_LATEST=0
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    corepack pnpm install
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
