// dreamAnalyst.js
export async function analyzeDream(dream, targetLangName, GEMINI_API_KEY) {
  const prompt = `
# Role: Global Expert Dream Analyst & Jungian Psychologist
# Task: Provide a professional and deep interpretation of the user's dream in ${targetLangName}.

# Structured Output Format:
1. **Nature of the Dream**: Categorize the dream as [Auspicious / Inauspicious / Neutral / Conception] and provide a summary (approx. 50 characters) explaining why.
   - Note: Translate categories [길몽, 흉몽, 평몽, 태몽] appropriately into ${targetLangName}.

2. **Detailed Analysis**
   [Traditional Perspective]
   Interpret the symbolic meanings based on cultural and traditional archetypes.
   
   [Psychological Perspective]
   Analyze subconscious desires, anxieties, or current mental states based on modern psychology.

3. **Actionable Guidance**
   - Provide specific advice or precautions the user should take in their daily life based on the dream's message.

4. **Luck Elements**
   - Suggest a lucky number and a color that will bring positive energy to the user today.

# Rules & Constraints:
- Start the response immediately with "1. **Nature of the Dream**" (translated into ${targetLangName}).
- Wrap the dream category name in <code> tags (e.g., <code>Auspicious</code>).
- Wrap all section headers and numbers in <strong> tags.
- Use single quotes (' ') instead of double quotes (" ") for the entire response.
- Target Length: Approximately 1000 characters in ${targetLangName}. 
- **CRITICAL**: All output content must be written in ${targetLangName}.

# Dream Content to Analyze:
'${dream}'
`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API Error: ${res.status}`);
  }

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini 응답을 가져오지 못했습니다.";

  // 정규식 처리 로직
  let result = reply.replace(/\*\*(.*?)\*\*/g, "<code>$1</code>");
  result = result.replace(/\*(.*?)<code>/g, "<code>");
  result = result.replace(/\'(.*?)\'/g, "<span class=\"keep-line1\">'$1'</span>");
  result = result.replace(/\((.*?)\)/g, "<span class=\"keep-line2\">($1)</span>");
  result = result.replace(/\[(.*?)\]/g, "<span class=\"keep-line3\">[$1]</span>");

  return result;
}