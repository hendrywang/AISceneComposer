import express from 'express';
import { generateRouter } from './routes/generate';

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'asc-api' });
});

app.use('/api/generate', generateRouter);

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`[asc-api] listening on :${port}`);
});
