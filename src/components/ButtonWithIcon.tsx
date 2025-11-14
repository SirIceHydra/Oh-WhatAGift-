import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface ButtonWithIconProps {
  text: string
  onClick?: () => void
  className?: string
  variant?: 'green-bg' | 'beige-bg' // green-bg sections get beige hover, beige-bg sections get green hover
}

const ButtonWithIcon = ({ text, onClick, className = '', variant = 'green-bg' }: ButtonWithIconProps) => {
  const hoverClass = variant === 'beige-bg' 
    ? 'hover:bg-brand-main-90 hover:border-brand-main-90 hover:text-black' // beige sections get green hover
    : 'hover:bg-[#fefaf5] hover:border-[#fefaf5] hover:text-black' // green sections get beige hover

  return (
    <button 
      className={`btn-brand ${hoverClass} ${className}`}
      onClick={onClick}
    >
      <span>{text}</span>
      <ArrowRightIcon className="w-6 h-6" aria-hidden="true" />
    </button>
  )
}

export default ButtonWithIcon

