import { useState } from 'react';

export default function TranslationLine({ item, casingOption }) {
  const [copiedTarget, setCopiedTarget] = useState(null); // 'translated' | 'romanization' | 'original' | null

  // Lógica dinámica de mayúsculas/minúsculas
  const formatText = (text, type) => {
    if (!text) return "";
    switch (casingOption) {
      case 'all_caps':
        return text.toUpperCase();
      case 'all_lower':
        return text.toLowerCase();
      case 'caps_lower':
        return type === 'translated' ? text.toUpperCase() : text.toLowerCase();
      case 'lower_caps':
        return type === 'translated' ? text.toLowerCase() : text.toUpperCase();
      case 'original':
      default:
        return text;
    }
  };

  const formattedTranslated = formatText(item.translated, 'translated');
  const formattedOriginal = formatText(item.original, 'original');

  const handleCopy = async (text, target) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(null), 1500);
    } catch (err) {
      console.error('Error copiando al portapapeles', err);
    }
  };

  return (
    <div className="relative w-full p-2 mb-6 rounded-2xl shadow-neo-out bg-neo-bg flex flex-col gap-1 select-none">
      
      {/* Zona Clicable: Traducción */}
      <button 
        onClick={() => handleCopy(formattedTranslated, 'translated')}
        className={`relative w-full text-left p-3 rounded-xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-text/20 ${
          copiedTarget === 'translated' 
            ? 'shadow-neo-in-sm bg-neo-bg scale-[0.99]' 
            : 'hover:bg-neo-text/5 active:scale-[0.99]'
        }`}
      >
        {copiedTarget === 'translated' && (
          <span className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-bold text-green-600/80">
            ¡Copiado!
          </span>
        )}
        <p className="font-semibold text-lg text-neo-text leading-snug pr-16">
          {formattedTranslated}
        </p>
      </button>

      {/* Separador sutil */}
      <div className="w-11/12 h-[1px] bg-neo-dark/10 self-center rounded-full" />

      {/* Zona Clicable: Original */}
      <button 
        onClick={() => handleCopy(formattedOriginal, 'original')}
        className={`relative w-full text-left p-3 rounded-xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-text/20 ${
          copiedTarget === 'original' 
            ? 'shadow-neo-in-sm bg-neo-bg scale-[0.99]' 
            : 'hover:bg-neo-text/5 active:scale-[0.99]'
        }`}
      >
        {copiedTarget === 'original' && (
          <span className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-bold text-green-600/80">
            ¡Copiado!
          </span>
        )}
        <p className="text-sm font-medium text-neo-text/60 leading-snug pr-16">
          {formattedOriginal}
        </p>
      </button>

      {/* Zona Clicable: Romanización / Pronunciación (solo si aplica) */}
      {item.romanization && (
        <>
          {/* Separador sutil */}
          <div className="w-11/12 h-[1px] bg-neo-dark/10 self-center rounded-full" />

          <button
            onClick={() => handleCopy(item.romanization, 'romanization')}
            className={`relative w-full text-left p-3 rounded-xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-text/20 ${
              copiedTarget === 'romanization'
                ? 'shadow-neo-in-sm bg-neo-bg scale-[0.99]'
                : 'hover:bg-neo-text/5 active:scale-[0.99]'
            }`}
          >
            {copiedTarget === 'romanization' && (
              <span className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-bold text-green-600/80">
                ¡Copiado!
              </span>
            )}
            <div className="flex items-center gap-2 pr-16">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md shadow-neo-in opacity-50">
                rom.
              </span>
              <p className="text-sm font-medium text-neo-text/70 leading-snug italic font-mono">
                {item.romanization}
              </p>
            </div>
          </button>
        </>
      )}

    </div>
  );
}
