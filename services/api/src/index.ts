import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { generateRouter } from './routes/generate';

const app = express();
// Cloud Run 在反向代理之后:取真实客户端 IP(限流按 IP),否则全员共享一个限流桶。
app.set('trust proxy', 1);

// 安全响应头
app.use(helmet());

// CORS:ALLOWED_ORIGIN 为逗号分隔白名单;不设则开发态回显请求来源(宽松)。
// 生产经 Firebase Hosting rewrite 为同源,CORS 不参与;直连 Cloud Run / 本地跨端口才需要。
const allowed = process.env.ALLOWED_ORIGIN;
app.use(
  cors({
    origin: allowed ? allowed.split(',').map((s) => s.trim()) : true,
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'asc-api' });
});

// 限流:仅作用于昂贵的出图端点(默认 10 次/分钟/IP,可配)。
const genLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  limit: Number(process.env.RATE_LIMIT_MAX ?? 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'too many requests, slow down' },
});
app.use('/api/generate', genLimiter, generateRouter);

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`[asc-api] listening on :${port}`);
});
