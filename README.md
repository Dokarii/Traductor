# Traductor di canzoni

Un traductor web potenciado con Inteligencia Artificial que entiende de verdad lo que se quiere decir: el tono, la actitud y hasta el _slang_, sin esas traducciones rígidas y artificiales de los traductores tradicionales

En un principio lo diseñé para traducir letras de canciones (porque respeta al pie la correspondencia línea por línea), pero la aplicación funciona perfectamente para traducir párrafos completos, diálogos, posts en redes sociales o cualquier texto sin ningún problema. 

> **Nota sobre los idiomas:** Este proyecto nació pensado principalmente en inglés y japonés, pero el modelo de IA integrado traduce cualquier idioma al español latinoamericano con la misma naturalidad

## Características Principales

- **Traductor Cultural (Nada de traducciones literales):** Detecta la jerga (como “low-key salty” o “ghosted”) y la convierte en la actitud o emoción que realmente transmite en español cotidiano (por ejemplo, no dice “bajito molesta” (low-key salty), sino “en el fondo está picada”)
- **Estructura 1:1:** Ideal para creadores de subtítulos. Devuelve exactamente el mismo número de líneas, sin fusionar ni dividir, respetando cada salto de párrafo
- **Diseño Neumórfico:** Interfaz ultra limpia, responsiva y sin scrollbars globales para mantener el enfoque solo en el texto.
- **Zonas Click-to-Copy:** Copia al portapapeles de manera independiente la línea original o su traducción con un solo clic.
- **Arquitectura Segura:** Usa Serverless Functions (Vercel) como backend proxy para ocultar y proteger la API Key.

## Stack Tecnológico

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions (`/api/translate`)
- **Inteligencia Artificial:** Qwen-Plus (Alibaba DashScope API) con *Few-Shot Prompting* avanzado.

## Seguridad Implementada

- API Keys nunca expuestas al navegador.
- Protección Rate Limiting en memoria para evadir spam y bots.
- Validación estricta de entradas (Rechazo de textos vacíos y límite seguro de 5000 caracteres por request).
- Cabeceras estrictas HTTP inyectadas vía `vercel.json` (CSP, HSTS, X-Frame-Options).

## Desarrollo Local

Para correr este proyecto en tu máquina local solo debes seguir estos pasos:

1. **Clona el repositorio e instala las dependencias:**
   ```bash
   git clone https://github.com/Dokarii/Traductor.git
   cd Traductor
   npm install
   ```

2. **Configura tu entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y pega tu llave de Qwen:
   ```env
   QWEN_API_KEY=tu_api_key_aqui
   ```

3. **Inicia el entorno de pruebas:**
   Dado que utilicé el backend seguro de Vercel, es necesario levantar el entorno local usando su CLI (esto levantará el Frontend y el Backend simultáneamente):
   ```bash
   npx vercel dev
   ```
