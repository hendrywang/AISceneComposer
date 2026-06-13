# Deployment (Firebase Hosting + Cloud Run)

托管用经典 Firebase Hosting(静态 SPA + CDN),`/api/**` 经 rewrite 接 Cloud Run(同源免 CORS)。
背景与取舍见 [firebase-architecture.md](./firebase-architecture.md)。

## 前置

- 安装 `firebase-tools` 与 `gcloud` CLI,登录到一个**已启用计费**的 Firebase / GCP 项目。
- 把 `.firebaserc` 里的 `your-firebase-project-id` 换成你的项目 ID。
- 准备 `GEMINI_API_KEY`(出图必需),建议放进 Secret Manager。

## 1. 构建 Web 客户端

```bash
pnpm gen
pnpm build:web            # 产物在 apps/client/dist
```

> 默认前端走**同源** `/api`(经 Hosting rewrite),无需配置后端地址。
> 仅当要直连 Cloud Run(不经 rewrite)时,在构建期注入:
> `EXPO_PUBLIC_API_URL=https://<run-service-url> pnpm build:web`

## 2. 先部署 API 到 Cloud Run(region:asia-east1)

```bash
gcloud run deploy api \
  --source services/api \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_IMAGE_MODEL=gemini-3.1-flash-image,ALLOWED_ORIGIN=https://<project>.web.app
```

密钥用 Secret Manager,不要写进 `--set-env-vars`:

```bash
gcloud run services update api --region asia-east1 \
  --update-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

> - `NODE_ENV=production` 下 `SKIP_AUTH` 会被忽略,强制 Firebase 鉴权(见 `services/api/src/middleware/auth.ts`)。
> - `--source` 用 Cloud Build buildpacks;若存在 `services/api/Dockerfile` 则用之(node:20-slim,tsx 直跑)。
> - Cloud Run 在反向代理后,服务已设 `trust proxy`,限流按真实客户端 IP 生效。

## 3. 再部署 Hosting + 安全规则(Cloud Run 必须先存在)

```bash
firebase deploy --only hosting,firestore:rules,storage:rules
```

`firebase.json` 把 `/api/**` rewrite 到名为 `api` 的 Cloud Run 服务(同源,免 CORS)。
**rewrite 顺序关键**:`/api/**` 必须排在 SPA 兜底 `**` 之前,否则 API 请求会被 `index.html` 吞掉。

## 4. 验证

```bash
curl https://<project>.web.app/api/health     # → {"ok":true,"service":"asc-api"}
```

打开站点 → 摆景 / 设机位 → 点 ✨ → 输入提示词 → 生成,应返回成图。

## 备注

- **归属隔离**:`scenes/{id}` 仅 `ownerId` 本人可读写;`users/{uid}/**` 私有;`models/**` 公共只读。
- **限流**:默认 10 次 / 分钟 / IP(`RATE_LIMIT_MAX`、`RATE_LIMIT_WINDOW_MS` 可调)。
- **CORS**:同源 rewrite 下不参与;直连 / 本地跨端口才需 `ALLOWED_ORIGIN`。
- **成本**:出图占账单约 99%,每张约 $0.067(Gemini 3.1 Flash @1024px);其余服务自用量级基本在免费额度内。详见项目 skill 与 [development-plan.md](./development-plan.md)。
- 本地联调可用 `firebase emulators:start` 校验规则,部署前用 `firebase deploy --dry-run` 验证配置。
