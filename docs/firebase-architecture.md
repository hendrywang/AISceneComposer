# Firebase 架构设计

> 状态:草稿 v0.1
> 最后更新:2026-06-11
> 关联:主文档 [development-plan.md](./development-plan.md)(D13 Firebase 全家桶);结构见 [project-structure.md](./project-structure.md)
> 成本/价格估算见项目 skill:`.claude/skills/ai-scene-composer/SKILL.md`

---

## TL;DR

- **托管 = 经典 Firebase Hosting**(不是 App Hosting)。Expo web 是静态 SPA,经典 Hosting 才对口。
- **`/api/**` 用 Hosting rewrite 接到 Cloud Run\*\* → 网页与 API 同源,免 CORS。
- **生成后端 = 独立 Cloud Run(Node)**,持有模型密钥,绝不进客户端。
- **安全底线 = App Check + Security Rules**(按 `ownerId`/`uid` 隔离)。
- 数据 → Firestore;资产/截图/成图 → Cloud Storage;登录 → Auth。

## 1. 托管:经典 Hosting vs App Hosting

|        | 经典 Firebase Hosting | Firebase App Hosting                                 |
| ------ | --------------------- | ---------------------------------------------------- |
| 定位   | 静态资源 + 全球 CDN   | **SSR 框架**全栈托管                                 |
| 适合   | 静态 SPA / 静态导出   | Next.js、Angular 等需服务端渲染                      |
| 底层   | 纯 CDN                | Cloud Build + Cloud Run + CDN(连 GitHub,push 即部署) |
| 本项目 | ✅ **正解**           | ❌ 过度设计                                          |

Expo 的 `expo export -p web` 产出**静态 SPA,无 SSR**,所以用经典 Hosting。App Hosting 会附带一个我们用不上的"渲染网页"用 Cloud Run。

> 区分:App Hosting 自带的 Cloud Run 是渲染网页用的;我们"调 Gemini"的 Cloud Run 是**另一个独立服务**,两者不要混。只有将来前端换成 SSR 框架,才考虑 App Hosting。

## 2. 产品 → 角色映射

| 需求                   | Firebase 产品                         | 说明                                            |
| ---------------------- | ------------------------------------- | ----------------------------------------------- |
| Web 托管               | **经典 Hosting**                      | CDN + `/api` rewrite 到 Cloud Run               |
| 登录                   | **Authentication**                    | 三端共用;Google / 邮箱                          |
| 场景/项目数据          | **Cloud Firestore**                   | `Scene` 文档,按 `ownerId`                       |
| 资产/截图/成图         | **Cloud Storage**                     | glTF、缩略图、AI 成图;配 CORS + 规则            |
| 调模型的后端           | **Cloud Run**(独立 Node)              | 模型密钥只在服务端                              |
| 访问控制               | **Security Rules**                    | Firestore + Storage 按归属隔离                  |
| 防滥用                 | **App Check**                         | 证明请求来自真实 App;保护 Run/Firestore/Storage |
| 异步/排队(按需)        | **Cloud Tasks**                       | 生成耗时;MVP 可先同步                           |
| 缩略图/清理(可选)      | **Cloud Functions 触发器**            | 如上传 glTF 自动生成缩略图                      |
| 本地开发               | **Emulator Suite**                    | 本地跑 Auth/Firestore/Storage/Functions         |
| prompt 模板/开关(可选) | **Remote Config**                     | 写实/二次元两套 prompt 不发版即可改(配合 T13)   |
| 调用模型               | **Vertex AI / Gemini**(Nano Banana 2) | Cloud Run 服务端调                              |

## 3. 请求流

```
桌面 / iPad 浏览器(Expo web 静态构建)
   │ 静态资源        ┌──────────────► Firebase Hosting (CDN)
   │ 登录            ├──────────────► Firebase Auth
   │ 读写场景        ├──────────────► Cloud Firestore   (Rules: ownerId)
   │ 读写资产/图     ├──────────────► Cloud Storage     (Rules + CORS)
   │ POST /api/generate
   └─────────────────┴─ Hosting ──(rewrite)──► Cloud Run (Node)
                                                  │ 调模型 ──► Vertex AI / Gemini(Nano Banana 2)
                                                  └ 存成图 ──► Cloud Storage
   ↑ 所有请求携带 App Check 令牌
```

## 4. Hosting rewrite → Cloud Run(同源,免 CORS)

经典 Hosting 可把路径重写到 Cloud Run,使网页与 API **同域**,前端调 `/api/...` 即可,不必处理跨域、也不暴露 Run 原始地址。

```jsonc
// firebase.json(示意,以官方最新语法为准)
{
  "hosting": {
    "public": "apps/client/dist",
    "rewrites": [
      { "source": "/api/**", "run": { "serviceId": "api", "region": "asia-east1" } },
      { "source": "**", "destination": "/index.html" }, // SPA 路由兜底
    ],
  },
}
```

> region 选离用户最近的区域(亚洲可用 `asia-east1` / `asia-southeast1`)。

## 5. 可选简化:Firebase AI Logic(自用阶段可不写后端)

**Firebase AI Logic**(原 "Vertex AI in Firebase")提供客户端 SDK **直接安全调用 Gemini**(含图像生成),用 App Check 防滥用,**无需自建后端**。

|        | Firebase AI Logic                  | Cloud Run 代理(本项目选型) |
| ------ | ---------------------------------- | -------------------------- |
| 上手   | 最快,省掉后端                      | 需写/部署服务              |
| 控制力 | 弱(无队列/缓存/审核/限流/计费聚合) | 强                         |
| 适用   | 纯自用、求快                       | 自用→商业化的长期路径      |

**推荐 Cloud Run**(D14,支撑异步与商业化);若只想自用最快跑通,可临时用 AI Logic,日后再迁。

## 6. 安全:App Check + Security Rules

**App Check**:在各服务(Cloud Run / Firestore / Storage)开启强制,Web 端用 reCAPTCHA 提供证明令牌。这是最小防滥用底线。

**Firestore 规则(骨架)**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /scenes/{sceneId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.ownerId;
    }
  }
}
```

**Storage 规则(骨架)**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 用户私有产物(截图、成图)按 uid 隔离
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // 公共只读预设资产(glTF、缩略图)
    match /models/{allPaths=**} {
      allow read: if true;
      allow write: if false;   // 仅后台/管理上传
    }
  }
}
```

## 7. 配套产品(按需引入)

- **Cloud Tasks**:把生成请求入队,Cloud Run 消费;MVP 可先同步,延迟/规模变大再上。
- **Cloud Functions 触发器**:Storage `onFinalize` 自动生成缩略图;Firestore 触发做清理。
- **Emulator Suite**:本地联调 Auth/Firestore/Storage/Functions,不动线上。
- **Remote Config**:存两套 prompt 模板与功能开关,调"配方"不必重新部署。

## 8. 建议汇总

1. 托管用**经典 Hosting**,`/api` rewrite 到 Cloud Run(同源免 CORS)。
2. 保留 **Cloud Run** 做生成后端;MVP 同步调用,需要时加 Cloud Tasks。
3. 开 **App Check + Security Rules**,最小安全底线。
4. 本地用 **Emulator Suite** 开发。
5. (可选)**Remote Config** 存 prompt 模板,调配方不发版。
