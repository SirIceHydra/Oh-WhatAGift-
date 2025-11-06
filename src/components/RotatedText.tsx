interface RotatedTextProps {
  text: string
  className?: string
  baseRotation?: number
}

const RotatedText = ({ text, className = '', baseRotation = 0 }: RotatedTextProps) => {
  const letters = text.split('')
  const rotationStep = 360 / letters.length

  return (
    <div className={`relative ${className}`}>
      {letters.map((letter, index) => {
        const rotation = baseRotation + (index * rotationStep)
        const angle = (rotation * Math.PI) / 180
        const radius = 120
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            <span className="font-karla font-normal text-brand-main-30 text-2xl">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default RotatedText

