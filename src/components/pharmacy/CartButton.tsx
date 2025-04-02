
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  totalItems: number;
  onClick: () => void;
}

const CartButton = ({ totalItems, onClick }: CartButtonProps) => {
  return (
    <Button
      variant="outline"
      className="relative flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      View Cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-mediwrap-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
