FROM node:20-slim AS builder

RUN npm install -g pnpm

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/utils/package.json ./packages/utils/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM oven/bun:1

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/turbo.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/utils/node_modules ./packages/utils/node_modules

COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages/utils ./packages/utils

ENV PORT=${PORT:-3000}
ENV NODE_ENV=production
ENV FRONTEND_URL=${FRONTEND_URL}
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_AUTH_TOKEN=${DATABASE_AUTH_TOKEN}
ENV CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
ENV CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
ENV CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}  
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

EXPOSE $PORT

CMD ["bun", "apps/api/src/index.ts"]
