const OPTIONS = [
  { id: 'original', label: 'Original' },
  { id: 'all_caps', label: 'TODO MAYÚS' },
  { id: 'all_lower', label: 'todo minús' },
  { id: 'caps_lower', label: 'MAYÚS / minús' },
  { id: 'lower_caps', label: 'minús / MAYÚS' },
];

export default function CasingControls({ activeOption, onChangeOption }) {
  return (
    <div className="flex flex-col gap-3 mt-4 shrink-0">
      <label className="text-sm font-semibold tracking-wide ml-1">
        Formato de Copiado
      </label>
      <div className="grid grid-cols-6 md:grid-cols-5 gap-3 w-full">
        {OPTIONS.map((opt, index) => {
          const isActive = activeOption === opt.id;
          // Móvil: 3 botones arriba (span-2 c/u), 2 botones abajo (span-3 c/u). 
          // Desktop: 5 botones en línea (span-1 c/u).
          const spanClass = index < 3 ? 'col-span-2 md:col-span-1' : 'col-span-3 md:col-span-1';

          return (
            <button
              key={opt.id}
              onClick={() => onChangeOption(opt.id)}
              className={`px-1 py-2 whitespace-nowrap rounded-lg font-medium text-[11px] sm:text-xs md:text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-text/20 ${spanClass} ${
                isActive
                  ? 'shadow-neo-in text-neo-text bg-neo-bg scale-[0.98]'
                  : 'shadow-neo-out hover:shadow-neo-out-sm text-neo-text bg-neo-bg hover:-translate-y-0.5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
