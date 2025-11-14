import ButtonWithIcon from './ButtonWithIcon'

interface ProductCardProps {
  image: string
  title: string
  price?: string
  showBagIcon?: boolean
  showExploreCursor?: boolean
  className?: string
  buttonText?: string
  buttonVariant?: 'green-bg' | 'beige-bg'
  onButtonClick?: () => void
}

const ProductCard = ({ 
  image, 
  title, 
  price, 
  showBagIcon = false, 
  showExploreCursor = false,
  className = '',
  buttonText = 'Add to Cart',
  buttonVariant = 'green-bg',
  onButtonClick,
}: ProductCardProps) => {
  const imgIconsBag = '/assets/4a54ca008001ba7c29031f6c9d13f1d903f2fd81.svg'
  const imgEllipse2 = '/assets/38414d9e71da5ebebf4e70427520972782de7ab0.svg'
  const imgEllipse3 = '/assets/4316ff976e555230865bc749c36ac9da28398e29.svg'

  return (
    <div className={`group flex flex-col gap-4 ${className}`}>
      <div className="border border-brand-main-30 border-solid flex flex-col relative">
        <div className="relative w-full aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center pointer-events-none" 
          />
          {showExploreCursor && (
            <div 
              className="absolute left-[279px] top-[156px] w-20 h-20 shadow-[0px_8px_16px_0px_#54ab8e]"
              style={{ left: 'calc(100% - 100px)' }}
            >
              <div className="absolute inset-0">
                <img src={imgEllipse2} alt="" className="w-full h-full" />
              </div>
              <div className="absolute flex inset-0 items-center justify-center">
                <div className="flex-none rotate-180 w-20 h-20">
                  <div className="relative w-full h-full">
                    <img src={imgEllipse3} alt="" className="w-full h-full" />
                  </div>
                </div>
              </div>
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-karla font-light text-brand-main-90 text-base text-center whitespace-pre">
                Explore
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {showBagIcon && (
              <img src={imgIconsBag} alt="Bag" className="w-[27px] h-[27px]" />
            )}
            <p className="font-karla font-bold text-brand-main-20 text-base sm:text-lg text-left">
              {title}
            </p>
          </div>
          {price && (
            <p className="font-karla font-normal text-brand-main-30 text-sm sm:text-base">
              {price}
            </p>
          )}
        </div>
      </div>
      {buttonText && (
        <div className="pointer-events-none flex justify-center opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <ButtonWithIcon text={buttonText} variant={buttonVariant} onClick={onButtonClick} />
        </div>
      )}
    </div>
  )
}

export default ProductCard

