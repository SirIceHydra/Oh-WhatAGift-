import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <div className="bg-brand-main-90 border-t border-b border-brand-main-30 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 py-2.5 sm:py-3 md:py-4">
          <Link
            to="/embroidered-towels"
            className="font-karla font-normal text-brand-main-20 text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity whitespace-nowrap px-2 sm:px-3"
          >
            Embroidered Towels
          </Link>
          <Link
            to="/tea-towels"
            className="font-karla font-normal text-brand-main-20 text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity whitespace-nowrap px-2 sm:px-3"
          >
            Tea Towels
          </Link>
          <Link
            to="/shop-by-category"
            className="font-karla font-normal text-brand-main-20 text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity whitespace-nowrap px-2 sm:px-3"
          >
            Shop By Category
          </Link>
          <Link
            to="/christmas-gifts"
            className="font-karla font-normal text-brand-main-20 text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity whitespace-nowrap px-2 sm:px-3"
          >
            Christmas Gifts
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Banner

