FROM node:lts-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV COREPACK_DEFAULT_TO_LATEST=0
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    corepack pnpm install --frozen-lockfile
COPY . .
RUN --mount=type=cache,target=/app/.angular/cache \
    corepack pnpm build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/frontend/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
