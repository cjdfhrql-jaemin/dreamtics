/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, Fragment } from 'hono/jsx'

// 1. props로 title을 넘겨받아야 함. 화살표 함수 뒤에 바로 ( ) 를 쓰면 return이 생략됨.
const Head = (data) => (
  <head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<meta name="google-adsense-account" content="ca-pub-1216027646063680" />
<meta name="naver-site-verification" content="d9fe0a1fe3bcc4892af3e2bf25889c89d7595ab3" />
<meta name="description" content="${data.pageDesc}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="${data.pageUrl}" />
<meta property="og:title" content="${data.pageTitle}" />
<meta property="og:description" content="${data.pageDesc}" />
<meta property="og:image" content="${data.ogimage}" />

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${data.pageUrl}" />
<meta property="twitter:title" content="${data.pageTitle}" />
<meta property="twitter:image" content="${data.ogimage}" />
<meta property="twitter:description" content="${data.pageDesc}" />

<link rel="canonical" href="${data.pageUrl}" />
<link rel="stylesheet" href="/assets/style.css" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1216027646063680" crossorigin="anonymous"></script>

<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsMjAgQzEwLDQwIDEwLDcwIDMwLDkwIEM0NSw5NSA2NSw5MCA3NSw3NSBDNjAsODUgMzUsODAgMjUsNTUgQzIwLDM1IDM1LDE1IDU1LDEwIEM0NSw1IDM1LDEwIDMwLDIwIiBmaWxsPSIjNjM2NmYxIi8+PHJlY3QgeD0iNDUiIHk9IjQ1IiB3aWR0aD0iMTAiIGhlaWdodD0iMzAiIHJ4PSIyIiBmaWxsPSIjMjJkM2VlIi8+PHJlY3QgeD0iNjAiIHk9IjM1IiB3aWR0aD0iMTAiIGhlaWdodD0iNDAiIHJ4PSIyIiBmaWxsPSIjMDZiNmQ0Ii8+PHJlY3QgeD0iNzUiIHk9IjI1IiB3aWR0aD0iMTAiIGhlaWdodD0iNTAiIHJ4PSIyIiBmaWxsPSIjMDg5MWIyIi8+PC9zdmc+" />
<title>AI Dream Interpretation</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap" />
  </head>
);

const Footer = () => (
  <footer role="contentinfo">
    <div class="copy">&copy; 2026 DREAMTICS.NET  Built with <a href="https://cloudflare.com" target="_blank">cloudflare.com</a></div>
    <ul>
      <li><a href="/about">About</a></li>
      <li><a href="/terms">Terms of Service</a></li>
      <li><a href="/policy">Privacy Policy</a></li>
    </ul>
  </footer>
);

// 2. 인자로 title과 children을 받아야 함
export const Layout = ({title,data,children}) => {
  return (
    <html lang="ko">

      <Head title={title} />

      <body>
        <div class="container">
          <div class="logo"><a href="/">DREAMTIS.NET</a></div>
          <main class="box" role="main">
            {children}
          
            <div class="left-side side-ad"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1216027646063680" data-ad-slot="9131653743" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>
            <div class="right-side side-ad"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1216027646063680" data-ad-slot="7279516023" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>

          </main>

          <Footer />

        </div>
      </body>
    </html>
  );
};