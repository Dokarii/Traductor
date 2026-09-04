export async function translateText(text) {
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim() !== '');
  
  if (nonEmptyLines.length === 0) return [];

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    // PARSEO SEGURO: Evita el crash "Unexpected end of JSON input"
    const textResponse = await response.text();
    let data;
    try {
      data = textResponse ? JSON.parse(textResponse) : {};
    } catch (e) {
      console.error("Respuesta cruda del servidor local:", textResponse);
      throw new Error(
        response.ok 
          ? "El servidor devolvió una respuesta vacía o inválida." 
          : "El backend no está respondiendo. ¿Estás ejecutando la app con 'npx vercel dev'?"
      );
    }

    if (!response.ok) {
      // CORRECCIÓN SINTÁCTICA: Evitar backticks escapados que rompían el build de Vite
      throw new Error(data.error || "Error HTTP " + response.status + " del servidor.");
    }

    const translatedText = data.translatedText;
    if (!translatedText) {
      throw new Error("El backend no devolvió el texto traducido correctamente.");
    }

    const translatedLines = translatedText.split('\n');

    // Emparejar líneas originales con traducidas
    const results = lines.map((originalLine, index) => {
      if (originalLine.trim() === '') return null;

      let translated = translatedLines[index] || originalLine;
      translated = translated.trim();
      let romanization = null;

      if (translated.includes('|||')) {
        const parts = translated.split('|||');
        translated = parts[0].trim();
        romanization = parts[1].trim();
      } else {
        translated = translated.trim();
      }
      
      // Eliminar punto final
      if (translated.endsWith('.') && !translated.endsWith('..')) {
        translated = translated.slice(0, -1);
      }

      return {
        id: crypto.randomUUID(),
        original: originalLine,
        translated: translated,
        romanization: romanization || null
      };
    }).filter(Boolean);

    return results;
  } catch (error) {
    console.error("Error en translateText:", error);
    throw error;
  }
}
