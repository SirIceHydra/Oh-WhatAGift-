interface ButtonWithIconProps {
  text: string
  onClick?: () => void
  className?: string
  variant?: 'green-bg' | 'beige-bg' // green-bg sections get beige hover, beige-bg sections get green hover
}

const ButtonWithIcon = ({ text, onClick, className = '', variant = 'green-bg' }: ButtonWithIconProps) => {
  const imgIconsNext = '/assets/d8392f3bde591d9140b73e5dfb0ed230dc741f90.svg'
  
  const hoverClass = variant === 'beige-bg' 
    ? 'hover:bg-brand-main-90 hover:border-brand-main-90 hover:text-black' // beige sections get green hover
    : 'hover:bg-[#fefaf5] hover:border-[#fefaf5] hover:text-black' // green sections get beige hover

  return (
    <button 
      className={`btn-brand ${hoverClass} ${className}`}
      onClick={onClick}
    >
      <span>{text}</span>
      <img src={imgIconsNext} alt="" className="w-6 h-6" />
    </button>
  )
}

export default ButtonWithIcon

