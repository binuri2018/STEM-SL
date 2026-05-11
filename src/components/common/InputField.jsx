export function InputField({
  id,
  label,
  hint,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-emerald-950">
          {label}
        </span>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-2xl border border-emerald-900/10 bg-white/90 px-4 py-3 text-base text-emerald-950 shadow-inner shadow-emerald-900/5 outline-none ring-emerald-500/30 placeholder:text-emerald-950/35 focus:border-emerald-400 focus:ring-4 ${inputClassName}`}
        {...props}
      />
      {hint ? (
        <span className="mt-2 block text-sm text-emerald-900/55">{hint}</span>
      ) : null}
    </label>
  )
}
