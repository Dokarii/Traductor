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

  const systemPrompt = `Eres un traductor cultural de inglés a español cotidiano.

REGLAS DE ORO:
1. Reinterpreta, no traduzcas. Prioriza que la oración suene como si alguien la hubiera dicho originalmente en español de forma natural.
2. Identifica el slang (como "low-key", "salty", "ghosted", "cap", etc.). NUNCA las traduzcas de forma literal. Sustitúyelas por la EMOCIÓN o ACTITUD que transmiten en español latino casual (ej. "medio", "un poco", "ardida", "picada").
3. Tienes total libertad para cambiar la estructura de la oración si eso hace que en español suene más fluido (siempre y cuando respetes la separación por líneas).

EJEMPLOS DE TRADUCCIÓN:
Original: "Honestly, I ain't even gonna cap, bro was talking so much crazy shit at the function, but when things got real, he folded like a lawn chair and completely ghosted the whole crew."
❌ MAL (Literal): "En serio, ni siquiera voy a mentir: en la fiesta ese tipo soltó un montón de tonterías... se echó para atrás como una silla plegable..."
✅ BIEN (Natural): "La verdad, no te voy a mentir, el tipo estaba hablando pura mierda en la fiesta, pero a la hora de la verdad, se arrugó y dejó tirado a todo el grupo."

Original: "She is low-key salty because he left her on read, but she's still out here acting like she couldn't care less."
❌ MAL (Literal): "Ella está bajito molesta porque la dejó en visto, pero igual sigue por ahí actuando como si no le importara ni un poco."
✅ BIEN (Natural): "En el fondo está medio picada/ardida porque la dejó en visto, pero igual anda por ahí fingiendo que no le importa en lo más mínimo."

REGLAS DE FORMATO (CRÍTICAS PARA LA UI):
1. Recibirás un texto dividido en líneas.
2. Debes devolver EXACTAMENTE el mismo número de líneas, traduciendo una por una.
3. Mantén la correspondencia 1 a 1. No unas líneas ni las dividas.
4. NO agregues introducciones, conclusiones, ni viñetas. SOLO el texto traducido.
5. NUNCA agregues un punto final (.) al terminar la línea traducida.`.trim();

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
