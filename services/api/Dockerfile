# 草稿:Cloud Run 部署用(pnpm monorepo;运行时用 tsx 直跑 TS)
# 实际部署前再按需优化(多阶段、--prod 等)。
FROM node:20-slim
WORKDIR /app
RUN corepack enable

# 先装依赖(利用缓存)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared-types/package.json packages/shared-types/
COPY services/api/package.json services/api/
RUN pnpm install --filter @asc/api...

# 复制源码
COPY packages/shared-types packages/shared-types
COPY services/api services/api

WORKDIR /app/services/api
ENV PORT=8080
EXPOSE 8080
CMD ["pnpm", "start"]
