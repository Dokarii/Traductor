export default function TextInput({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full flex-1 min-h-0">
      <label className="text-sm font-semibold tracking-wide ml-1 shrink-0">
        Texto Original
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pegar texto aquí..."
        className="w-full flex-1 p-4 rounded-xl bg-neo-bg shadow-neo-in focus:outline-none resize-none text-neo-text placeholder-neo-text/50 transition-shadow min-h-[150px]"
      />
    </div>
  );
}
