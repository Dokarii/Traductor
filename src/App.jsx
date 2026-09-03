import { useState } from 'react';
import TextInput from './components/TextInput';
import CasingControls from './components/CasingControls';
import TranslationLine from './components/TranslationLine';
import { translateText } from './services/qwenApi';

function App() {
  const [inputText, setInputText] = useState('');
  const [casing, setCasing] = useState('original');
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    setResults([]);

    try {
      const translatedLines = await translateText(inputText);
      setResults(translatedLines);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full p-4 md:p-6 font-sans selection:bg-neo-dark/20 overflow-hidden flex flex-col bg-neo-bg">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
        <header className="flex items-center justify-between px-4 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-neo-text drop-shadow-sm">
            Traductor di canzoni
          </h1>
        </header>

        {/* En móvil: columna (flex-col). En desktop: dos columnas iguales (lg:grid lg:grid-cols-2) */}
        <main className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-10 flex-1 min-h-0 pb-2">

          {/* Panel Input: En móvil, shrink-0 para que no se encoja. En desktop, h-full. */}
          <div className="flex flex-col rounded-3xl p-4 md:p-6 lg:p-8 shadow-neo-out bg-neo-bg shrink-0 lg:h-full lg:min-h-0">
            {/* Textarea con altura fija en móvil, flexible en desktop */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-semibold tracking-wide ml-1 shrink-0">
                Texto Original
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pegar texto aquí..."
                className="w-full p-4 rounded-xl bg-neo-bg shadow-neo-in focus:outline-none resize-none text-neo-text placeholder-neo-text/50 transition-shadow h-28 lg:h-auto lg:flex-1 lg:min-h-[150px]"
              />
            </div>

            <CasingControls activeOption={casing} onChangeOption={setCasing} />
            
            <button 
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
              className="mt-4 px-6 py-3 lg:py-4 shrink-0 rounded-xl font-bold text-base lg:text-lg shadow-neo-out hover:shadow-neo-out-sm active:shadow-neo-in disabled:opacity-50 disabled:shadow-neo-in transition-all flex items-center justify-center gap-2"
            >
              {isTranslating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-neo-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traduciendo...
                </>
              ) : 'Traducir Texto'}
            </button>

            {error && (
              <div className="mt-3 p-3 shrink-0 rounded-xl shadow-neo-in text-red-500 font-medium text-sm text-center">
                Error: {error}
              </div>
            )}
          </div>

          {/* Panel Resultados: En móvil, flex-1 para tomar el espacio restante con scroll. */}
          <div className="flex flex-col rounded-3xl p-4 md:p-6 lg:p-8 shadow-neo-in bg-neo-bg flex-1 min-h-0">
            {results.length === 0 && !isTranslating ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                <svg className="w-12 h-12 lg:w-16 lg:h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="text-sm lg:text-base">Los resultados aparecerán aquí...</p>
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0">
                <div className="flex justify-between items-center mb-3 px-2 shrink-0">
                  <h2 className="text-lg lg:text-xl font-bold opacity-80">Resultados</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full shadow-neo-in opacity-70">
                    Clic pa copiar
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-3 pb-4 bg-neo-bg">
                  {results.map((item) => (
                    <TranslationLine 
                      key={item.id} 
                      item={item} 
                      casingOption={casing} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
