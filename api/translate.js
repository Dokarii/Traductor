const rateLimit = new Map();
const LIMIT = 25; 
const WINDOW_MS = 60 * 1000; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  } else {
    const data = rateLimit.get(ip);
    if (now > data.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else if (data.count >= LIMIT) {
      return res.status(429).json({ error: 'Demasiadas peticiones. Por favor, espera un minuto.' });
    } else {
      data.count++;
    }
  }

  const { text } = req.body;
  if (text === undefined || text === null) return res.status(400).json({ error: 'Falta el texto a traducir.' });
  if (typeof text !== 'string') return res.status(400).json({ error: 'El formato es inválido.' });
  
  const cleanText = text.trim();
  if (cleanText.length === 0) return res.status(400).json({ error: 'El texto no puede estar vacío.' });
  if (cleanText.length > 5000) return res.status(413).json({ error: 'Excede el límite de 5000 caracteres.' });

  const API_KEY = process.env.QWEN_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API Key no configurada en el servidor (Vercel).' });

  const API_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

  const systemPrompt = `Eres un traductor especializado. Tu tarea principal es traducir texto al español cotidiano de forma natural.

REGLAS DE ORO (TRADUCCIÓN):
1. Reinterpreta, no traduzcas. Prioriza que la oración suene como si alguien la hubiera dicho originalmente en español de forma natural.
2. Identifica el slang (como "low-key", "salty", "ghosted", "cap", etc.). NUNCA las traduzcas de forma literal. Sustitúyelas por la EMOCIÓN o ACTITUD que transmiten en español latino casual (ej. "medio", "un poco", "ardida", "picada").
3. Tienes total libertad para cambiar la estructura de la oración si eso hace que en español suene más fluido (siempre y cuando respetes la separación por líneas).

REGLA ESPECIAL — ROMANIZACIÓN:
Analiza el idioma fuente del texto. Si el idioma usa un sistema de escritura NO latino (por ejemplo: japonés con kanji/hiragana/katakana, coreano con hangul, chino con caracteres, árabe, tailandés, hebreo, hindi/devanagari, griego, etc.), entonces DEBES incluir la romanización/pronunciación de la línea original.

La romanización usa el sistema estándar de cada idioma:
- Japonés → Romaji (sistema Hepburn)
- Coreano → Romanización revisada del coreano
- Chino → Pinyin (sin tonos numéricos, solo el texto)
- Árabe → Transliteración ALA-LC simplificada
- Otros → el sistema de romanización estándar más común

Si el idioma SÍ usa escritura latina (inglés, español, francés, italiano, portugués, etc.), NO incluyas romanización.

REGLAS DE FORMATO (CRÍTICAS PARA LA UI):
1. Recibirás un texto dividido en líneas.
2. Debes devolver EXACTAMENTE el mismo número de líneas.
3. Mantén la correspondencia 1 a 1. No unas líneas ni las dividas.
4. NO agregues introducciones, conclusiones, ni viñetas.
5. NUNCA agregues un punto final (.) al terminar ningún segmento.

FORMATO DE SALIDA POR LÍNEA:
- Si el idioma fuente usa escritura LATINA: devuelve solo la traducción al español.
  Ejemplo: Traducción al español

- Si el idioma fuente usa escritura NO LATINA: devuelve la traducción, luego " ||| " (espacio, tres pipes, espacio), luego la romanización de la línea ORIGINAL.
  Ejemplo: Traducción al español ||| romanizacion del original

El separador es exactamente: " ||| " (un espacio, tres barras verticales, un espacio).`.trim();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: cleanText }
        ],
        temperature: 0.7
      })
    });

    // PARSEO SEGURO PARA EL LLM
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error("Respuesta no-JSON de Qwen:", responseText);
      return res.status(502).json({ error: 'El proveedor de Inteligencia Artificial devolvió un formato inválido.' });
    }

    if (!response.ok) {
      console.error("Error devuelto por Qwen:", data);
      return res.status(response.status).json({ error: data.error?.message || 'El proveedor de IA rechazó la solicitud.' });
    }

    const translatedText = data.choices?.[0]?.message?.content;
    if (!translatedText) {
      return res.status(502).json({ error: 'La respuesta de la IA llegó vacía.' });
    }

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Backend fetch error:", error);
    return res.status(500).json({ error: 'Error interno de red en el servidor.' });
  }
}
