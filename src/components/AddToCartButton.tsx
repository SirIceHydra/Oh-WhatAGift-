interface AddToCartButtonProps {
  onClick?: () => void
  className?: string
}

const AddToCartButton = ({ onClick, className = '' }: AddToCartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-brand-accent-gold text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-karla font-semibold text-sm sm:text-base hover:bg-brand-main-50 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto ${className}`}
      aria-label="Add to cart"
    >
      Add to Cart
    </button>
  )
}

export default AddToCartButton

