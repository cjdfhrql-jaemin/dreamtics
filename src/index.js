import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

import { analyzeDream } from './analyze.js';
import { getLanguage } from './functions/lang.js'
import { Pages } from './pages/index.js'
import { Layout } from './layout.jsx'

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

app.get('/:page', (c) => {
  const page = c.req.param('page').toLowerCase();
  const data = c.get('data');
  const host = c.req.header('host') || 'chktime.com';

  let Component = Pages[page];
  let found = false;

  if (!Component) {

    const opage = page.replace(/(.*?)\.(.*)/, "$1");
    Component = Pages[opage];
    if(!Component) {
      found = true;
    } else {
      found = false
    }
  }

  if(!found) {
     return c.notFound();
  }

  return c.html(
<Layout title={host}>
  <Component data={data} />
</Layout>
  );
});

export default app