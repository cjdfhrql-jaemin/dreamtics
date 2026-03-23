import { html } from 'hono/html'

// 1. TS 타입 주석 제거
export default function Main({ data }) {
  // 2. html`` 템플릿 리터럴은 JS 표준이므로 그대로 사용 가능
  return html`
<div id="main-view" class="animate-fade">
    <h2>${data.lang.title}</h2>
    <textarea id="dreamBox" placeholder="${data.lang.text_holder}" maxlength="100" rows="4"></textarea>
    <div class="char-count" id="charCount">0/100</div>
    <button id="sendBtn">${data.lang.button_text}</button>
</div>

<div id="loading">✨ ${data.lang.processing}..</div>
<div class="content-ad">
  <ins class="adsbygoogle"style="display:block" data-ad-client="ca-pub-1216027646063680" data-ad-slot="3177453636" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>

<div id="result"></div>

<script>
const dreamBox = document.getElementById('dreamBox');
const charCount = document.getElementById('charCount');
const sendBtn = document.getElementById('sendBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');

dreamBox.addEventListener('input', () => {
    charCount.textContent = dreamBox.value.length + '/100';
});

sendBtn.addEventListener('click', async () => {
    const text = dreamBox.value.trim();
    if(!text) return alert("꿈 내용을 적어주세요!");

    sendBtn.disabled = true;
    loading.style.display = 'block';
    result.style.display = 'none';

    try {
        // 같은 도메인의 /analyze 경로로 호출
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dream: text })
        });
        
        const data = await res.json();
        result.innerHTML = data.result;
        result.style.display = 'block';
    } catch (e) {
        alert("분석 실패: " + e.message);
    } finally {
        sendBtn.disabled = false;
        loading.style.display = 'none';
    }
});
</script>
  `;
}