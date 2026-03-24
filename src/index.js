import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

import { analyzeDream } from './analyze.js';
import { getLanguage } from './functions/lang.js'
import { Pages } from './pages/index.js'
import { Layout } from './layout.jsx'
import { handleBase } from './pages/base.js'

/** @jsx jsx */
import { jsx } from 'hono/jsx'

const app = new Hono();

app.use('*', async (c, next) => {
  const cf = c.req.raw.cf || {};
  const lang = getLanguage(cf);
  const data = { lang, cf, userLat: cf.latitude || 37.5665, userLng: cf.longitude || 126.9780 };
  c.set('data', data);
  await next();
});

app.get('/assets/*', serveStatic({ root: './' }))
app.get('/', (c) => {
  const data = c.get('data');
  const host = c.req.header('host') || 'chktime.com';
  const Main = Pages.main; // 컴포넌트 추출
  
  return c.html(
<Layout title={host}>
  <Main data={data} />
</Layout>
  );
});

app.post('/api/analyze', async (c) => {
  try {
    const { dream, targetLangName = "Korean" } = await c.req.json();
    const result = await analyzeDream(dream, targetLangName, c.env.GEMINI_API_KEY);
    return c.json({ result });
  } catch(e) {
    console.log(e);
    return c.json({error:"에러 : " + e.message}, 500)
  }
});

app.get('/ws', upgradeWebSocket((c) => {
  const url = new URL(c.req.url);
  const domain = url.searchParams.get('domain') || 'unknown';
  let timer = null;

  return {
    onMessage(event, ws) {
      if (event.data === 'READY') {
        setTimeout(() => {
          let progress = 0;
          const runScan = () => {
            progress += 1;  
            
            if (progress >= 100) {
              ws.send(JSON.stringify({ type: 'PROGRESS', value: 100, status: 'DONE' }));
              return;
            }

            ws.send(JSON.stringify({ type: 'PROGRESS', value: progress, status: 'SCANNING' }));

            const nextTick = Math.floor(Math.random() * 20) + 2;
            timer = setTimeout(runScan, nextTick);
          };
          runScan();
        }, 500);
      }
    },
    onClose: () => {
      if (timer) clearTimeout(timer);
      console.log(`[WS] ${domain} 연결 종료 및 타이머 정리`);
    } 
  };
}));

function route(c) {
  const { page, ext } = c.req.param();
  const data = c.get('data');
  const host = c.req.header('host') || 'chktime.com';
  const url = new URL(c.req.url);

  // 1. 우선 handleBase(SEO/시스템 파일)인지 먼저 확인 (우선순위 높음)
  const baseResponse = handleBase(url);
  if (baseResponse) return baseResponse;

  // 2. 일반 페이지 컴포넌트 확인
  const pageKey = page.toLowerCase();
  let Component = Pages[pageKey];

  if (!Component) {
    return c.notFound();
  }

  return c.html(
    <Layout title={host}>
      <Component data={data} />
    </Layout>
  );
}

// 라우트 등록
app.get('/:page', route);
app.get('/:page/:ext', route);
app.get('/.well-known/:file', route);

export default app