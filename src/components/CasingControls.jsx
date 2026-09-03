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
      <div className="grid grid-cols-5 gap-3 w-full">
        {OPTIONS.map(opt => {
          const isActive = activeOption === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChangeOption(opt.id)}
              className={`px-1 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'shadow-neo-in text-neo-text bg-neo-bg scale-95'
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
