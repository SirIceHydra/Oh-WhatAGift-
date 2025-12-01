import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  learnMoreHref?: string;
}

export default function ProductCard({
  image,
  name,
  description,
  price,
  learnMoreHref = '#',
}: ProductCardProps) {
  return (
    <div className="w-full max-w-[384.7px]">
      {/* Product Image */}
      <div className="mb-4 w-full h-[573px] rounded-[20px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={384.7}
          height={573}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Name - H5, Center Aligned */}
      <h5 className="text-center mb-2 text-brand-light-gold">{name}</h5>

      {/* Short Description - 13.6px, Left Aligned */}
      <p className="text-[13.6px] text-left mb-3 text-brand-grey-green">{description}</p>

      {/* Price and Learn More Row */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-left text-brand-grey-green">{price}</h4>
        <a
          href={learnMoreHref}
          className="flex items-center gap-2 text-brand-light-gold text-[10px]"
        >
          LEARN MORE
          <ArrowRight size={10} />
        </a>
      </div>

      {/* Add to Cart Button */}
      <Button className="w-full border-brand-green text-brand-green">
        ADD TO CART
      </Button>
    </div>
  );
}
