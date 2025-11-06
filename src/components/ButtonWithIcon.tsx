interface ButtonWithIconProps {
  text: string
  onClick?: () => void
  className?: string
}

const ButtonWithIcon = ({ text, onClick, className = '' }: ButtonWithIconProps) => {
  const imgIconsNext = '/assets/d8392f3bde591d9140b73e5dfb0ed230dc741f90.svg'

  return (
    <button 
      className={`btn-brand ${className}`}
      onClick={onClick}
    >
      <span>{text}</span>
      <img src={imgIconsNext} alt="" className="w-6 h-6" />
    </button>
  )
}

export default ButtonWithIcon

