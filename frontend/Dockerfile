FROM node:lts-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack pnpm install
COPY . .
RUN corepack pnpm build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/frontend/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
