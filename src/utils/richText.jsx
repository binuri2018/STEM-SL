/**
 * Minimal **bold** rendering without bringing markdown deps.
 * @param {string} text
 */
export function renderRichText(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-emerald-950">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}
